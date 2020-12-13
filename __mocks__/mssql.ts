/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Primitives } from '@assets/interfaces';
import { IResult } from 'mssql';
import { createHash } from 'crypto';
import KnownSQL from '@assets/tests/knownSqlGood';
import BadSQL from '@assets/tests/knownSqlBad';
// Note: Mocked as an object as importing the actual package causes memory stack to exceed
const mssqlPackage: Record<string, any> = {};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Override READONLY ConnectionPool Class for testing
mssqlPackage.ConnectionPool = jest.fn(() => ({
    connect: jest.fn(),
    on: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Override READONLY PreparedStatement Class for testing
mssqlPackage.PreparedStatement = jest.fn(() => ({
    sql: '',
    variables: {},
    input: jest.fn(),
    prepare: jest.fn(function (sql: string, callback: () => void) {
        this.sql = sql;
        callback();
    }),
    execute: jest.fn(function (inputs: Record<string, Primitives>, callback: (err: Error, result: IResult<unknown>) => void) {
        // Set prepared inputs
        this.variables = inputs;

        // Hash the SQL and variables; stripping out based inputs
        let sqlHash = this.getMD5Hash(this.sql);
        const keys = Object.keys(this.variables);
        for (const key of keys) {
            const value = this.variables[key];
            // Note: Date is typeof object; therefore ignore any objects
            if (value !== null && typeof value !== 'object') {
                sqlHash += this.getMD5Hash(value.toString());
            }
        }
        const finalhash = this.getMD5Hash(sqlHash);
        // console.log(finalhash, this.sql);
        // Extract the results from the SQL or error
        if (BadSQL[finalhash] !== undefined) {
            callback(BadSQL[finalhash], null);
        } else {
            callback(null, KnownSQL[finalhash] as IResult<unknown>);
        }
    }),
    unprepare:  jest.fn((callback: () => void) => callback()),
    getMD5Hash: (value: string) => {
        return createHash('md5').update(value).digest('hex');
    }
}));

module.exports = mssqlPackage;
