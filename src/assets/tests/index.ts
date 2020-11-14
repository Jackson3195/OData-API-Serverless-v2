import MSSqlConnection, { QueryDBVariable } from '@assets/connection/mssql';
import { Context, Logger } from '@azure/functions';

export interface MockContext extends Context {
    done: Context['done'] & jest.Mock;
}

// Get a blank instance of an azure functions context for testing
export function GetFreshContext (): MockContext {
    return {
        invocationId: '',
        executionContext: {
            invocationId: '',
            functionName: '',
            functionDirectory: '',
        },
        bindings: {},
        bindingData: {},
        bindingDefinitions: [],
        req: {
            method: 'GET', /* Defaults to Get */
            url: '',
            headers: {
                authorization: 'Bearer Token'
            },
            query: {},
            params: {
                entity: 'Users',
                id: '3',
            },
            body: null,
        },
        res: {
            status: 200, /* Defaults to 200 */
            body: '',
        } as Record<string, any>,
        done: jest.fn(function done () {
            return Promise.resolve({
                res: (this as Context).res,
                bindings: (this as Context).bindings,
            });
        }) as Context['done'] & jest.Mock,
        log: {
            error: jest.fn(),
            warn: jest.fn(),
            info: jest.fn(),
            verbose: jest.fn()
        } as unknown as Logger,
        traceContext: {
            traceparent: '',
            tracestate: '',
            attributes: {}
        }
    };
}

// Get the SQL and Variables data of the mocked MSSqlConnection class
export function GetSQLData (mocked: jest.Mock<typeof MSSqlConnection, any>): { sql: string; variables: QueryDBVariable[] } {
    const executeMock = (mocked.mock.results[0].value as { execute: jest.Mock}).execute;
    const result = (executeMock.mock.results[0].value as { sql: string; variables: QueryDBVariable[]});
    return result;
}