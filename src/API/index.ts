import { Context, HttpRequest } from '@azure/functions';
import { hello } from '@assets/index';

// TODO: Ensure alais imports work for example @interfaces/modules should then blah/blah/interfaces/modules
module.exports = async function (ctx: Context, _req: HttpRequest) {
    const message = 'Hello World!!!!';
    ctx.log.warn(hello);
    ctx.log.warn(message);
    ctx.res.status = 200;
    ctx.res.body = {
        message,
    };
};
