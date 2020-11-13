import { Context, HttpRequest, AzureFunction } from '@azure/functions';

const api: AzureFunction = async function (ctx: Context, _req: HttpRequest) {
    // Determine if method allowed
    ctx.log.warn('Hello');
};

export default api;
