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

    // Note: Override GetSchema implementation so it returns a known schema
    beforeAll(() => {
        jest.spyOn(MSSQLGenerator.prototype, 'GetSchema').mockImplementation(() => GetUserSchema());
    });
    afterAll(() => {
        jest.restoreAllMocks();
    });

    // Note: Before reach test is run; perform these "RESET" actions
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

        // Verify SQL & Variables
        const sqlResults = GetSQLData(mockedMSSqlConnection);
        expect(sqlResults.sql).toBe('INSERT INTO dbo.[user] (firstname, surname, createdOn, lastUpdatedOn, lastUpdatedBy) OUTPUT INSERTED.id AS Id, INSERTED.firstname AS Firstname, INSERTED.surname AS Surname, INSERTED.createdOn AS CreatedOn, INSERTED.lastUpdatedOn AS LastUpdatedOn, INSERTED.lastUpdatedBy AS LastUpdatedBy, INSERTED.obsolete AS Obsolete, INSERTED.obsoletedOn AS ObsoletedOn, INSERTED.obsoletedBy AS ObsoletedBy VALUES (@userFirstname, @userSurname, @userCreatedOn, @userLastUpdatedOn, @userLastUpdatedBy);');
        expect(sqlResults.variables[0].value).toBe('Jackson');
        expect(sqlResults.variables[1].value).toBe('Jacob');
    });

    test('It should update a entity', async () => {
        ctx.req.method = 'PATCH';
        ctx.req.params['entity'] = 'Users';
        ctx.req.params['id'] = '1';
        ctx.req.body = {
            Firstname: 'Donde',
            Surname: 'Spectre'
        };

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(200);
        expect(ctx.res.body).toMatchObject([{'Id':1,'Firstname':'Donde','Surname':'Spectre','CreatedOn':'2020-11-14T19:54:04.000Z','LastUpdatedOn':'2020-11-15T20:20:12.000Z','LastUpdatedBy':'API','Obsolete':false,'ObsoletedOn':null,'ObsoletedBy':null}]);

        // Verify SQL & Variables
        const sqlResults = GetSQLData(mockedMSSqlConnection);
        expect(sqlResults.sql).toBe('UPDATE dbo.[user] SET [user].[firstname]=@userFirstname, [user].[surname]=@userSurname, [user].[lastUpdatedOn]=@userLastUpdatedOn, [user].[lastUpdatedBy]=@userLastUpdatedBy OUTPUT INSERTED.id AS Id, INSERTED.firstname AS Firstname, INSERTED.surname AS Surname, INSERTED.createdOn AS CreatedOn, INSERTED.lastUpdatedOn AS LastUpdatedOn, INSERTED.lastUpdatedBy AS LastUpdatedBy, INSERTED.obsolete AS Obsolete, INSERTED.obsoletedOn AS ObsoletedOn, INSERTED.obsoletedBy AS ObsoletedBy WHERE [user].[id] = @userId;');
        expect(sqlResults.variables[0].value).toBe('Donde');
        expect(sqlResults.variables[1].value).toBe('Spectre');
        expect(sqlResults.variables[4].value).toBe('1');
    });

    test('It should obsolete a entity', async () => {
        ctx.req.method = 'DELETE';
        ctx.req.params['entity'] = 'Users';
        ctx.req.params['id'] = '1';

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(204);
        expect(ctx.res.body).toBeNull();

        // Verify SQL & Variables
        const sqlResults = GetSQLData(mockedMSSqlConnection);
        expect(sqlResults.sql).toBe('UPDATE dbo.[user] SET [user].[obsolete]=@userObsolete, [user].[obsoletedOn]=@userObsoletedOn, [user].[obsoletedBy]=@userObsoletedBy, [user].[lastUpdatedOn]=@userLastUpdatedOn, [user].[lastUpdatedBy]=@userLastUpdatedBy OUTPUT INSERTED.id AS Id, INSERTED.firstname AS Firstname, INSERTED.surname AS Surname, INSERTED.createdOn AS CreatedOn, INSERTED.lastUpdatedOn AS LastUpdatedOn, INSERTED.lastUpdatedBy AS LastUpdatedBy, INSERTED.obsolete AS Obsolete, INSERTED.obsoletedOn AS ObsoletedOn, INSERTED.obsoletedBy AS ObsoletedBy WHERE [user].[id] = @userId;');
        expect(sqlResults.variables[0].value).toBe(true);
        expect(sqlResults.variables[1].value).toBeInstanceOf(Date);
        expect(sqlResults.variables[3].value).toBeInstanceOf(Date);
    });

    test('It should obsolete a entity via a PATCH request', async () => {
        ctx.req.method = 'PATCH';
        ctx.req.params['entity'] = 'Users';
        ctx.req.params['id'] = '1';
        ctx.req.body = {
            Obsolete: true
        };

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(200);
        expect(ctx.res.body).toMatchObject([ { 'Id': 1, 'Firstname': 'Jackson', 'Surname': 'Jacob', 'CreatedOn': '2020-11-14T19:54:04.000Z', 'LastUpdatedOn': '2020-11-15T20:20:12.000Z', 'LastUpdatedBy': 'API', 'Obsolete': true, 'ObsoletedOn': '2020-11-15T20:20:12.000Z', 'ObsoletedBy': 'API' } ]);

        // Verify SQL & Variables
        const sqlResults = GetSQLData(mockedMSSqlConnection);
        expect(sqlResults.sql).toBe('UPDATE dbo.[user] SET [user].[obsolete]=@userObsolete, [user].[obsoletedOn]=@userObsoletedOn, [user].[obsoletedBy]=@userObsoletedBy, [user].[lastUpdatedOn]=@userLastUpdatedOn, [user].[lastUpdatedBy]=@userLastUpdatedBy OUTPUT INSERTED.id AS Id, INSERTED.firstname AS Firstname, INSERTED.surname AS Surname, INSERTED.createdOn AS CreatedOn, INSERTED.lastUpdatedOn AS LastUpdatedOn, INSERTED.lastUpdatedBy AS LastUpdatedBy, INSERTED.obsolete AS Obsolete, INSERTED.obsoletedOn AS ObsoletedOn, INSERTED.obsoletedBy AS ObsoletedBy WHERE [user].[id] = @userId;');
        expect(sqlResults.variables[0].value).toBe(true);
        expect(sqlResults.variables[1].value).toBeInstanceOf(Date);
        expect(sqlResults.variables[3].value).toBeInstanceOf(Date);
    });

    //  TODO: Implement
    test('It should un-obsolete a entity via a PATCH request', () => {
        expect(false).toBe(true);
    });

    test('It should return a 405 method not allowed if unhandled method is passed', async () => {
        ctx.req.method = 'PUT';
        await api(ctx, ctx.req);
        expect(ctx.res.status).toBe(405);
    });

    // TODO: Check body for error response
    test('It should error when the entity is not provided', async () => {
        delete ctx.req.params['entity'];
        await api(ctx, ctx.req);
        expect(ctx.res.status).toBe(400);
    });

    //  TODO: Implement
    test('It should error when the entity id is not provided', () => {
        expect(false).toBe(true);
    });

    //  TODO: Implement
    test('It should error when the entity body is not provided', () => {
        expect(false).toBe(true);
    });

    //  TODO: Implement
    test('It should error when the entity body is not provided', () => {
        expect(false).toBe(true);
    });

    //  TODO: Implement
    test('It should error if a token is invalid', () => {
        expect(false).toBe(true);
    });

    //  TODO: Implement
    test('It should update a entity with a composite primary key', () => {
        expect(false).toBe(true);
    });

    //  TODO: Implement
    test('It should error if an unknown entity is provided', () => {
        expect(false).toBe(true);
    });


});
