import * as mssql from 'mssql';
import * as crypto from 'crypto';
import { QueryDBVariable } from '../mssql';
import { Primitives } from '@assets/interfaces';
import KnownSQL from '@assets/tests/knownSql';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Override READONLY ConnectionPool Class for testing
mssql.ConnectionPool = jest.fn(() => ({
    connect: jest.fn(),
    on: jest.fn(),
}));


// Mock the class and override the execute method so that we can take a peek at the data
const mockMSSqlConnection = jest.fn().mockImplementation(() => {
    return {
        execute: jest.fn((sql: string, variables: QueryDBVariable[]) => {
            const hash = GetHashFromInputs(sql, variables);
            console.log(hash);
            return KnownSQL[hash];
        }),
    };
});

function GetMD5Hash (value: string) {
    return crypto.createHash('md5').update(value).digest('hex');
}

function GetHashFromInputs (sql: string, variables: QueryDBVariable[]) {
    let sqlHash = GetMD5Hash(sql);
    for (const variable of variables) {
        // Ignore dates - As this can be based on runtime timestamps which causes the hash to change
        if (new Date(variable.value).toString() === 'Invalid Date') {
            let value = (variable.value as Primitives).toString();
            sqlHash += GetMD5Hash(value);
        }
    }
    return GetMD5Hash(sqlHash);
}
export default mockMSSqlConnection;