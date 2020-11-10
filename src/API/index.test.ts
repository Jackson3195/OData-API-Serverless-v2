import { Context } from '@azure/functions';
import { GetFreshContext } from '@testing/index';
import api from './index';

describe('API Functionality', () => {

    let defaultContext: Context;

    beforeEach(() => {
        defaultContext = GetFreshContext();
    });

    // Only supported methods are GET, POST, PATCH, DELETE
    test('Rejects unsupported request type with staus code 405', async () => {
        defaultContext.req.method = 'PUT';
        await api(defaultContext, defaultContext.req);
        expect(defaultContext.res.status).toBe(405);
    });
});