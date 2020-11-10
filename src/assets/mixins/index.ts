import { ContextResponse, ResponseErrorBody } from '@assets/interfaces';
import { Context } from '@azure/functions';

export function HandleError (ctx: Context, errors: Error[], payload: Record<string, any> = null): void {
    // Process errors
    const errorDetails: ResponseErrorBody[] = [];
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