import { GetFreshContext, MockContext } from '@testing/index';
import api from './index';

describe('API Functionality', () => {

    let defaultContext: MockContext;

    beforeEach(() => {
        defaultContext = GetFreshContext();
    });

    // Only supported methods are GET, POST, PATCH, DELETE
    test('Rejects unsupported request type with status code 405', async () => {
        defaultContext.req.method = 'PUT';
        await api(defaultContext, defaultContext.req);
        expect(defaultContext.res.status).toBe(405);
    });

    test('Unauthorised requests correctly', async () => {
        await api(defaultContext, defaultContext.req);
        expect(defaultContext.res.status).toBe(401);
        expect(defaultContext.done).toBeCalled();
    });

    test('Authorised requests correctly', async () => {
        defaultContext.req.headers['authorization'] = 'Bearer token';
        await api(defaultContext, defaultContext.req);
        expect(defaultContext.res.status).toBe(200);
    });
});