import { Context, AzureFunction } from '@azure/functions';

const api: AzureFunction = function (ctx: Context) {
    // Determine if method allowed
    ctx.log.warn('Hello');
    ctx.done();
};

export default api;
