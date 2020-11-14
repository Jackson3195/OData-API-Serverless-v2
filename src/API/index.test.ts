import { GetFreshContext, MockContext, GetSQLData, GetUserSchema } from '@assets/tests';
// Note: Import first so that the mocked class is used instead of the real one
import MSSqlConnection from '@assets/connections/mssql';
jest.mock('@assets/connections/mssql');
const mockedMSSqlConnection = MSSqlConnection as unknown as jest.Mock<typeof MSSqlConnection>;
import MSSQLGenerator from '@assets/generator/mssql';
// Note: Import last so that any other mock actions takes effect first
import api from './index';

describe('API Functionality', () => {

    let ctx: MockContext;

    beforeAll(() => {
        jest.spyOn(MSSQLGenerator.prototype, 'GetSchema').mockImplementation(() => GetUserSchema());
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        ctx = GetFreshContext();
        mockedMSSqlConnection.mockClear();
    });

    test('It should create a entity', async () => {
        ctx.req.method = 'POST';
        ctx.req.params['entity'] = 'Users';
        ctx.req.body = {
            Firstname: 'Jackson',
            Surname: 'Jacob'
        };

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(201);
        expect(ctx.res.body).toMatchObject([ { 'Id': 1, 'Firstname': 'Jackson', 'Surname': 'Jacob', 'CreatedOn': '2020-11-14T19:54:04.000Z', 'LastUpdatedOn': '2020-11-14T19:54:04.000Z', 'LastUpdatedBy': 'API', 'Obsolete': false, 'ObsoletedOn': null, 'ObsoletedBy': null } ]);

        // Verify SQL
        const sqlResults = GetSQLData(mockedMSSqlConnection);
        expect(sqlResults.sql).toBe('INSERT INTO dbo.[user] (firstname, surname, createdOn, lastUpdatedOn, lastUpdatedBy) OUTPUT INSERTED.id AS Id, INSERTED.firstname AS Firstname, INSERTED.surname AS Surname, INSERTED.createdOn AS CreatedOn, INSERTED.lastUpdatedOn AS LastUpdatedOn, INSERTED.lastUpdatedBy AS LastUpdatedBy, INSERTED.obsolete AS Obsolete, INSERTED.obsoletedOn AS ObsoletedOn, INSERTED.obsoletedBy AS ObsoletedBy VALUES (@userFirstname, @userSurname, @userCreatedOn, @userLastUpdatedOn, @userLastUpdatedBy);');
        // TODO: Verify SQL Variables
    });


});
