import { ResponseError } from '@assets/interfaces';
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
        defaultContext.req.headers = {};
        await api(defaultContext, defaultContext.req);
        expect(defaultContext.res.status).toBe(401);
        expect(defaultContext.done).toBeCalled();
    });

    test('Authorised requests correctly', async () => {
        await api(defaultContext, defaultContext.req);
        expect(defaultContext.res.status).toBe(200);
    });

    test('Rejects requests if no entity passed', async () => {
        delete defaultContext.req.params.entity;
        await api(defaultContext, defaultContext.req);
        expect(defaultContext.res.status).toBe(400);
        const body: ResponseError = defaultContext.res.body;
        expect(body.errors[0].message).toContain('Entity required');
    });

    test('Rejects requests if no entity id passed', async () => {
        defaultContext.req.method = 'PATCH';
        delete defaultContext.req.params.id;

        await api(defaultContext, defaultContext.req);
        expect(defaultContext.res.status).toBe(400);
        const body: ResponseError = defaultContext.res.body;
        expect(body.errors[0].message).toContain('EntityId required');

        defaultContext.req.method = 'DELETE';
        await api(defaultContext, defaultContext.req);
        expect(defaultContext.res.status).toBe(400);
        const body2: ResponseError = defaultContext.res.body;
        expect(body2.errors[0].message).toContain('EntityId required');
    });

    test('Rejects requests if no body is passed', async () => {
        defaultContext.req.body = null;
        defaultContext.req.method = 'POST';

        await api(defaultContext, defaultContext.req);
        expect(defaultContext.res.status).toBe(400);
        const body: ResponseError = defaultContext.res.body;
        expect(body.errors[0].message).toContain('Entity body required');
    });
});