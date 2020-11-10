import { ResponseError } from '@assets/interfaces';
import { GetFreshContext, MockContext } from '@testing/index';
import { HandleError } from './index';

describe('Mixins - HandleError', () => {
    let context: MockContext;

    beforeEach(() => {
        context = GetFreshContext();
    });

    test('Error response structure is valid', () => {
        const errors: Error[] = [new Error('Error1'), {} as Error, new Error('Error3')];
        const payload: Record<string, string> = {
            test: 'Hello World',
        };

        HandleError(context, errors, payload);

        expect(context.res.status).toBe(400);
        expect((context.res.headers as Record<string, string>)['Content-Type']).toBe('application/json');

        const responseBody: ResponseError = context.res.body;
        expect(responseBody.context).toMatchObject(payload);
        expect(responseBody.errors.length).toBe(3);
        expect(responseBody.errors[0].message).toBe('Error1');
        expect(responseBody.errors[1].name).toBe('No error name provided');
        expect(responseBody.errors[1].message).toBe('No error message provided');
        expect(responseBody.errors[1].stack).toBe('No error stack provided');
        expect(context.done).toHaveBeenCalled();
    });

    test('Handles unauthorised', () => {
        const errors: Error[] = [new Error('Unauthorised')];
        HandleError(context, errors);

        expect(context.res.status).toBe(401);
    });
});