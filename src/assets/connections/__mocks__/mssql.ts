import * as mssql from 'mssql';
import * as crypto from 'crypto';
import { QueryDBVariable } from '../mssql';
import { Primitives } from '@assets/interfaces';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Override READONLY ConnectionPool Class for testing
mssql.ConnectionPool = jest.fn(() => ({
    connect: jest.fn(),
    on: jest.fn(),
}));

// Hash SQL Hash lookup to result
const sqlToResult: Record<string, Partial<mssql.IResult<unknown>>> = {
    'de399dae44d6263c0296f535fd32bec5': {
        recordset: [
            {
                'Id': 1,
                'Firstname': 'Jackson',
                'Surname': 'Jacob',
                'CreatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            }
        ] as mssql.IRecordSet<unknown>
    }
};

// Mock the class and override the execute method so that we can take a peek at the data
const mockMSSqlConnection = jest.fn().mockImplementation(() => {
    return {
        execute: jest.fn((sql: string, variables: QueryDBVariable[]) => {
            const hash = GetHashFromInputs(sql, variables);
            return sqlToResult[hash];
        }),
    };
});

function GetMD5Hash (value: string) {
    return crypto.createHash('md5').update(value).digest('hex');
}

function GetHashFromInputs (sql: string, variables: QueryDBVariable[]) {
    let sqlHash = GetMD5Hash(sql);
    for (const variable of variables) {
        // Ignore dates
        if (new Date(variable.value).toString() === 'Invalid Date') {
            let value = (variable.value as Primitives).toString();
            sqlHash += GetMD5Hash(value);
        }
    }
    return GetMD5Hash(sqlHash);
}
export default mockMSSqlConnection;