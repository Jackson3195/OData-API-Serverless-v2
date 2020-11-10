import { Context, HttpMethod, HttpRequest, AzureFunction } from '@azure/functions';
import { hello } from '@assets/index';

const api: AzureFunction = async function (ctx: Context, req: HttpRequest) {
    // Determine if method allowed
    const method: HttpMethod = req.method;
    if (method === 'GET' || method === 'POST' || method === 'PATCH' || method === 'DELETE') {
        ctx.log.warn('Allowed!!' + hello);
    } else {
        ctx.res.status = 405;
    }
};

export default api;
