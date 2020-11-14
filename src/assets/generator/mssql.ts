import { Context } from '@azure/functions';
import { QueryDBVariable, SQLInputs }  from '@assets/connections/mssql';
import { Sanitize, Captialize, HandleError } from '@assets/utils';
import { Primitives } from '@assets/interfaces';
import { FieldAttribute, ReferenceAttribute, Schema, SQLMetadata } from '@assets/interfaces/schema';
import MSSQLConnection from '@assets/connections/mssql';
import * as mssql from 'mssql';
import * as fs from 'fs';

/**
 * https://github.com/techniq/odata-query/blob/master/src/index.ts
 */

type StatementType = 'INSERT' | 'UPDATE' | 'DELETE';

export interface SQLInputObject {
    sql: string;
    variables: QueryDBVariable[];
}

export default class MSSqlGenerator {
    // Class variables
    private ctx: Context;
    private userId = 'API';
    private local = false;
    private errors: Error[] = [];

    private sqlDb: MSSQLConnection;

    // Constructor
    constructor (ctx: Context, connection: MSSQLConnection) {
        // Assign context
        this.ctx = ctx;
        this.sqlDb = connection;
        this.local = process.env['AzureWebJobsStorage'] === 'UseDevelopmentStorage=true';
    }

    public GenerateAndExecute (type: StatementType, entity: string, entityId: string, attributes: Record<string, Primitives>): Promise<mssql.IResult<unknown>> {
        const inputValues = this.GenerateStatement(type, entity, entityId, attributes);
        return this.sqlDb.execute(inputValues.sql, inputValues.variables);
    }

    private GenerateStatement (type: StatementType, entity: string, entityId: string, attributes: Record<string, Primitives>): SQLInputObject {
        // Get the target schema
        const schema: Schema = this.GetSchema(entity);
        const ts: Schema['entity'] = schema ? schema[entity] : null;
        let result: SQLInputObject;
        // If we have a valid entity
        if (ts) {
            try {
                // Construct table name
                const tableName: string = ts.Owner + '.[' + ts.Tablename + ']';
                // SQL Construction: 1
                let sql: string;
                switch (type) {
                    case 'INSERT':
                        sql = `INSERT INTO ${tableName} (%PARAM%) OUTPUT %OUTPUTVALUE% VALUES (%VALUE%);`;
                        break;
                    case 'UPDATE':
                    case 'DELETE':
                        sql = `UPDATE ${tableName} SET %PARAM%=%VALUE% OUTPUT %OUTPUTVALUE% WHERE %ENTITY%;`;
                        break;
                }
                // Handle metadata
                attributes = this.UpdateMetadata(ts, attributes, (type === 'INSERT'), (type === 'DELETE'));
                // Sql variables holder
                let variables: QueryDBVariable[] = [];
                // Extract attributes into array
                const keys: string[] = Object.keys(attributes);
                // Determine pattern to replace
                const regexColumn = new RegExp(/(%PARAM%)/gm);
                const regexValue = new RegExp(/(%VALUE%)/gm);
                const regexOutputValue = new RegExp(/%OUTPUTVALUE%/);
                // Populate
                for (let i = 0; i < keys.length; i++) {
                    if (ts.Attributes[keys[i]] !== undefined && this.errors.length === 0) {
                        if (this.isFieldAttribute(ts.Attributes[keys[i]])) {
                            // Extract attribute
                            const metadata: FieldAttribute = ts.Attributes[keys[i]] as FieldAttribute;
                            // Populate SQL variables array
                            const variable: QueryDBVariable = this.GenerateQueryDBVariables(ts.Tablename, metadata.SQL, attributes[keys[i]]);
                            variables.push(variable);
                            // SQL Construction: 2
                            if (type === 'INSERT') {
                                // Determine if last or not
                                if (i < (keys.length - 1)) {
                                    sql = sql
                                        .replace(regexColumn, (metadata.SQL.Name + ', %PARAM%'))
                                        .replace(regexValue, (`@${variable.name}, %VALUE%`));
                                } else {
                                    sql = sql
                                        .replace(regexColumn, (metadata.SQL.Name))
                                        .replace(regexValue, (`@${variable.name}`));
                                }
                            } else {
                                // Determine if last or not
                                if (i < (keys.length - 1)) {
                                    sql = sql
                                        .replace(regexColumn, (`[${ts.Tablename}].[${metadata.SQL.Name}]`))
                                        .replace(regexValue, `@${variable.name}, %PARAM%=%VALUE%`);
                                } else {
                                    // Additional replacement patterns
                                    const regexEntity = new RegExp(/%ENTITY%/gm);
                                    // Replace last value
                                    sql = sql
                                        .replace(regexColumn, (`[${ts.Tablename}].[${metadata.SQL.Name}]`))
                                        .replace(regexValue, `@${variable.name}`);
                                    // Add PKs if last property
                                    for (let y = 0; y < ts.PrimaryKey.length; y++) {
                                        const primaryKey: string = ts.PrimaryKey[y];
                                        const primaryKeyAttribute: FieldAttribute = ts.Attributes[primaryKey] as FieldAttribute;
                                        const primaryKeyValues: string[] | number[] = this.GetPrimaryKey(entityId);
                                        if (primaryKeyValues.length === ts.PrimaryKey.length) {
                                            if (primaryKeyValues[y]) {
                                                // Handle composite primary keys
                                                if (y < (ts.PrimaryKey.length - 1)) {
                                                    // Support Composite Primary Keys
                                                    sql = sql.replace(regexEntity, (`[${ts.Tablename}].[${primaryKeyAttribute.SQL.Name}] = @${ts.Tablename + primaryKey} AND %ENTITY%`));
                                                } else {
                                                    sql = sql.replace(regexEntity, (`[${ts.Tablename}].[${primaryKeyAttribute.SQL.Name}] = @${ts.Tablename + primaryKey}`));
                                                }
                                                // Generate PK variable
                                                const pkVariable: QueryDBVariable = this.GenerateQueryDBVariables(ts.Tablename, primaryKeyAttribute.SQL, primaryKeyValues[y]);
                                                variables.push(pkVariable);
                                            } else {
                                                this.errors.push(new Error('Invalid primary key: ' + primaryKeyValues[y].toString()));
                                            }
                                        } else {
                                            this.errors.push(new Error(`${entity} missing primary key`));
                                        }
                                    }
                                }
                            }
                        } else {
                            this.errors.push(new Error(`${keys[i]} is not a field that can be amended`));
                        }
                    } else {
                        if (ts.Attributes[keys[i]] === undefined) {
                            this.errors.push(new Error(`Property [${keys[i]}] does not exist on entity [${entity}]`));
                        }
                    }
                }
                // SQL Construction: 3 - Fill in output fields
                const fieldKeys: string[] = Object.keys(ts.Attributes).filter((key) => ts.Attributes[key].Type === 'Field');
                for (let i = 0; i < fieldKeys.length; i++) {
                    if (this.errors.length === 0) {
                        const metadata: FieldAttribute = ts.Attributes[fieldKeys[i]] as FieldAttribute;
                        if (i < (fieldKeys.length - 1)) {
                            sql = sql.replace(regexOutputValue, (`INSERTED.${metadata.SQL.Name} AS ${fieldKeys[i]}, %OUTPUTVALUE%`));
                        } else {
                            sql = sql.replace(regexOutputValue, (`INSERTED.${metadata.SQL.Name} AS ${fieldKeys[i]}`));
                        }
                    }
                }
                // Populate response object
                result = {
                    sql,
                    variables,
                };
            } catch (e) {
                this.errors.push(e);
            }
        } else {
            if (!schema) {
                this.errors.push(new Error('Unable to get schema'));
            } else {
                this.errors.push(new Error(`Unknown Entity - ${entity}`));
            }
        }
        // Determine if any errors
        if (this.errors.length > 0) {
            this.HandleError(attributes);
            return null;
        } else {
            this.ctx.log.warn(result.sql);
            // return response object
            return result;
        }

    }

    private HandleError (payload: Record<string, Primitives>) {
        HandleError(this.ctx, this.errors, payload);
    }

    private UpdateMetadata (entity: Schema['entity'], attributes: Record<string, Primitives>, created: boolean, deleted: boolean) {
        // Determine entity is being created or updated
        if (created) {
            if (entity['Attributes']['CreatedOn'] !== undefined) {
                attributes['CreatedOn'] = new Date(new Date().toUTCString());
            }
        } else {
            // If updated determine if body contains the obsolete attribute
            if (entity['Attributes']['Obsolete'] !== undefined) {
                // Check if deleted
                // TODO: If obsolete is set to true and obsoletedOn and obsoletedBy is not set....then intialise this...
                if (!attributes) {
                    attributes = {};
                }
                if (deleted) {
                    attributes['Obsolete'] = true;
                }
                // Determine if Obsolete is present in payload
                if (attributes['Obsolete'] !== undefined) {
                    if (attributes['Obsolete'] === true) {
                        attributes['ObsoletedOn'] = new Date(new Date().toUTCString());
                        attributes['ObsoletedBy'] = this.userId;
                    } else {
                        attributes['ObsoletedOn'] = null;
                        attributes['ObsoletedBy'] = null;
                    }
                }
            }
        }
        // Update last updated on fields
        if (entity['Attributes']['LastUpdatedOn'] !== undefined) {
            attributes['LastUpdatedOn'] = new Date(new Date().toUTCString());
        }
        // Update last updated by fields
        if (entity['Attributes']['LastUpdatedBy'] !== undefined) {
            attributes['LastUpdatedBy'] = this.userId;
        }
        return attributes;
    }

    private isFieldAttribute (attribute: FieldAttribute | ReferenceAttribute): attribute is FieldAttribute {
        return (attribute as FieldAttribute).Type === 'Field';
    }

    private GenerateQueryDBVariables (table: string, metadata: SQLMetadata, value: Primitives) {
        // Determine if special value
        let sanitizedValue: Primitives = Sanitize(value);
        switch (sanitizedValue) {
            case 'true':
                sanitizedValue = true;
                break;
            case 'false':
                sanitizedValue = false;
                break;
            default:
                break;
        }

        // Create template
        let result: QueryDBVariable = {
            name: (table + Captialize(metadata.Name)),
            type: null,
            value: sanitizedValue,
        };
        // Determine SQL Type
        result.type = this.GetMSSQLType(metadata.Type);

        // Handle Datetime
        if (metadata.Type === 'datetime') {
            result.value = new Date(result.value);
        }
        return result;
    }

    private GetMSSQLType (type: string): SQLInputs {
        let result: SQLInputs;
        // Determine type
        switch (type) {
            case 'varchar':
                result = mssql.VarChar;
                break;
            case 'int':
                result = mssql.Int;
                break;
            case 'datetime':
                result = mssql.DateTime;
                break;
            case 'bit':
                result = mssql.Bit;
                break;
            default:
                this.errors.push(new Error(`GetMSSQLType - Unhandled datatype provided - ${type}`));
                result = null;
                break;
        }
        return result;
    }

    private GetPrimaryKey (input: string | number): string[] | number[] {
        if (typeof input === 'string') {
            return input.split('-');
        }
        return [input];
    }

    // Note: Public for testing purposes
    public GetSchema (entity: string): any {
        let result: Schema;
        if (this.local) {
            // Check if environment variable is set
            let path: string;
            if (process.env['SchemaDirectory']) {
                path = process.env['SchemaDirectory'];
            } else {
                throw new Error('Environtment variable - Local environment SchemaDirectory not set');
            }
            // Try get the file
            const file: string = path + entity + '.json';
            try {
                const data: string = fs.readFileSync(file, 'utf-8');
                result = JSON.parse(data) as Schema;
            } catch (e) {
                throw e;
            }
        } else {
            throw new Error('Feature not yet available');
        }
        return result;
    }

}