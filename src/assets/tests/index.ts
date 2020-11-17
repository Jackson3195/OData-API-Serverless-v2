import MSSqlConnection, { QueryDBVariable } from '@assets/connections/mssql';
import { Schema } from '@assets/interfaces/schema';
import { Context, Logger } from '@azure/functions';

export interface MockContext extends Context {
    done: Context['done'] & jest.Mock;
}

// Get a blank instance of an azure functions context for testing
export function GetFreshContext (): MockContext {
    return {
        invocationId: '',
        executionContext: {
            invocationId: '',
            functionName: '',
            functionDirectory: '',
        },
        bindings: {},
        bindingData: {},
        bindingDefinitions: [],
        req: {
            method: 'GET', /* Defaults to Get */
            url: '',
            headers: {
                authorization: 'Bearer Token'
            },
            query: {},
            params: {
                entity: 'Users',
                id: '3',
            },
            body: null,
        },
        res: {
            status: 200, /* Defaults to 200 */
            body: '',
        } as Record<string, any>,
        done: jest.fn(function done () {
            return Promise.resolve({
                res: (this as Context).res,
                bindings: (this as Context).bindings,
            });
        }) as Context['done'] & jest.Mock,
        log: {
            error: jest.fn(),
            warn: jest.fn(),
            info: jest.fn(),
            verbose: jest.fn()
        } as unknown as Logger,
        traceContext: {
            traceparent: '',
            tracestate: '',
            attributes: {}
        }
    };
}

// Get the SQL and Variables data of the mocked MSSqlConnection class
export function GetSQLData (mocked: jest.Mock<typeof MSSqlConnection, any>): { sql: string; variables: QueryDBVariable[] } {
    const executeMock = (mocked.mock.results[0].value as { Execute: jest.Mock}).Execute;
    const firstCall: any[] = executeMock.mock.calls[0];
    const result: { sql: string; variables: QueryDBVariable[] } = {
        sql: firstCall[0] as string,
        variables: firstCall[1] as QueryDBVariable[],
    };
    return result;
}

export function GetSchema (entity: string): Schema {
    if (entity === 'Users') {
        return {
            'Users': {
                'Core': true,
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
                    }
                }
            }
        };
    } else if (entity === 'Properties') {
        return {
            'Properties': {
                'Core': true,
                'Owner': 'dbo',
                'Tablename': 'property',
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
                    'LandlordId': {
                        'Type': 'Field',
                        'Visible': 'External',
                        'SQL': {
                            'Name': 'landlord',
                            'Type': 'int',
                            'Size': 4
                        }
                    },
                    'AddressLine1': {
                        'Type': 'Field',
                        'Visible': 'External',
                        'SQL': {
                            'Name': 'addressline1',
                            'Type': 'varchar',
                            'Size': 100
                        }
                    },
                    'City': {
                        'Type': 'Field',
                        'Visible': 'External',
                        'SQL': {
                            'Name': 'city',
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
                    'Landlord': {
                        'Type': 'Reference',
                        'Visible': 'External',
                        'Navigation': {
                            'Context': 'Child',
                            'ToEntity': 'Users',
                            'ToField': 'Id',
                            'FromField': 'LandlordId',
                            'Bespoke': false
                        }
                    }
                }
            }
        };
    } else if (entity === 'PropertyUsers') {
        return {
            'PropertyUsers': {
                'Owner': 'dbo',
                'Core': true,
                'Tablename': 'property_user',
                'PrimaryKey': [
                    'PropertyId',
                    'UserId'
                ],
                'Attributes': {
                    'PropertyId': {
                        'Type': 'Field',
                        'Visible': 'External',
                        'SQL': {
                            'Name': 'propertyId',
                            'Type': 'int',
                            'Size': 4
                        }
                    },
                    'UserId': {
                        'Type': 'Field',
                        'Visible': 'External',
                        'SQL': {
                            'Name': 'userId',
                            'Type': 'int',
                            'Size': 4
                        }
                    },
                    'Data1': {
                        'Type': 'Field',
                        'Visible': 'External',
                        'SQL': {
                            'Name': 'data1',
                            'Type': 'varchar',
                            'Size': 100
                        }
                    }
                }
            }
        };
    }else {
        throw new Error(`Unknown Entity - ${entity}`);
    }
}