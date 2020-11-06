import { Context, HttpRequest } from '@azure/functions';

// TODO: Ensure alais imports work for example @interfaces/modules should then blah/blah/interfaces/modules
module.exports = async function (ctx: Context, _req: HttpRequest) {
    ctx.log.warn('Hello world');
    ctx.res.status = 200;
    ctx.res.body = {
        message: 'Hello world'
    };
};
