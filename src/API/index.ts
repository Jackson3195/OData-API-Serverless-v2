import { Context, HttpMethod, HttpRequest, AzureFunction } from '@azure/functions';
import { Captialize, HandleError, Sanitize } from '@assets/mixins';
import { Primitives } from '@assets/interfaces';

const api: AzureFunction = async function (ctx: Context, req: HttpRequest) {
    // Determine if method allowed
    const method: HttpMethod = req.method;
    if (method === 'GET' || method === 'POST' || method === 'PATCH' || method === 'DELETE') {
        // Global try/catch incase something fails
        try {
            if (AuthorisedRequest(ctx))  {
                // Extract request information
                if (req.params['entity']) {
                    const entity = Captialize(Sanitize<string>(req.params['entity'], true).toLocaleLowerCase());
                    let entityId: string;
                    let body: Record<string, Primitives> = null;

                    // Populate entityId if needed
                    if (method === 'PATCH' || method === 'DELETE') {
                        entityId = ctx.req.params['id'] ? Sanitize(ctx.req.params['id'], true) : null;
                        // Handle null entity IDs
                        if (!entityId) {
                            throw new Error('EntityId required');
                        }
                    }

                    // Populate body if needed
                    if (method === 'GET' || method === 'POST' || method === 'PATCH') {
                        // If GET, populate with query otherwise populate with request body
                        if (method === 'GET') {
                            body = req.query;
                        } else {
                            // Handle empty bodys
                            if (req.body) {
                                body = ctx.req.body;
                            } else {
                                throw new Error('Entity body required');
                            }
                        }
                    }

                    ctx.log.warn(body);
                    ctx.log.warn(entity);

                    // Determine if entity is generic or bespoke entity
                } else {
                    throw new Error('Entity required');
                }
            } else {
                throw new Error('Unauthorised');
            }
        } catch (e) {
            HandleError(ctx, [e], req.body);
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

