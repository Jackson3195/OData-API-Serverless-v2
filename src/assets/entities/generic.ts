import { Primitives } from '@assets/interfaces';
import { Context, HttpMethod } from '@azure/functions';
import { IResult } from 'mssql';
import MSSqlGenerator from '@assets/generator/mssql';
import MSSqlConnection from '@assets/connections/mssql';

interface EntityResponse {
    code: number;
    results: IResult<unknown>;
}

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

    public async HandleRequest (): Promise<EntityResponse> {
        // Overrideable actions to do before the entity is saved
        if (this.method !== 'GET') {
            this.BeforeEntitySaved();
        }

        // Initialise response payload
        const response: EntityResponse = {
            code: null,
            results: null
        };

        // Determine which action to take
        switch (this.method) {
            case 'GET':
                // TODO: Support;
                break;
            case 'POST':
                this.HandleResponse(201, await this.sqlGenerator.GenerateAndExecute('INSERT', this.entity, null, this.entityData));
                break;
            case 'PATCH':
                // TODO: Support
                this.ctx.log.warn(this.entityId);
                break;
            case 'DELETE':
                // TODO: Support
                break;
            default:
                // TODO: Handle
                // HandleError(this.ctx, [new Error('Unknown method provided to entity Generic')], this.entityData)
                break;
        }

        // Overrideable actions to do after the entity is saved
        if (this.method !== 'GET') {
            this.AfterEntitySaved();
        }

        return response;
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
                'X-Pag-HasNextPage': (data && data.recordset) ? (data.recordset.length > this.pageSize) : null,
            },
            body: code !== 204 ? (data ? data.recordset : null) : null,
        };
    }
}