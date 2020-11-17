import { Primitives } from '@assets/interfaces';
import { Context, HttpMethod } from '@azure/functions';
import { IResult } from 'mssql';
import MSSqlGenerator from '@assets/generator/mssql';
import MSSqlConnection from '@assets/connections/mssql';

export default class Generic {
    // Class variables
    private ctx: Context;
    private method: HttpMethod;
    private pageSize = 100;

    private entity: string;
    private entityId: string;
    private entityData: Record<string, Primitives>;

    private sqlGenerator: MSSqlGenerator;
    private sqlDb: MSSqlConnection;

    // Constructor
    constructor (ctx: Context, entity: string, entityId: string, entityData: Record<string, Primitives>) {
        this.ctx = ctx;
        this.method = this.ctx.req.method;

        this.entity = entity;
        this.entityId = entityId;
        this.entityData = entityData;

        this.sqlDb = new MSSqlConnection(this.ctx);
        this.sqlGenerator = new MSSqlGenerator(this.ctx, this.sqlDb);
    }

    public async HandleRequest (): Promise<void> {
        // Overrideable actions to do before the entity is saved
        if (this.method !== 'GET') {
            this.BeforeEntitySaved();
        }

        // Determine which action to take
        switch (this.method) {
            case 'GET':
                // TODO: Support;
                break;
            case 'POST':
                this.HandleResponse(201, await this.sqlGenerator.GenerateAndExecute('INSERT', this.entity, null, this.entityData));
                break;
            case 'PATCH':
                this.HandleResponse(200, await this.sqlGenerator.GenerateAndExecute('UPDATE', this.entity, this.entityId, this.entityData));
                break;
            case 'DELETE':
                this.HandleResponse(204, await this.sqlGenerator.GenerateAndExecute('DELETE', this.entity, this.entityId, this.entityData));
                break;
        }

        // Overrideable actions to do after the entity is saved
        if (this.method !== 'GET') {
            this.AfterEntitySaved();
        }
    }

    protected BeforeEntitySaved (): void {
        return;
    }

    protected AfterEntitySaved (): void {
        return;
    }

    private HandleResponse (code: number, data: IResult<unknown>) {
        this.ctx.res = {
            status: code,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Pag-Page': 1,
                'X-Pag-PageSize': this.pageSize,
                'X-Pag-HasNextPage': (data && data.recordset && data.recordset.length > this.pageSize),
            },
            body: code !== 204 ? data.recordset : null,
        };
    }
}