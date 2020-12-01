import { Context } from '@azure/functions';
import { QueryDBVariable }  from '@assets/connections/mssql';
import { Sanitize, Captialize, HandleError } from '@assets/utils';
import { Primitives } from '@assets/interfaces';
import { FieldAttribute, ReferenceAttribute, Schema, SQLMetadata } from '@assets/interfaces/schema';
import { IResult, VarChar, Int, DateTime, Bit } from 'mssql';
import { existsSync, readFileSync } from 'fs';
import MSSQLConnection from '@assets/connections/mssql';

/**
 * https://github.com/techniq/odata-query/blob/master/src/index.ts
 */

type StatementType = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';

export interface SQLInputObject {
    sql: string;
    variables: QueryDBVariable[];
}


export default class MSSQLGenerator {
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

    public GenerateAndExecute (type: StatementType, entity: string, entityId: string, attributes: Record<string, Primitives>): Promise<IResult<unknown>> {
        const inputValues = this.GenerateStatement(type, entity, entityId, attributes);
        if (inputValues) {
            return this.sqlDb.Execute(inputValues.sql, inputValues.variables);
        }
        return null;
    }

    private GenerateSelectStatement (ts: Schema['entity'], tableName: string, entityId: string, query: Record<string, string>): SQLInputObject {
        // Create base query - (Passed my reference since passing an object instead of a direct value)
        const result: SQLInputObject = {
            // TODO: Handle default pagination
            sql: `SELECT %FIELD% FROM ${tableName} %FILTER%;`,
            variables: []
        };
        // Handle $select
        this.ParseSelect(ts, result, query);
        // Handle $filter
        if (this.errors.length === 0) {
            this.ParseFilter(ts, result, query, entityId);
        }
        // TODO: Handle $expand
        // TODO: Handle $top
        // TODO: Handle $orderby
        // TODO: Handle $pagination
        return result;
    }

    // Complexity: O(n)
    private ParseSelect (ts: Schema['entity'], result: SQLInputObject, query: Record<string, string>) {
        const regexField = new RegExp(/(%FIELD%)/gm);
        // Select specific attributes
        if (query['$select']) {
            // Get fields
            const fields: string[] = query['$select'].split(',').map((f) => f.replace(/\s/gm, ''));
            for (let i = 0; i < fields.length; i++) {
                const attribute: FieldAttribute | ReferenceAttribute = ts.Attributes[fields[i]];
                if (attribute !== undefined && this.errors.length === 0) {
                    // Get field from schema
                    if (this.isFieldAttribute(attribute)) {
                        // Extract attribute
                        const metadata = attribute;
                        // Determine if last attribute or not
                        if (i < (fields.length - 1)) {
                            result.sql = result.sql.replace(regexField, (`[${ts.Tablename}].[${metadata.SQL.Name}] AS ${fields[i]}, %FIELD%`));
                        } else {
                            result.sql = result.sql.replace(regexField, (`[${ts.Tablename}].[${metadata.SQL.Name}] AS ${fields[i]}`));
                        }
                    } else {
                        this.errors.push(new Error(`${fields[i]} is not a selectable field`));
                    }
                } else {
                    // If unknown attribute
                    if (attribute === undefined) {
                        this.errors.push(new Error(`Field ${fields[i]} does not exist on entity to $select`));
                    }
                }
            }
        } else {
            // Select all attributes
            const keys: string[] = Object.keys(ts.Attributes);
            for (let i = 0; i < keys.length; i++) {
                const attribute: FieldAttribute | ReferenceAttribute = ts.Attributes[keys[i]];
                if (this.isFieldAttribute(attribute)) {
                    // Extract attribute
                    const metadata: FieldAttribute = attribute;
                    // Determine if last attribute or not
                    result.sql = result.sql.replace(regexField, (`[${ts.Tablename}].[${metadata.SQL.Name}] AS ${keys[i]}, %FIELD%`));
                }
            }
        }
        // Replace last field
        result.sql = result.sql.replace(new RegExp(/(, %FIELD%)/gm), '');
    }

    // Complexity: O(n)
    private ParseFilter (ts: Schema['entity'], result: SQLInputObject, query: Record<string, string>, entityId: string = null) {
        const regexFilter = new RegExp(/(%FILTER%)/gm);
        // Support entity Id if the $filter is not provided
        if (entityId && !query['$filter']) {
            query['$filter'] = '%PKFIELD%';
            const regexPKField = new RegExp(/(%PKFIELD%)/gm);
            const splitPKs = this.GetPrimaryKey(entityId);
            if (splitPKs.length === ts.PrimaryKey.length) {
                for (let i = 0; i < ts.PrimaryKey.length; i++) {
                    if (i < (ts.PrimaryKey.length - 1)) {
                        query['$filter'] = query['$filter'].replace(regexPKField, `${ts.PrimaryKey[i]} eq ${splitPKs[i]} AND %PKFIELD%`);
                    } else {
                        query['$filter'] = query['$filter'].replace(regexPKField, `${ts.PrimaryKey[i]} eq ${splitPKs[i]}`);
                    }
                }
            } else {
                // Clear filter context and populate with entityId
                delete query['$filter'];
                query['EntityId'] = entityId;
                this.errors.push(new Error('Invalid primary key'));
            }
        }
        // Perform filter action
        if (query['$filter'] && this.errors.length === 0) {
            // Setup filter variables
            const COMPARISON_OPERATORS: Record<string, string> = {
                eq: '=',
                ne: '!=',
                gt: '>',
                ge: '>=',
                lt: '<',
                le: '<=',
            };
            const LOGICAL_OPERATORS: Record<string, string> = {
                and: 'AND',
                or: 'OR',
                not: 'NOT',
            };
            // Get fields
            const seperator = new RegExp(/\s(and|or|not|AND|OR|NOT)\s/gm);
            const filters: string[] = query['$filter'].split(seperator);
            // Append SQL where statement
            result.sql = result.sql.replace(regexFilter, 'WHERE %FIELD%%COMPOP%%VALUE%');
            // Setup regex filters
            const regexFilterStatement = new RegExp(/([A-Za-z0-9]*)\s(eq|ne|gt|ge|lt|le)\s[A-Za-z0-9\'\\]*/gm);
            const regexComparisonOperators = new RegExp(/\s(eq|ne|gt|ge|lt|le)\s/gm);
            const regexField = new RegExp(/%FIELD%/gm);
            const regexComparisonOperator = new RegExp(/%COMPOP%/gm);
            const regexValue = new RegExp(/%VALUE%/gm);
            const regexLogical = new RegExp(/%LOGICAL%/gm);
            // Iterate through filter set
            for (let i = 0; i < filters.length; i++) {
                // Extract the filter query
                const filter: string = filters[i];
                // If actually a filter
                if (regexFilterStatement.test(filter)) {
                    // Split and remove any white spaces
                    const splitFilter: string[] = filter.split(regexComparisonOperators).map((val) => val.replace(/\s/gm, ''));
                    // If in filter format
                    const field: string = Sanitize(splitFilter[0], true);
                    const comparisonOperator: string = Sanitize(splitFilter[1], true);
                    const value: Primitives = splitFilter[2]; // Will be sanitized later
                    // Extract field
                    if (ts.Attributes[field] !== undefined && this.errors.length === 0) {
                        const attribute: FieldAttribute | ReferenceAttribute = ts.Attributes[field];
                        if (this.isFieldAttribute(attribute)) {
                            // Extract field and replace field name
                            const metadata: FieldAttribute = attribute;
                            result.sql = result.sql.replace(regexField, `[${ts.Tablename}].[${metadata.SQL.Name}]`);
                            // Handle NULLs
                            if (value === 'null') {
                                // Determine if comparison operators correct
                                if (comparisonOperator === 'eq' || comparisonOperator === 'ne') {
                                    // Set correct comparison operators
                                    if (comparisonOperator === 'eq') {
                                        result.sql = result.sql.replace(regexComparisonOperator, ' IS ');
                                    } else {
                                        result.sql = result.sql.replace(regexComparisonOperator, ' IS NOT ');
                                    }
                                    // Replace SQL
                                    if (i < (filters.length - 1)) {
                                        result.sql = result.sql.replace(regexValue, 'NULL %LOGICAL% %FIELD%%COMPOP%%VALUE%');
                                    } else {
                                        result.sql = result.sql.replace(regexValue, 'NULL');
                                    }
                                } else {
                                    this.errors.push(new Error('Only eq or ne operators are allowed for null values'));
                                }
                            } else {
                                // Handle normal values
                                const variable: QueryDBVariable = this.GenerateQueryDBVariables(ts.Tablename, metadata.SQL, value);
                                result.sql = result.sql.replace(regexComparisonOperator, COMPARISON_OPERATORS[comparisonOperator]);
                                if (i < (filters.length - 1)) {
                                    result.sql = result.sql.replace(regexValue, `@${variable.name} %LOGICAL% %FIELD%%COMPOP%%VALUE%`);
                                } else {
                                    result.sql = result.sql.replace(regexValue, `@${variable.name}`);
                                }
                                result.variables.push(variable);
                            }
                        } else {
                            this.errors.push(new Error(`${field} is not a filterable field`));
                        }
                    } else {
                        // If unknown attribute
                        if (ts.Attributes[field] === undefined) {
                            this.errors.push(new Error(`Field ${field} does not exist on entity to $filter`));
                        }
                    }
                } else {
                    // Has to be logical operator now
                    const knownLogicalOperators = filter.toLowerCase();
                    if (LOGICAL_OPERATORS[knownLogicalOperators]) {
                        result.sql = result.sql.replace(regexLogical, LOGICAL_OPERATORS[knownLogicalOperators]);
                    } else {
                        this.errors.push(new Error(`Unknown $filter segment detected ${filter}`));
                    }
                }
            }
        } else {
            result.sql = result.sql.replace(regexFilter, '');
        }
    }

    private GenerateStatement (type: StatementType, entity: string, entityId: string, attributes: Record<string, Primitives>): SQLInputObject {
        // Get the target schema
        const schema: Schema = this.GetSchema(entity);
        const ts: Schema['entity'] = schema[entity];
        let result: SQLInputObject;
        // Construct table name
        const tableName: string = ts.Owner + '.[' + ts.Tablename + ']';
        // SQL Construction: 1
        let sql: string;
        // Sql variables holder
        let variables: QueryDBVariable[] = [];
        if (type === 'SELECT') {
            result = this.GenerateSelectStatement(ts, tableName, entityId, attributes as Record<string, string>);
        } else {
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
                                const primaryKeyValues: string[] = this.GetPrimaryKey(entityId);
                                if (primaryKeyValues.length === ts.PrimaryKey.length) {
                                    for (let y = 0; y < ts.PrimaryKey.length; y++) {
                                        const primaryKey: string = ts.PrimaryKey[y];
                                        const primaryKeyAttribute: FieldAttribute = ts.Attributes[primaryKey] as FieldAttribute;
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
                                    }
                                } else {
                                    this.errors.push(new Error(`${entity} missing primary key`));
                                }
                            }
                        }
                    } else {
                        this.errors.push(new Error(`${keys[i]} is not a field that can be specified`));
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
        if (created && entity['Attributes']['CreatedOn'] !== undefined) {
            attributes['CreatedOn'] = new Date(new Date().toUTCString());
        } else {
            // If updated determine if body contains the obsolete attribute
            if (entity['Attributes']['Obsolete'] !== undefined) {
                // Check if deleted - Initialise the attributes object (More for DELETE request since it accepts no payload)
                if (!attributes) {
                    attributes = {};
                }
                // If the request is of type delete; add the payload in ourselves to state its been deleted
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
        return attribute.Type === 'Field';
    }

    private GenerateQueryDBVariables (table: string, metadata: SQLMetadata, value: Primitives) {
        let sanitizedValue: Primitives = Sanitize(value);

        // Create template
        let result: QueryDBVariable = {
            name: (table + Captialize(metadata.Name)),
            type: null,
            value: sanitizedValue,
        };
        // Determine SQL Type
        result.type = this.GetMSSQLType(metadata.Type);

        // Handle Datetime - Null check to prevent value being set to 1970
        if (metadata.Type === 'datetime' && result.value !== null) {
            result.value = new Date(result.value);
        }
        return result;
    }

    private GetMSSQLType (type: string) {
        let result;
        // Determine type
        switch (type) {
            case 'varchar':
                result = VarChar;
                break;
            case 'int':
                result = Int;
                break;
            case 'datetime':
                result = DateTime;
                break;
            case 'bit':
                result = Bit;
                break;
            default:
                this.errors.push(new Error(`Unhandled datatype provided - ${type}`));
                break;
        }
        return result;
    }

    private GetPrimaryKey (input: string): string[] {
        return input.split('-').filter((value) => value);
    }

    private GetSchema (entity: string): Schema {
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
            if (existsSync(file)) {
                const data: string = readFileSync(file, 'utf-8');
                const result = JSON.parse(data) as Schema;
                return result;
            } else {
                throw new Error(`Unknown Entity - ${entity}`);
            }
        } else {
            throw new Error('Feature not yet available');
        }
    }

}