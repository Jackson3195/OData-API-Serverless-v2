import { Context, HttpRequest, AzureFunction } from '@azure/functions';
import MSSqlConnection from '@assets/connection/mssql';

const api: AzureFunction = async function (ctx: Context, req: HttpRequest) {
    // Connect to database
    const db = new MSSqlConnection(ctx);
    await db.execute('SELECT * FROM dbo.[user]', []);
    // Determine if method allowed
    ctx.res.status = 201;
    ctx.res.body = req.body;
};

export default api;
