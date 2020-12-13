import { GetFreshContext, MockContext, GetSQLData } from '@assets/tests';
import { ErrorResponse } from '@assets/interfaces';
// Note: Mock the fs module; invoke the mock so that jest knows to use the mocked version
jest.mock('fs');
// Note: Mock the mssql module; import so that we can observe the mocked class to determine values
import { PreparedStatement } from 'mssql';
jest.mock('mssql');
const mockedPreparedStatement = PreparedStatement as unknown as jest.Mock<typeof PreparedStatement>;
// Note: Import last so that any other mock actions takes effect first
import api from './index';

describe('API Functionality', () => {

    let ctx: MockContext;

    // Note: Override GetSchema implementation so it returns a known schema
    beforeAll(() => {
        // Set env variables to be used throughout test suite
        process.env['SchemaDirectory'] = '/';
        process.env['AzureWebJobsStorage'] = 'UseDevelopmentStorage=true';
    });
    afterAll(() => {
        jest.restoreAllMocks();
    });

    // Note: Before reach test is run; perform these "RESET" actions
    beforeEach(() => {
        ctx = GetFreshContext();
        mockedPreparedStatement.mockClear();
    });

    test('It should get all entities if an id is not specified', async () => {
        ctx.req.method = 'GET';
        ctx.req.params['entity'] = 'Users';
        delete ctx.req.params['id'];

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(200);
        expect(ctx.res.body).toMatchObject([ { Id: 1, Firstname: 'Jackson', Surname: 'Jacob', CreatedOn: '2020-11-14T19:54:04.000Z', LastUpdatedOn: '2020-11-14T19:54:04.000Z', LastUpdatedBy: 'API', Obsolete: false, ObsoletedOn: null, ObsoletedBy: null }, { Id: 2, Firstname: 'Jeff', Surname: 'Jacob', CreatedOn: '2020-11-14T19:54:04.000Z', LastUpdatedOn: '2020-11-14T19:54:04.000Z', LastUpdatedBy: 'API', Obsolete: false, ObsoletedOn: null, ObsoletedBy: null }, { Id: 3, Firstname: 'Ferly', Surname: 'Jacob', CreatedOn: '2020-11-14T19:54:04.000Z', LastUpdatedOn: '2020-11-14T19:54:04.000Z', LastUpdatedBy: 'API', Obsolete: false, ObsoletedOn: null, ObsoletedBy: null }, { Id: 4, Firstname: 'Jacqueline', Surname: 'Jacob', CreatedOn: '2020-11-14T19:54:04.000Z', LastUpdatedOn: '2020-11-14T19:54:04.000Z', LastUpdatedBy: 'API', Obsolete: false, ObsoletedOn: null, ObsoletedBy: null } ]);

        // Verify SQL & Variables
        const sqlResults = GetSQLData(mockedPreparedStatement);
        expect(sqlResults.sql).toBe('SELECT [user].[id] AS Id, [user].[firstname] AS Firstname, [user].[surname] AS Surname, [user].[createdOn] AS CreatedOn, [user].[lastUpdatedOn] AS LastUpdatedOn, [user].[lastUpdatedBy] AS LastUpdatedBy, [user].[obsolete] AS Obsolete, [user].[obsoletedOn] AS ObsoletedOn, [user].[obsoletedBy] AS ObsoletedBy FROM dbo.[user] ;');
        expect(sqlResults.variables).toMatchObject({});
    });

    test('It should get a single entity if the id is specified', async () => {
        ctx.req.method = 'GET';
        ctx.req.params['entity'] = 'Users';
        ctx.req.params['id'] = '2';

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(200);
        expect(ctx.res.body).toMatchObject([ { 'Id': 2, 'Firstname': 'Jeff', 'Surname': 'Jacob', 'CreatedOn': '2020-11-14T19:54:04.000Z', 'LastUpdatedOn': '2020-11-14T19:54:04.000Z', 'LastUpdatedBy': 'API', 'Obsolete': false, 'ObsoletedOn': null, 'ObsoletedBy': null }]);

        // Verify SQL & Variables
        const sqlResults = GetSQLData(mockedPreparedStatement);
        expect(sqlResults.sql).toBe('SELECT [user].[id] AS Id, [user].[firstname] AS Firstname, [user].[surname] AS Surname, [user].[createdOn] AS CreatedOn, [user].[lastUpdatedOn] AS LastUpdatedOn, [user].[lastUpdatedBy] AS LastUpdatedBy, [user].[obsolete] AS Obsolete, [user].[obsoletedOn] AS ObsoletedOn, [user].[obsoletedBy] AS ObsoletedBy FROM dbo.[user] WHERE [user].[id]=@userId;');
        expect(sqlResults.variables).toMatchObject({userId: '2'});
    });

    test('It should be able to get a single entity with a composite primary key', async () => {
        ctx.req.method = 'GET';
        ctx.req.params['entity'] = 'PropertyUsers';
        ctx.req.params['id'] = '1-2';

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(200);
        expect(ctx.res.body).toMatchObject([{'PropertyId':1,'UserId':2,'Data1':'LOL'}]);

        // Verify SQL & Variables
        const sqlResults = GetSQLData(mockedPreparedStatement);
        expect(sqlResults.sql).toBe('SELECT [property_user].[propertyId] AS PropertyId, [property_user].[userId] AS UserId, [property_user].[data1] AS Data1 FROM dbo.[property_user] WHERE [property_user].[propertyId]=@property_userPropertyId AND [property_user].[userId]=@property_userUserId;');
        expect(sqlResults.variables).toMatchObject({property_userPropertyId: '1', property_userUserId: '2'});
    });

    test('Get should error if the primary key is invalid', async () => {
        ctx.req.method = 'GET';
        ctx.req.params['entity'] = 'PropertyUsers';
        ctx.req.params['id'] = '1-2-5';

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('Invalid primary key');
    });

    test('$filter should be able to get results with multiple filters', async () => {
        ctx.req.method = 'GET';
        ctx.req.params['entity'] = 'Users';
        ctx.req.query['$filter'] = 'Surname eq \'Jacob\' OR Firstname eq \'Jackson\'';

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(200);
        expect(ctx.res.body).toMatchObject([{ 'Id': 1, 'Firstname': 'Jackson', 'Surname': 'Jacob', 'CreatedOn': '2020-11-14T19:54:04.000Z', 'LastUpdatedOn': '2020-11-14T19:54:04.000Z', 'LastUpdatedBy': 'API', 'Obsolete': false, 'ObsoletedOn': null, 'ObsoletedBy': null }, { 'Id': 2, 'Firstname': 'Jeff', 'Surname': 'Jacob', 'CreatedOn': '2020-11-14T19:54:04.000Z', 'LastUpdatedOn': '2020-11-14T19:54:04.000Z', 'LastUpdatedBy': 'API', 'Obsolete': false, 'ObsoletedOn': null, 'ObsoletedBy': null }]);

        // Verify SQL & Variables
        const sqlResults = GetSQLData(mockedPreparedStatement);
        expect(sqlResults.sql).toBe('SELECT [user].[id] AS Id, [user].[firstname] AS Firstname, [user].[surname] AS Surname, [user].[createdOn] AS CreatedOn, [user].[lastUpdatedOn] AS LastUpdatedOn, [user].[lastUpdatedBy] AS LastUpdatedBy, [user].[obsolete] AS Obsolete, [user].[obsoletedOn] AS ObsoletedOn, [user].[obsoletedBy] AS ObsoletedBy FROM dbo.[user] WHERE [user].[surname]=@userSurname OR [user].[firstname]=@userFirstname;');
        expect(sqlResults.variables).toMatchObject({userSurname: 'Jacob', userFirstname: 'Jackson'});
    });

    test('$filter should support nulls', async () => {
        // Check is eq null works
        ctx.req.method = 'GET';
        ctx.req.params['entity'] = 'Users';
        ctx.req.query['$filter'] = 'Surname eq null';

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(200);
        expect(ctx.res.body).toMatchObject([{ 'Id': 1, 'Firstname': 'Jackson', 'Surname': null, 'CreatedOn': '2020-11-14T19:54:04.000Z', 'LastUpdatedOn': '2020-11-14T19:54:04.000Z', 'LastUpdatedBy': 'API', 'Obsolete': false, 'ObsoletedOn': null, 'ObsoletedBy': null }]);

        // Verify SQL & Variables
        const sqlResults = GetSQLData(mockedPreparedStatement);
        expect(sqlResults.sql).toBe('SELECT [user].[id] AS Id, [user].[firstname] AS Firstname, [user].[surname] AS Surname, [user].[createdOn] AS CreatedOn, [user].[lastUpdatedOn] AS LastUpdatedOn, [user].[lastUpdatedBy] AS LastUpdatedBy, [user].[obsolete] AS Obsolete, [user].[obsoletedOn] AS ObsoletedOn, [user].[obsoletedBy] AS ObsoletedBy FROM dbo.[user] WHERE [user].[surname] IS NULL;');
        expect(sqlResults.variables).toMatchObject({});

        // Check ne to null works
        ctx.req.query['$filter'] = 'Surname ne null';

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(200);
        expect(ctx.res.body).toMatchObject([{ 'Id': 1, 'Firstname': 'Jackson', 'Surname': 'Jacob', 'CreatedOn': '2020-11-14T19:54:04.000Z', 'LastUpdatedOn': '2020-11-14T19:54:04.000Z', 'LastUpdatedBy': 'API', 'Obsolete': false, 'ObsoletedOn': null, 'ObsoletedBy': null }]);

        // Verify SQL & Variables
        const sqlResults2 = GetSQLData(mockedPreparedStatement, 1);
        expect(sqlResults2.sql).toBe('SELECT [user].[id] AS Id, [user].[firstname] AS Firstname, [user].[surname] AS Surname, [user].[createdOn] AS CreatedOn, [user].[lastUpdatedOn] AS LastUpdatedOn, [user].[lastUpdatedBy] AS LastUpdatedBy, [user].[obsolete] AS Obsolete, [user].[obsoletedOn] AS ObsoletedOn, [user].[obsoletedBy] AS ObsoletedBy FROM dbo.[user] WHERE [user].[surname] IS NOT NULL;');
        expect(sqlResults2.variables).toMatchObject({});

    });

    test('$filter should support null with other filters', async () => {
        ctx.req.method = 'GET';
        ctx.req.params['entity'] = 'Users';
        ctx.req.query['$filter'] = 'Surname eq null OR Firstname eq \'Jackson\'';

        await api(ctx, ctx.req);

        expect(ctx.res.status).toBe(200);

        // Verify SQL & Variables
        const sqlResults = GetSQLData(mockedPreparedStatement, 0);
        expect(sqlResults.sql).toBe('SELECT [user].[id] AS Id, [user].[firstname] AS Firstname, [user].[surname] AS Surname, [user].[createdOn] AS CreatedOn, [user].[lastUpdatedOn] AS LastUpdatedOn, [user].[lastUpdatedBy] AS LastUpdatedBy, [user].[obsolete] AS Obsolete, [user].[obsoletedOn] AS ObsoletedOn, [user].[obsoletedBy] AS ObsoletedBy FROM dbo.[user] WHERE [user].[surname] IS NULL OR [user].[firstname]=@userFirstname;');
        expect(sqlResults.variables).toMatchObject({ userFirstname: 'Jackson' });

    });

    test('$filter should error if unsupported comparison operator is done with a null', async () => {
        ctx.req.method = 'GET';
        ctx.req.params['entity'] = 'Users';
        ctx.req.query['$filter'] = 'Surname ge null';

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('Only eq or ne operators are allowed for null values');
    });

    test('$filter should error if not in correct format', async () => {
        ctx.req.method = 'GET';
        ctx.req.params['entity'] = 'Users';
        ctx.req.query['$filter'] = 'Surname eqnull';

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('Unknown $filter segment detected Surname eqnull');
    });

    test('$filter should error if a non filterable field is chosen', async () => {
        ctx.req.method = 'GET';
        ctx.req.params['entity'] = 'Users';
        ctx.req.query['$filter'] = 'Portfolio eq null';

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('Portfolio is not a filterable field');
    });

    test('$filter should error if a unknown field is chosen', async () => {
        ctx.req.method = 'GET';
        ctx.req.params['entity'] = 'Users';
        ctx.req.query['$filter'] = 'Unknown eq null';

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('Field Unknown does not exist on entity to $filter');
    });

    test('$select should error if a unknown field is selected', async () => {
        ctx.req.method = 'GET';
        ctx.req.params['entity'] = 'Users';
        ctx.req.query['$select'] = 'Unknown, Firstname, Surname';

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('Field Unknown does not exist on entity to $select');
    });

    test('$select error if a field is not selectable', async () => {
        ctx.req.method = 'GET';
        ctx.req.params['entity'] = 'Users';
        ctx.req.query['$select'] = 'Portfolio, Firstname, Surname';

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('Portfolio is not a selectable field');
    });

    test('$select should return the selected fields', async () => {
        ctx.req.method = 'GET';
        ctx.req.params['entity'] = 'Users';
        ctx.req.query['$select'] = 'Id, Firstname, Surname, CreatedOn';

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(200);
        expect(ctx.res.body).toMatchObject([{Id: 1, Firstname: 'Jackson', Surname: 'Jacob', CreatedOn: '2020-11-14T19:54:04.000Z'}]);

        // Verify SQL & Variables
        const sqlResults = GetSQLData(mockedPreparedStatement, 0);
        expect(sqlResults.sql).toBe('SELECT [user].[id] AS Id, [user].[firstname] AS Firstname, [user].[surname] AS Surname, [user].[createdOn] AS CreatedOn FROM dbo.[user] ;');
        expect(sqlResults.variables).toMatchObject({});
    });

    test('$top should return the correct number of users', async () => {
        ctx.req.method = 'GET';
        ctx.req.params['entity'] = 'Users';
        ctx.req.query['$top'] = '2';

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(200);
        expect(ctx.res.body).toMatchObject([{ 'Id': 1, 'Firstname': 'Jackson', 'Surname': 'Jacob', 'CreatedOn': '2020-11-14T19:54:04.000Z', 'LastUpdatedOn': '2020-11-14T19:54:04.000Z', 'LastUpdatedBy': 'API', 'Obsolete': false, 'ObsoletedOn': null, 'ObsoletedBy': null }, { 'Id': 2, 'Firstname': 'Jeff', 'Surname': 'Jacob', 'CreatedOn': '2020-11-14T19:54:04.000Z', 'LastUpdatedOn': '2020-11-14T19:54:04.000Z', 'LastUpdatedBy': 'API', 'Obsolete': false, 'ObsoletedOn': null, 'ObsoletedBy': null }]);

        // Verify SQL & Variables
        const sqlResults = GetSQLData(mockedPreparedStatement, 0);
        expect(sqlResults.sql).toBe('SELECT TOP 2 [user].[id] AS Id, [user].[firstname] AS Firstname, [user].[surname] AS Surname, [user].[createdOn] AS CreatedOn, [user].[lastUpdatedOn] AS LastUpdatedOn, [user].[lastUpdatedBy] AS LastUpdatedBy, [user].[obsolete] AS Obsolete, [user].[obsoletedOn] AS ObsoletedOn, [user].[obsoletedBy] AS ObsoletedBy FROM dbo.[user] ;');
        expect(sqlResults.variables).toMatchObject({});
    });

    test('$top should return error if not numeric', async () => {
        ctx.req.method = 'GET';
        ctx.req.params['entity'] = 'Users';
        ctx.req.query['$top'] = 'A string value';

        await api(ctx, ctx.req);

        // Verify HTTP result
        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('Invalid $top value');
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
        const sqlResults = GetSQLData(mockedPreparedStatement);
        expect(sqlResults.sql).toBe('INSERT INTO dbo.[user] (firstname, surname, createdOn, lastUpdatedOn, lastUpdatedBy) OUTPUT INSERTED.id AS Id, INSERTED.firstname AS Firstname, INSERTED.surname AS Surname, INSERTED.createdOn AS CreatedOn, INSERTED.lastUpdatedOn AS LastUpdatedOn, INSERTED.lastUpdatedBy AS LastUpdatedBy, INSERTED.obsolete AS Obsolete, INSERTED.obsoletedOn AS ObsoletedOn, INSERTED.obsoletedBy AS ObsoletedBy VALUES (@userFirstname, @userSurname, @userCreatedOn, @userLastUpdatedOn, @userLastUpdatedBy);');
        expect(sqlResults.variables['userFirstname']).toBe('Jackson');
        expect(sqlResults.variables['userSurname']).toBe('Jacob');
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
        const sqlResults = GetSQLData(mockedPreparedStatement);
        expect(sqlResults.sql).toBe('UPDATE dbo.[user] SET [user].[firstname]=@userFirstname, [user].[surname]=@userSurname, [user].[lastUpdatedOn]=@userLastUpdatedOn, [user].[lastUpdatedBy]=@userLastUpdatedBy OUTPUT INSERTED.id AS Id, INSERTED.firstname AS Firstname, INSERTED.surname AS Surname, INSERTED.createdOn AS CreatedOn, INSERTED.lastUpdatedOn AS LastUpdatedOn, INSERTED.lastUpdatedBy AS LastUpdatedBy, INSERTED.obsolete AS Obsolete, INSERTED.obsoletedOn AS ObsoletedOn, INSERTED.obsoletedBy AS ObsoletedBy WHERE [user].[id] = @userId;');
        expect(sqlResults.variables['userFirstname']).toBe('Donde');
        expect(sqlResults.variables['userSurname']).toBe('Spectre');
        expect(sqlResults.variables['userId']).toBe('1');
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
        const sqlResults = GetSQLData(mockedPreparedStatement);
        expect(sqlResults.sql).toBe('UPDATE dbo.[user] SET [user].[obsolete]=@userObsolete, [user].[obsoletedOn]=@userObsoletedOn, [user].[obsoletedBy]=@userObsoletedBy, [user].[lastUpdatedOn]=@userLastUpdatedOn, [user].[lastUpdatedBy]=@userLastUpdatedBy OUTPUT INSERTED.id AS Id, INSERTED.firstname AS Firstname, INSERTED.surname AS Surname, INSERTED.createdOn AS CreatedOn, INSERTED.lastUpdatedOn AS LastUpdatedOn, INSERTED.lastUpdatedBy AS LastUpdatedBy, INSERTED.obsolete AS Obsolete, INSERTED.obsoletedOn AS ObsoletedOn, INSERTED.obsoletedBy AS ObsoletedBy WHERE [user].[id] = @userId;');
        expect(sqlResults.variables['userObsolete']).toBe(true);
        expect(sqlResults.variables['userObsoletedOn']).toBeDefined();
        expect(sqlResults.variables['userObsoletedBy']).toBe('API');
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
        const sqlResults = GetSQLData(mockedPreparedStatement);
        expect(sqlResults.sql).toBe('UPDATE dbo.[user] SET [user].[obsolete]=@userObsolete, [user].[obsoletedOn]=@userObsoletedOn, [user].[obsoletedBy]=@userObsoletedBy, [user].[lastUpdatedOn]=@userLastUpdatedOn, [user].[lastUpdatedBy]=@userLastUpdatedBy OUTPUT INSERTED.id AS Id, INSERTED.firstname AS Firstname, INSERTED.surname AS Surname, INSERTED.createdOn AS CreatedOn, INSERTED.lastUpdatedOn AS LastUpdatedOn, INSERTED.lastUpdatedBy AS LastUpdatedBy, INSERTED.obsolete AS Obsolete, INSERTED.obsoletedOn AS ObsoletedOn, INSERTED.obsoletedBy AS ObsoletedBy WHERE [user].[id] = @userId;');
        expect(sqlResults.variables['userObsolete']).toBe(true);
        expect(sqlResults.variables['userObsoletedOn']).toBeDefined();
        expect(sqlResults.variables['userObsoletedBy']).toBe('API');
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
        const sqlResults = GetSQLData(mockedPreparedStatement);
        expect(sqlResults.sql).toBe('UPDATE dbo.[user] SET [user].[obsolete]=@userObsolete, [user].[obsoletedOn]=@userObsoletedOn, [user].[obsoletedBy]=@userObsoletedBy, [user].[lastUpdatedOn]=@userLastUpdatedOn, [user].[lastUpdatedBy]=@userLastUpdatedBy OUTPUT INSERTED.id AS Id, INSERTED.firstname AS Firstname, INSERTED.surname AS Surname, INSERTED.createdOn AS CreatedOn, INSERTED.lastUpdatedOn AS LastUpdatedOn, INSERTED.lastUpdatedBy AS LastUpdatedBy, INSERTED.obsolete AS Obsolete, INSERTED.obsoletedOn AS ObsoletedOn, INSERTED.obsoletedBy AS ObsoletedBy WHERE [user].[id] = @userId;');
        expect(sqlResults.variables['userObsolete']).toBe(false);
        expect(sqlResults.variables['userObsoletedOn']).toBeNull();
        expect(sqlResults.variables['userObsoletedBy']).toBeNull();
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
        patchCtx.req.params['id'] = '3';

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
        ctx.req.params['id'] = '1';

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
        const sqlResults = GetSQLData(mockedPreparedStatement);
        expect(sqlResults.sql).toBe('UPDATE dbo.[property_user] SET [property_user].[data1]=@property_userData1 OUTPUT INSERTED.propertyId AS PropertyId, INSERTED.userId AS UserId, INSERTED.data1 AS Data1 WHERE [property_user].[propertyId] = @property_userPropertyId AND [property_user].[userId] = @property_userUserId;');
        expect(sqlResults.variables['property_userData1']).toBe('Some updated text');
        expect(sqlResults.variables['property_userPropertyId']).toBe('2');
        expect(sqlResults.variables['property_userUserId']).toBe('1');
    });

    test('It should handle error if composite primary is not passed in the correct format', async () => {
        ctx.req.params['entity'] = 'PropertyUsers';
        ctx.req.params['id'] = '2-';

        ctx.req.method = 'PATCH';
        ctx.req.body = {
            'Data1': 'Some updated text'
        };

        await api(ctx, ctx.req);

        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('PropertyUsers missing primary key');
    });

    test('It should error when a reference field is attempted to be amended', async () => {
        ctx.req.method = 'POST';
        ctx.req.params['entity'] = 'Users';
        ctx.req.body = {
            Portfolio: 'Jackson',
            Surname: 'Jacob',
            CreatedOn: new Date().toISOString(),
        };

        await api(ctx, ctx.req);

        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('Portfolio is not a field that can be specified');
    });

    test('It should error if the unknown fields are requested to be amended', async () => {
        ctx.req.params['entity'] = 'PropertyUsers';
        ctx.req.params['id'] = '2-1';

        ctx.req.method = 'PATCH';
        ctx.req.body = {
            'Unknown': true
        };

        await api(ctx, ctx.req);

        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('Property [Unknown] does not exist on entity [PropertyUsers]');
    });

    test('It should error if an unsupported field type is referenced', async () => {
        ctx.req.params['entity'] = 'UsersBroken';
        ctx.req.params['id'] = '2';

        ctx.req.method = 'PATCH';
        ctx.req.body = {
            'Firstname': 'Jackson',
            'Surname': 'Spectre',
        };

        await api(ctx, ctx.req);
        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('Unhandled datatype provided - unknown');
    });

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

    test('It should truncate numeric values if its greather that MAX_INT (2147483640 > x >= -2147483639)', async () => {
        ctx.req.params['entity'] = 'Users2';
        ctx.req.params['id'] = '3';

        ctx.req.method = 'PATCH';
        ctx.req.body = {
            'Data1': 2147483641
        };

        await api(ctx, ctx.req);
        expect(ctx.res.status).toBe(200);
        expect(ctx.res.body).toMatchObject([ { Id: 3, Firstname: 'Jackson', Surname: 'Spectre', Data1: 2147483640, CreatedOn: '2020-11-23T19:53:55.000Z', LastUpdatedOn: '2020-11-25T22:59:39.000Z', LastUpdatedBy: 'API', Obsolete: false, ObsoletedOn: null, ObsoletedBy: null } ]);

        ctx.req.body = {
            'Data1': -2147483640
        };

        await api(ctx, ctx.req);
        expect(ctx.res.status).toBe(200);
        expect(ctx.res.body).toMatchObject([ { Id: 3, Firstname: 'Jackson', Surname: 'Spectre', Data1: -2147483639, CreatedOn: '2020-11-23T19:53:55.000Z', LastUpdatedOn: '2020-11-25T22:59:39.000Z', LastUpdatedBy: 'API', Obsolete: false, ObsoletedOn: null, ObsoletedBy: null } ]);

        ctx.req.body = {
            'Data1': 31
        };

        await api(ctx, ctx.req);
        expect(ctx.res.status).toBe(200);
        expect(ctx.res.body).toMatchObject([ { Id: 3, Firstname: 'Jackson', Surname: 'Spectre', Data1: 31, CreatedOn: '2020-11-23T19:53:55.000Z', LastUpdatedOn: '2020-11-25T22:59:39.000Z', LastUpdatedBy: 'API', Obsolete: false, ObsoletedOn: null, ObsoletedBy: null } ]);

    });

    test('It should error if working locally and the schema directory is not set', async () => {
        delete process.env['SchemaDirectory'];
        ctx.req.params['entity'] = 'Users2';
        ctx.req.params['id'] = '3';

        ctx.req.method = 'PATCH';
        ctx.req.body = {
            'Data1': 2147483641
        };

        await api(ctx, ctx.req);
        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('Environtment variable - Local environment SchemaDirectory not set');
    });

    test('It should error if not working locally; as feature not implemented', async () => {
        delete process.env['AzureWebJobsStorage'];
        ctx.req.params['entity'] = 'Users2';
        ctx.req.params['id'] = '3';

        ctx.req.method = 'PATCH';
        ctx.req.body = {
            'Data1': 2147483641
        };

        await api(ctx, ctx.req);
        expect(ctx.res.status).toBe(400);
        expect((ctx.res.body as ErrorResponse).errors[0].message).toBe('Feature not yet available');
    });


});
