import { Context, HttpMethod, HttpRequest, AzureFunction } from '@azure/functions';
import { HandleError } from '@assets/mixins';

const api: AzureFunction = async function (ctx: Context, req: HttpRequest) {
    // Determine if method allowed
    const method: HttpMethod = req.method;
    if (method === 'GET' || method === 'POST' || method === 'PATCH' || method === 'DELETE') {
        // Global try/catch incase something fails
        try {
            if (AuthorisedRequest(ctx))  {
                ctx.log.warn('Hello');
            } else {
                throw new Error('Unauthorised');
            }
        } catch (e) {
            HandleError(ctx, [e]);
        }
    } else {
        ctx.res.status = 405;
    }
};

export default api;

// Helper functions
function AuthorisedRequest (ctx: Context): boolean {
    // Extract headers
    const headers: Record<string, string> = ctx.req.headers;
    // Get token
    const token: string = headers.authorization ? headers.authorization.split(' ')[1] : null;
    // Determine validility
    if (token) {
        return true;
    } else {
        return false;
    }
}

