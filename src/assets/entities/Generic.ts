import { Primitives } from '@assets/interfaces';
import { HandleError } from '@assets/mixins';
import { Context, HttpMethod } from '@azure/functions';

export default class Generic {
    // Class variables
    private ctx: Context;
    private method: HttpMethod;
    private pageSize = 100;

    private entity: string;
    private entityId: string;
    private entityData: Record<string, Primitives>;

    // Constructor
    constructor (ctx: Context, entity: string, entityId: string, entityData: Record<string, Primitives>) {
        this.ctx = ctx;
        this.method = this.ctx.req.method;
        this.entity = entity;
        this.entityId = entityId;
        this.entityData = entityData;
    }

    public async HandleRequest (): Promise<void> {
        this.ctx.log.warn(this.entity);
        this.ctx.log.warn(this.entityId);
        // TODO: Get the entity information here...
        this.GetEntityInformation();

        // Overrideable actions to do before the entity is saved
        this.BeforeEntitySaved();

        // Determine which action to take
        switch (this.method) {
            case 'GET':
                // await this.GetEntity(this.entity, this.entityId, this.entityData);
                this.ctx.log.warn('TODO: Generic - GET');
                break;
            case 'POST':
                await this.CreateEntity();
                break;
            case 'PATCH':
                // await this.UpdateEntity(this.entity, this.entityId, this.entityData);
                this.ctx.log.warn('TODO: Generic - PATCH');
                throw new Error('TODO: Generic - PATCH');
                break;
            case 'DELETE':
                // await this.DeleteEntity(this.entity, this.entityId, this.entityData);
                this.ctx.log.warn('TODO: Generic - DELETE');
                throw new Error('TODO: Generic - DELETE');
                break;
            default:
                HandleError(this.ctx, [new Error('Unknown method provided to entity Generic')], this.entityData);
                break;
        }

        // Overrideable actions to do after the entity is saved
        this.AfterEntitySaved();
    }

    protected BeforeEntitySaved (): void {
        return;
    }

    protected AfterEntitySaved (): void {
        return;
    }

    private HandleResponse (code: number, data: unknown) {
        this.ctx.log(data);
        this.ctx.res = {
            status: code,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Pag-Page': 1,
                'X-Pag-PageSize': this.pageSize,
                // 'X-Pag-HasNextPage': (data && data.recordset) ? (data.recordset.length > pageSize) : null,
            },
            // body: data ? data.recordset : null,
        };
    }

    private async CreateEntity (): Promise<void> {
        this.HandleResponse(200, 'Hello');
        return;
    }

    private GetEntityInformation () {
        return;
    }
}