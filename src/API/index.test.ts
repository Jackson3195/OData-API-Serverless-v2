import { GetFreshContext, MockContext, GetSQLData, GetSchema } from '@assets/tests';
import { ErrorResponse } from '@assets/interfaces';
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
        jest.spyOn(MSSQLGenerator.prototype, 'GetSchema').mockImplementation((user) => GetSchema(user));
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

    test('It should un-obsolete a entity via a PATCH request', async () => {
        ctx.req.method = 'PATCH';
        ctx.req.params['entity'] = 'Users';
        ctx.req.params['id'] = '1';
        ctx.req.body = {
            Obsolete: false
        };

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(200);
        expect(ctx.res.body).toMatchObject([ { 'Id': 1, 'Firstname': 'Jackson', 'Surname': 'Jacob', 'CreatedOn': '2020-11-14T19:54:04.000Z', 'LastUpdatedOn': '2020-11-15T20:20:12.000Z', 'LastUpdatedBy': 'API', 'Obsolete': false, 'ObsoletedOn': null, 'ObsoletedBy': null } ]);

        // Verify SQL & Variables
        const sqlResults = GetSQLData(mockedMSSqlConnection);
        expect(sqlResults.sql).toBe('UPDATE dbo.[user] SET [user].[obsolete]=@userObsolete, [user].[obsoletedOn]=@userObsoletedOn, [user].[obsoletedBy]=@userObsoletedBy, [user].[lastUpdatedOn]=@userLastUpdatedOn, [user].[lastUpdatedBy]=@userLastUpdatedBy OUTPUT INSERTED.id AS Id, INSERTED.firstname AS Firstname, INSERTED.surname AS Surname, INSERTED.createdOn AS CreatedOn, INSERTED.lastUpdatedOn AS LastUpdatedOn, INSERTED.lastUpdatedBy AS LastUpdatedBy, INSERTED.obsolete AS Obsolete, INSERTED.obsoletedOn AS ObsoletedOn, INSERTED.obsoletedBy AS ObsoletedBy WHERE [user].[id] = @userId;');
        expect(sqlResults.variables[0].value).toBe(false);
        expect(sqlResults.variables[1].value).toBeNull();
        expect(sqlResults.variables[2].value).toBeNull();
    });

    test('It should return a 405 method not allowed if unhandled method is passed', async () => {
        ctx.req.method = 'PUT';
        await api(ctx, ctx.req);
        expect(ctx.res.status).toBe(405);
    });

    test('It should error when the entity is not provided', async () => {
        delete ctx.req.params['entity'];

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('Entity required');
    });

    test('It should error when the entity id is not provided', async () => {
        delete ctx.req.params['id'];
        ctx.req.method = 'PATCH';
        // Clone for delete aswell
        const deleteCtx = Object.assign({}, ctx);
        deleteCtx.req.method = 'DELETE';

        await api(ctx, ctx.req);
        await api(deleteCtx, deleteCtx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('EntityId required');
        expect(deleteCtx.res.status).toBe(400);
        expect((deleteCtx.res.body as ErrorResponse).errors[0].message).toBe('EntityId required');

    });

    test('It should error when the entity body is not provided', async () => {
        delete ctx.req.body;
        ctx.req.method = 'POST';
        // Clone for patch aswell
        const patchCtx = Object.assign({}, ctx);
        patchCtx.req.method = 'PATCH';

        await api(ctx, ctx.req);
        await api(patchCtx, patchCtx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('Entity body required');
        expect(patchCtx.res.status).toBe(400);
        expect((patchCtx.res.body as ErrorResponse).errors[0].message).toBe('Entity body required');
    });

    test('It should error if a token is invalid', async () => {
        delete ctx.req.headers['authorization'];

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(401);
        expect(ctx.res.body).toBeNull();
    });

    test('It should error if an unknown entity is provided', async () => {
        ctx.req.method = 'DELETE';
        ctx.req.params['entity'] = 'Random';


        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('Unknown Entity - Random');
    });

    test('It should allow entity actions with a composite primary key', async () => {
        ctx.req.params['entity'] = 'PropertyUsers';
        ctx.req.params['id'] = '2-1';

        // PATCH
        ctx.req.method = 'PATCH';
        ctx.req.body = {
            'Data1': 'Some updated text'
        };
        // TODO: DELETE
        // TODO: GET

        await api(ctx, ctx.req);

        expect(ctx.res.status).toBe(200);
        expect(ctx.res.body).toMatchObject([ { PropertyId: 2, UserId: 1, Data1: 'Some updated text' } ]);

        // Verify SQL & Variables
        const sqlResults = GetSQLData(mockedMSSqlConnection);
        expect(sqlResults.sql).toBe('UPDATE dbo.[property_user] SET [property_user].[data1]=@property_userData1 OUTPUT INSERTED.propertyId AS PropertyId, INSERTED.userId AS UserId, INSERTED.data1 AS Data1 WHERE [property_user].[propertyId] = @property_userPropertyId AND [property_user].[userId] = @property_userUserId;');
        expect(sqlResults.variables[0].value).toBe('Some updated text');
        expect(sqlResults.variables[1].value).toBe('2');
        expect(sqlResults.variables[2].value).toBe('1');
    });

    // // TODO: Implement
    // test('It should handle error if composite primary is not passed in the correct format', () => {
    //     expect(false).toBe(true);
    // });

    // //  TODO: Implement
    // test('It should truncate numeric values if its greather that MAX_INT (2147483640 > x >= -2147483639)', () => {
    //     expect(false).toBe(true);
    // });

    test('It should return database errors in the response', async () => {
        ctx.req.method = 'POST';
        ctx.req.params['entity'] = 'Properties';
        ctx.req.body = {
            'AddressLine1': '117 Test Road',
            'City': 'London'
        };

        await api(ctx, ctx.req);

        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('Cannot insert the value NULL into column \'landlord\', table \'playground.dbo.property\'; column does not allow nulls. INSERT fails.');
    });


});
