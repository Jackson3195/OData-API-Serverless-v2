import { GetFreshContext, MockContext } from '@testing/index';
import { ResponseError } from '@assets/interfaces';
import api from './index';

describe('API Functionality', () => {

    let ctx: MockContext;

    beforeEach(() => {
        ctx = GetFreshContext();
    });

    test('Rejects unsupported request type with status code 405', async () => {
        ctx.req.method = 'PUT';
        await api(ctx, ctx.req);
        expect(ctx.res.status).toBe(405);
    });

    test('Rejects requests if no entity passed', async () => {
        delete ctx.req.params.entity;
        await api(ctx, ctx.req);
        expect(ctx.res.status).toBe(400);
        const body: ResponseError = ctx.res.body;
        expect(body.errors[0].message).toContain('Entity required');
    });

    it.each`
        entity | input | output
        ${'Users'} | ${{Firstname: 'Jackson', Surname: 'Jacob'}} | ${{Firstname: 'Jackson', Surname: 'Jacob'}}
        ${'Cars'} | ${{Make: 'Bugatti', Model: 'Chiron'}} | ${{Make: 'Bugatti', Model: 'Chiron'}},
    `('Should create a entity', async ({entity, input, output}) => {
        ctx.req.method = 'POST';
        ctx.req.params['entity'] = entity;
        ctx.req.body = input;

        await api(ctx, ctx.req);

        expect(ctx.res.status).toBe(201);
        expect(ctx.res.body).toMatchObject(output);
    });

    // it.each`
    //     entity | id | input | output
    //     ${'Users'} | ${3} | ${{Surname: 'Spectre'}} | ${{Firstname: 'Jackson', Surname: 'Spectre'}}
    // `('Should update a entity', async ({entity, id, input, output}) => {
    //     ctx.req.method = 'PATCH';
    //     ctx.req.params['entity'] = entity;
    //     ctx.req.params['id'] = id;
    //     ctx.req.body = input;

    //     await api(ctx, ctx.req);

    //     expect(ctx.res.status).toBe(200);
    //     expect(ctx.res.body).toMatchObject(output);
    // });
});