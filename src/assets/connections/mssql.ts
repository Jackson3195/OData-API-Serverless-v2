// https://github.com/typescript-eslint/typescript-eslint/issues/2109
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ConnectionPool, PreparedStatement } from 'mssql';
import { config, ISqlTypeFactoryWithLength, ISqlTypeWithLength, ISqlTypeFactoryWithNoParams, ISqlTypeWithPrecisionScale, IResult, IProcedureResult, ISqlType, ISqlTypeFactory } from 'mssql';
import { Context } from '@azure/functions';

const mssqlConfig: config = {
    user: process.env['AzureMSSQLUser'],
    password: process.env['AzureMSSQLPassword'],
    server: process.env['AzureMSSQLEndpoint'],
    database: process.env['AzureMSSQLDB'],
    connectionTimeout: 10000,
    parseJSON: true,
    pool: {
        max: 2,
        min: 1,
        acquireTimeoutMillis: 30000,
        idleTimeoutMillis: 10000,
        autostart: true,
    },
    options: {
        encrypt: true,
    },
};

// Create connection pool (Static to be shared across all instances)
const staticPool: ConnectionPool = new ConnectionPool(mssqlConfig);
staticPool.connect((err) => { if (err) { console.error('Unable to create MSSQL Connection Pool',  err); }});

export default class MSSqlConnection {
    private ctx: Context;
    // Public for testing purposes
    private pool: ConnectionPool = staticPool;

    constructor (context: Context) {
        this.ctx = context;
        // Attach error listner
        this.pool.on('error', (err) => {
            this.ctx.log.error(err);
        });
    }

    public Execute<T> (sql: string, variables: QueryDBVariable[]): Promise<IResult<T>> {
        // Determine if sql has been passed in
        if (sql) {
            // Create return result
            return new Promise((resolve, reject) => {
                // Create new prepared statement
                let preparedInputs: Record<string, (ISqlTypeFactory | ISqlType)> = {};
                const ps: PreparedStatement = new PreparedStatement(this.pool);
                // Deal with inputs
                for (const input of variables) {
                    // Create prepare input parameter object
                    ps.input(input.name, input.type);
                    preparedInputs[input.name] = input.value;
                }
                // Prepare SQL
                ps.prepare(sql, (err: Error) => {
                    if (err) {
                        reject(err);
                    } else {
                        // Execute prepared statement
                        ps.execute(preparedInputs, (err: Error, result: IProcedureResult<T>) => {
                            // Disconnect from pool regardless
                            ps.unprepare((err: Error) => {
                                if (err) {
                                    reject(err);
                                }
                            });
                            // Return error otherwise data
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        });
                    }
                });
            });
        } else {
            return Promise.reject(new Error('SQL field required'));
        }
    }

}

export interface QueryDBVariable {
    name: string;
    type: SQLInputs;
    value: any;
}

export type SQLInputs = ISqlTypeFactoryWithLength | ISqlTypeWithLength | ISqlTypeFactoryWithNoParams | ISqlTypeWithPrecisionScale;