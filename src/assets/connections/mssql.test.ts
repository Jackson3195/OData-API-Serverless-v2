import * as mssql from 'mssql';
import { MockContext, GetFreshContext } from '@assets/tests';

// Mock ConnectionPool
const fakeConnect: jest.Mock = jest.fn((callback: (x: boolean) => void) => callback(false));
const fakeOn: jest.Mock = jest.fn((_name, callback: () => void) => callback());
export const fakeConnectionPool: jest.Mock = jest.fn(() => ({
    connect: fakeConnect,
    on: fakeOn,
}));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Override READONLY ConnectionPool Class for testing
mssql.ConnectionPool = fakeConnectionPool;

// Mock Prepared Statement
const fakePreparedStatementInput: jest.Mock = jest.fn();
const fakePreparedStatementPrepare: jest.Mock = jest.fn((_sql, callback: () => void) => callback());
const fakePreparedStatementExecute: jest.Mock = jest.fn((_inputs, callback: (x: null, y: string) => void) => callback(null, 'Value'));
const fakePreparedStatementUnprepare: jest.Mock = jest.fn((callback: () => void) => callback());
let fakePreparedStatement: jest.Mock = jest.fn(() => ({
    input: fakePreparedStatementInput,
    prepare: fakePreparedStatementPrepare,
    execute: fakePreparedStatementExecute,
    unprepare: fakePreparedStatementUnprepare,
}));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Override READONLY PreparedStatement Class for testing
mssql.PreparedStatement = fakePreparedStatement;

// Mock Prepared Statement Errored
const fakePreparedStatementPreparedError: jest.Mock = jest.fn((_sql, callback: (x: Error) => void) => callback(new Error()));
const fakePreparedStatementExecuteError: jest.Mock = jest.fn((_inputs, callback: (x: Error, y: Record<string, any>) => void) => callback(new Error(), {}));
const fakePreparedStatementUnprepareError: jest.Mock = jest.fn((callback: (x: Error) => void) => callback(new Error()));

// Import the file; thus invoking any implicit actions
import MSSqlDB from './mssql';

describe('MSSQL Connection Service', () => {

    let ctx: MockContext ;

    beforeEach(() => {
        // Clear all mocks
        fakePreparedStatementInput.mockClear();
        fakePreparedStatementPrepare.mockClear();
        fakePreparedStatementExecute.mockClear();
        fakePreparedStatementUnprepare.mockClear();
        fakePreparedStatementPreparedError.mockClear();
        fakePreparedStatementExecuteError.mockClear();
        fakePreparedStatementUnprepareError.mockClear();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Reset parepared statement mocks before tests
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        mssql.PreparedStatement.mockClear();
        ctx = GetFreshContext();
    });

    test('Connect to SQL Database on startup (implicitly)', () => {
        expect(fakeConnectionPool).toHaveBeenCalled();
        expect(fakeConnect).toHaveBeenCalledTimes(1);
    });

    test('Queries run correctly', () => {
        const db: MSSqlDB = new MSSqlDB(ctx);

        db.query('SELECT * FROM dbo.user', [
            {name: 'user', type: mssql.Int, value: 1},
            {name: 'user', type: mssql.Int, value: 2},
            {name: 'user', type: mssql.Int, value: 3},
        ]).then(() => {
            // Check correct executable
            expect(fakePreparedStatementInput).toHaveBeenCalledTimes(3);
            expect(fakePreparedStatementPrepare).toHaveBeenCalled();
            expect(fakePreparedStatementExecute).toHaveBeenCalled();
            expect(fakePreparedStatementUnprepare).toHaveBeenCalled();
        }).catch(() => {
            expect(true).toBe(false);
        });
    });

    test('Ends function invocation on error', () => {
        const db: MSSqlDB = new MSSqlDB(ctx);
        db.query(null, []).catch(() => {
            expect(ctx.done).toHaveBeenCalled();
        });
    });

    it('Handles prepare sql statement error', () => {
        // Setup errored prepare statement
        fakePreparedStatement = jest.fn(() => ({
            input: fakePreparedStatementInput,
            prepare: fakePreparedStatementPreparedError,
            execute: fakePreparedStatementExecute,
            unprepare: fakePreparedStatementUnprepare,
        }));

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Override READONLY PreparedStatement Class for testing
        mssql.PreparedStatement = fakePreparedStatement;

        const db: MSSqlDB = new MSSqlDB(ctx);
        db.query('SELECT * FROM dbo.user', [
            {name: 'user', type: mssql.Int, value: 1},
        ]).catch(() => {
            expect(fakePreparedStatementInput).toHaveBeenCalledTimes(1);
            expect(fakePreparedStatementPreparedError).toHaveBeenCalled();
            expect(ctx.done).toHaveBeenCalled();
        });
    });

    it('Handles execute sql statement error' , async () => {
        // Setup errored prepare statement
        fakePreparedStatement = jest.fn(() => ({
            input: fakePreparedStatementInput,
            prepare: fakePreparedStatementPrepare,
            execute: fakePreparedStatementExecuteError,
            unprepare: fakePreparedStatementUnprepare,
        }));

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Override READONLY PreparedStatement Class for testing
        mssql.PreparedStatement = fakePreparedStatement;

        const db: MSSqlDB = new MSSqlDB(ctx);
        db.query('SELECT * FROM dbo.user', [
            {name: 'user', type: mssql.Int, value: 1},
        ]).catch(() => {
            expect(fakePreparedStatementInput).toHaveBeenCalledTimes(1);
            expect(fakePreparedStatementPrepare).toHaveBeenCalled();
            expect(fakePreparedStatementExecuteError).toHaveBeenCalled();
            expect(ctx.done).toHaveBeenCalled();
        });
    });

    it('Handles unprepare sql statement error' , async () => {
        // Setup errored prepare statement
        fakePreparedStatement = jest.fn(() => ({
            input: fakePreparedStatementInput,
            prepare: fakePreparedStatementPrepare,
            execute: fakePreparedStatementExecute,
            unprepare: fakePreparedStatementUnprepareError,
        }));

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Override READONLY PreparedStatement Class for testing
        mssql.PreparedStatement = fakePreparedStatement;

        const db: MSSqlDB = new MSSqlDB(ctx);
        await db.query('SELECT * FROM dbo.user', [
            {name: 'user', type: mssql.Int, value: 1},
        ]).catch(() => {
            expect(fakePreparedStatementInput).toHaveBeenCalledTimes(1);
            expect(fakePreparedStatementPrepare).toHaveBeenCalled();
            expect(fakePreparedStatementExecute).toHaveBeenCalled();
            expect(fakePreparedStatementUnprepareError).toHaveBeenCalled();
            expect(ctx.done).toHaveBeenCalled();
        });
    });


});