import { Context, HttpRequest } from '@azure/functions';

module.exports = function (ctx: Context, _req: HttpRequest) {
    ctx.log.warn('Hello world');
    ctx.res.status = 200;
    ctx.res.body = {
        message: 'Hello world'
    };
    ctx.done();
};
