import { Context, HttpRequest, AzureFunction, HttpMethod } from '@azure/functions';

const api: AzureFunction = async function (ctx: Context, req: HttpRequest) {
    // Determine method allowed
    const method: HttpMethod = req.method;
    if (method === 'GET' || method === 'POST' || method === 'PATCH' || method === 'DELETE') {
        if (method === 'POST') {
            ctx.res.status = 201;
        } else {
            ctx.res.status = 200;
        }
        ctx.res.body = req.body;
    } else {
        ctx.res.status = 405;
    }
};

export default api;