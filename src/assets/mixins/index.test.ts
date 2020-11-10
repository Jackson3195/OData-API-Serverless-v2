import { ResponseError } from '@assets/interfaces';
import { GetFreshContext, MockContext } from '@testing/index';
import { HandleError, Sanitize, Captialize } from './index';

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

describe('Mixins - Sanitize', () => {

    test('Sanitizes values - LIGHT', () => {
        const dirtyData: Record<string, any> = {
            data1: '-- Hello; SELECT * FROM dbo.[user];',
            data2: '<?php echo "Hello" ?>',
            data3: 'test --<?sdgsg?> test2',
            data4: 123,
            data5: () => 'Hello',
        };

        const cleanData: Record<string, any> = {
            data1: ' Hello SELECT * FROM dbo.[user]',
            data2: 'php echo "Hello" ',
            data3: 'test sdgsg test2',
            data4: 123,
            data5: undefined,
        };

        for (const key of Object.keys(dirtyData)) {
            const result: string = Sanitize(dirtyData[key]);
            expect(result).toBe(cleanData[key]);
        }
    });

    test('Sanitizes values - HARD', () => {
        const result: string = Sanitize('This is one <?php echo ?> though #$&&&!!!! to crack', true);
        expect(result).toBe('Thisisonephpechothough$tocrack');
    });
});

describe('Mixins - Captialize', () => {

    test('Capitilzation works', () => {
        const word = 'word';
        const result: string = Captialize(word);
        const char: string = result.charAt(0);
        expect(char).toBe('W');
    });

    test('Handles invalid input', () => {
        const invalidInputs: any[] = [123, {}, [], true];
        for (const input of invalidInputs) {
            const result: string = Captialize(input);
            expect(result).toBeNull();
        }
    });

});