import * as mssql from 'mssql';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Override READONLY ConnectionPool Class for testing
mssql.ConnectionPool = jest.fn(() => ({
    connect: jest.fn(),
    on: jest.fn(),
}));

// Mock the class and override the execute method so that we can take a peek at the data
const mockMSSqlConnection = jest.fn().mockImplementation(() => {
    return {
        execute: jest.fn((sql: string, variables: any[]) => {
            console.log('Mocked SQL execute was called');
            return {
                sql,
                variables
            };
        }),
    };
});

export default mockMSSqlConnection;