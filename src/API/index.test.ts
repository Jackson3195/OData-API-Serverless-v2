import { GetFreshContext, MockContext } from '@assets/tests';
// Note: Import so that the mocked class is used instead of the real one
import MSSqlConnection from '@assets/connection/mssql';
jest.mock('@assets/connection/mssql');
const mockedMSSqlConnection = MSSqlConnection as unknown as jest.Mock<typeof MSSqlConnection>;
// Note: Import last so that any other mock actions takes effect first
import api from './index';

describe('Get a entity', () => {

    let ctx: MockContext;

    beforeEach(() => {
        ctx = GetFreshContext();
        mockedMSSqlConnection.mockClear();
    });

    test('It should create a entity', async () => {
        ctx.req.method = 'POST';
        ctx.req.body = {
            Firstname: 'Jackson',
            Surname: 'Jacob'
        };

        await api(ctx, ctx.req);

        expect(ctx.res.status).toBe(201);
        expect(ctx.res.body).toMatchObject({Firstname: 'Jackson', Surname: 'Jacob'});
    });

});