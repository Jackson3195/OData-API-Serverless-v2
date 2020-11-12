import * as mssql from 'mssql';

// Mock ConnectionPool
const fakeConnect: jest.Mock = jest.fn((callback: (x: boolean) => void) => callback(false));
const fakeOn: jest.Mock = jest.fn((_name, callback: () => void) => callback());
export const fakeConnectionPool: jest.Mock = jest.fn(() => ({
    connect: fakeConnect,
    on: fakeOn,
}));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Override READONLY ConnectionPool Class for testing
mssql.ConnectionPool = fakeConnectionPool;

// Mock Prepared Statement
const fakePreparedStatementInput: jest.Mock = jest.fn();
const fakePreparedStatementPrepare: jest.Mock = jest.fn((_sql: string, callback: () => void) => callback());
const fakePreparedStatementExecute: jest.Mock = jest.fn((inputs: Record<string, any>, callback: (x: null, y: any) => void) => {
    const record: Record<string, any> = {
        'Id': 2,
        'Firstname': 'Jackson',
        'Surname': 'Jacob',
        'CreatedOn': '2020-11-12T21:31:15.000Z',
        'LastUpdatedOn': '2020-11-12T21:31:15.000Z',
        'LastUpdatedBy': 'API',
        'Obsolete': false,
        'ObsoletedOn': null,
        'ObsoletedBy': null
    };
    // Determine if post or patch
    if (inputs['userSurname'] === 'Spectre') {
        record['Surname'] = 'Spectre';
    }
    const data: Partial<mssql.IResult<Partial<Entity.User>>> = {
        recordset: [record] as mssql.IRecordSet<Partial<Entity.User>>
    };
    callback(null, data);
});

const fakePreparedStatementUnprepare: jest.Mock = jest.fn((callback: () => void) => callback());
let fakePreparedStatement: jest.Mock = jest.fn(() => ({
    input: fakePreparedStatementInput,
    prepare: fakePreparedStatementPrepare,
    execute: fakePreparedStatementExecute,
    unprepare: fakePreparedStatementUnprepare,
}));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Override READONLY PreparedStatement Class for testing
mssql.PreparedStatement = fakePreparedStatement;

import MSSqlGenerator from '@assets/generator/mssql';
MSSqlGenerator.prototype.GetSchema = jest.fn(() => ({
    'Users': {
        'Owner': 'dbo',
        'Tablename': 'user',
        'PrimaryKey': [
            'Id'
        ],
        'Attributes': {
            'Id': {
                'Type': 'Field',
                'Visible': 'External',
                'SQL': {
                    'Name': 'id',
                    'Type': 'int',
                    'Size': 4
                }
            },
            'Firstname': {
                'Type': 'Field',
                'Visible': 'External',
                'SQL': {
                    'Name': 'firstname',
                    'Type': 'varchar',
                    'Size': 100
                }
            },
            'Surname': {
                'Type': 'Field',
                'Visible': 'External',
                'SQL': {
                    'Name': 'surname',
                    'Type': 'varchar',
                    'Size': 100
                }
            },
            'CreatedOn': {
                'Type': 'Field',
                'Visible': 'Internal',
                'SQL': {
                    'Name': 'createdOn',
                    'Type': 'datetime',
                    'Size': 8
                }
            },
            'LastUpdatedOn': {
                'Type': 'Field',
                'Visible': 'Internal',
                'SQL': {
                    'Name': 'lastUpdatedOn',
                    'Type': 'datetime',
                    'Size': 8
                }
            },
            'LastUpdatedBy': {
                'Type': 'Field',
                'Visible': 'Internal',
                'SQL': {
                    'Name': 'lastUpdatedBy',
                    'Type': 'varchar',
                    'Size': 100
                }
            },
            'Obsolete': {
                'Type': 'Field',
                'Visible': 'External',
                'SQL': {
                    'Name': 'obsolete',
                    'Type': 'bit',
                    'Size': 1
                }
            },
            'ObsoletedOn': {
                'Type': 'Field',
                'Visible': 'Internal',
                'SQL': {
                    'Name': 'obsoletedOn',
                    'Type': 'datetime',
                    'Size': 8
                }
            },
            'ObsoletedBy': {
                'Type': 'Field',
                'Visible': 'Internal',
                'SQL': {
                    'Name': 'obsoletedBy',
                    'Type': 'varchar',
                    'Size': 100
                }
            },
            'Portfolio': {
                'Type': 'Reference',
                'Visible': 'External',
                'Navigation': {
                    'Context': 'Parent',
                    'ToEntity': 'Properties',
                    'ToField': 'LandlordId',
                    'FromField': 'Id',
                    'Bespoke': false
                }
            }
        }
    }
}));

import { GetFreshContext, MockContext } from '@testing/index';
import { Entity } from '@assets/schema/Interfaces';
import api from './index';


describe('API Functionality', () => {

    let ctx: MockContext;

    beforeEach(() => {
        ctx = GetFreshContext();
    });

    it.each`
        entity | input | output
        ${'Users'} | ${{Firstname: 'Jackson', Surname: 'Jacob'}} | ${{Firstname: 'Jackson', Surname: 'Jacob'}}
    `('Should create a entity', async ({entity, input, output}) => {
        ctx.req.method = 'POST';
        ctx.req.params['entity'] = entity;
        ctx.req.body = input;

        await api(ctx, ctx.req);

        expect(ctx.res.status).toBe(201);
        const body: Entity.User[] = ctx.res.body;
        expect(body.length).toBe(1);
        const user: Entity.User = body[0];
        expect(user.Firstname).toBe((output as Partial<Entity.User>).Firstname);
        expect(user.Surname).toBe((output as Partial<Entity.User>).Surname);
        expect(user.Id).toBeGreaterThan(0);
    });

    it.each`
        entity | id | input | output
        ${'Users'} | ${2} | ${{Surname: 'Spectre'}} | ${{Firstname: 'Jackson', Surname: 'Spectre'}}
    `('Should update a entity', async ({entity, id, input, output}) => {
        ctx.req.method = 'PATCH';
        ctx.req.params['entity'] = entity;
        ctx.req.params['id'] = id;
        ctx.req.body = input;

        await api(ctx, ctx.req);

        expect(ctx.res.status).toBe(200);
        const body: Entity.User[] = ctx.res.body;
        expect(body.length).toBe(1);
        const user: Entity.User = body[0];
        expect(user.Firstname).toBe((output as Partial<Entity.User>).Firstname);
        expect(user.Surname).toBe((output as Partial<Entity.User>).Surname);
        expect(user.Id).toBeGreaterThan(0);
    });

    it.each`
        entity | id | input | output
        ${'Users'} | ${2} | ${null} | ${null}
    `('Should delete a entity', async ({entity, id, input, output}) => {
        ctx.req.method = 'DELETE';
        ctx.req.params['entity'] = entity;
        ctx.req.params['id'] = id;
        ctx.req.body = input;

        await api(ctx, ctx.req);
        expect(ctx.res.status).toBe(204);
        expect(ctx.res.body).toBe(output);
    });
});