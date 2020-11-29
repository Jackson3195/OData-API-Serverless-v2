import { ContextResponse, JSTypes, ErrorResponseBody } from '@assets/interfaces';
import { Context } from '@azure/functions';

export function HandleError (ctx: Context, errors: Error[], payload: Record<string, any> = null): void {
    // Process errors
    const errorDetails: ErrorResponseBody[] = [];
    let unauthorised = false;
    for (let e of errors) {
        // Determine if unauthorised has been see
        if (e.message === 'Unauthorised') {
            unauthorised = true;
            break;
        }
        // Continue with errors
        errorDetails.push(
            {
                name: e.name || 'No error name provided',
                message: e.message || 'No error message provided',
                stack: e.stack || 'No error stack provided',
            },
        );
        ctx.log.error(e);
    }
    // If unauthorised; respond with 401 else 400 and details
    if (unauthorised) {
        ctx.res.status = 401;
        ctx.res.body = null;
    } else {
        // Create response
        const response: ContextResponse = {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                context: payload,
                errors: errorDetails,
            }
        };
        // Assign to response
        ctx.res = response;
    }
    // Kill the invocation
    ctx.done();
}

export function Sanitize<T> (input: unknown, hard = false): T {
    // Determine type
    const type: JSTypes = typeof input;
    // Determine sanitization process
    switch (type) {
        case 'string':
            const stringData = input as string;
            if (hard) {
                return stringData
                    .replace(/\s+/gm, '') // Replace spaces
                    .replace(/(<|\?|>|;|-{2,}|\'|\\'|:|#|$|&{2,}|!{2,})/gm, '') as unknown as T; // Replace dangerous characters HARD
            } else {
                return stringData
                    .replace(/(<|\?|>|;|-{2,}|\'|\\')/gm, '') as unknown as T; // Replace dangerous characters LIGHT
            }
        case 'number':
            const maxInt = 2147483640;
            const minInt = -2147483639;
            const numericData = input as number;
            if (numericData >= minInt && numericData <= maxInt) {
                return numericData as unknown as T;
            } else {
                return (numericData >= 0 ? maxInt : minInt) as unknown as T;
            }
        case 'boolean':
        case 'object':
            return input as T;
        /* istanbul ignore next */
        default:
            return null;
    }
}

export function Captialize (input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1);
}