import * as fs from 'fs';

const mockedFileSystem: typeof fs = jest.createMockFromModule('fs');

mockedFileSystem.existsSync = (file: string) =>  {
    return file.indexOf('Random.json') > -1 ? false : true;
};

(mockedFileSystem.readFileSync as unknown) = function (file: fs.PathLike | number): string | Buffer {
    let result: unknown;
    switch (file) {
        case '/Users.json':
            result = getUserEntity();
            break;
        case '/PropertyUsers.json':
            result = getPropertyUsers();
            break;
        case '/UsersBroken.json':
            result = getUsersBroken();
            break;
        case '/Properties.json':
            result = getProperties();
            break;
        case '/Users2.json':
            result = getUsers2();
            break;
        default:
            console.log(file);
            result = null;
            break;
    }
    return JSON.stringify(result);
};

module.exports= mockedFileSystem;


// **************** Mocked Entities ****************
const getUserEntity = () => (
    {
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
    }
);

const getPropertyUsers = () => (
    {
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
    }
);

const getUsersBroken = () => ({
    'UsersBroken': {
        'Core': true,
        'Owner': 'dbo',
        'Tablename': 'user',
        'PrimaryKey': ['Id'],
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
                    'Type': 'unknown',
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
});

const getProperties = () => ({
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
});

const getUsers2 = () => ({
    'Users2': {
        'Owner': 'dbo',
        'Tablename': 'user',
        'Core': true,
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
            'Data1': {
                'Type': 'Field',
                'Visible': 'External',
                'SQL': {
                    'Name': 'number',
                    'Type': 'int',
                    'Size': 4
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
});