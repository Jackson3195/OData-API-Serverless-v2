import { IResult, IRecordSet } from 'mssql';

// Hash SQL Hash lookup to result
const sqlToResult: Record<string, Partial<IResult<unknown>>> = {
    // Order by fields
    '5dad94794e03e552e494db1457a418ec': {
        recordset: [
            {
                'Id': 1,
                'Firstname': 'Jackson',
                'Surname': 'Jacob',
                'CreatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            },
            {
                'Id': 2,
                'Firstname': 'Jeff',
                'Surname': 'Jacob',
                'CreatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            }
        ] as IRecordSet<unknown>
    },
    // Top fields
    '99b81c7014d1b4bd4a602a4062a02e02': {
        recordset: [
            {
                'Id': 1,
                'Firstname': 'Jackson',
                'Surname': 'Jacob',
                'CreatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            },
            {
                'Id': 2,
                'Firstname': 'Jeff',
                'Surname': 'Jacob',
                'CreatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            }
        ] as IRecordSet<unknown>
    },
    // Select fields
    'dd98cfd65ce594cba76c7427bee93289': {
        recordset: [
            {
                'Id': 1,
                'Firstname': 'Jackson',
                'Surname': 'Jacob',
                'CreatedOn': '2020-11-14T19:54:04.000Z'
            },
        ] as IRecordSet<unknown>
    },
    // Select to get is not null
    '50c970d424836966014b288bc1586bef': {
        recordset: [
            {
                'Id': 1,
                'Firstname': 'Jackson',
                'Surname': 'Jacob',
                'CreatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            },
        ] as IRecordSet<unknown>
    },
    // Select to get that nulls work
    '942a4d74c2589338f6bb5185a537aee1': {
        recordset: [
            {
                'Id': 1,
                'Firstname': 'Jackson',
                'Surname': null,
                'CreatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            },
        ] as IRecordSet<unknown>
    },
    // Select users with multiple filters
    '20e036d10825e32eaedd5c8bcfeca8d6': {
        recordset: [
            {
                'Id': 1,
                'Firstname': 'Jackson',
                'Surname': 'Jacob',
                'CreatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            },
            {
                'Id': 2,
                'Firstname': 'Jeff',
                'Surname': 'Jacob',
                'CreatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            }
        ] as IRecordSet<unknown>
    },
    // Select a composite entity
    '6d5b9f2918c244a3b7d534265904ca6f': {
        recordset: [
            {
                'PropertyId': 1,
                'UserId': 2,
                'Data1': 'LOL'
            }
        ] as IRecordSet<unknown>
    },
    // Select all user
    '58f27480bca944c48f211eab60982e41': {
        recordset: [
            {
                'Id': 1,
                'Firstname': 'Jackson',
                'Surname': 'Jacob',
                'CreatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            },
            {
                'Id': 2,
                'Firstname': 'Jeff',
                'Surname': 'Jacob',
                'CreatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            },
            {
                'Id': 3,
                'Firstname': 'Ferly',
                'Surname': 'Jacob',
                'CreatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            },
            {
                'Id': 4,
                'Firstname': 'Jacqueline',
                'Surname': 'Jacob',
                'CreatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            }
        ] as IRecordSet<unknown>
    },
    // Get single user with Id
    '93a5ada4cb2455162f63bd265cb81f9f': {
        recordset: [
            {
                'Id': 2,
                'Firstname': 'Jeff',
                'Surname': 'Jacob',
                'CreatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            }
        ] as IRecordSet<unknown>
    },
    // Insert user test
    'de399dae44d6263c0296f535fd32bec5': {
        recordset: [
            {
                'Id': 1,
                'Firstname': 'Jackson',
                'Surname': 'Jacob',
                'CreatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            }
        ] as IRecordSet<unknown>
    },
    // Update user test
    '149bd6ecbb870864807806d8fea3bb20': {
        recordset: [
            {
                'Id': 1,
                'Firstname': 'Donde',
                'Surname': 'Spectre',
                'CreatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedOn': '2020-11-15T20:20:12.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            }
        ] as IRecordSet<unknown>
    },
    // Obsolete user test
    '11352e8611e0e5e961d97c6f81d59176': {
        recordset: [
            {
                'Id': 1,
                'Firstname': 'Jackson',
                'Surname': 'Jacob',
                'CreatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedOn': '2020-11-15T20:20:12.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': true,
                'ObsoletedOn': '2020-11-15T20:20:12.000Z',
                'ObsoletedBy': 'API'
            }
        ] as IRecordSet<unknown>
    },
    'bd646b7ac450e4a7849523c5a0f86def': {
        recordset: [
            {
                'Id': 1,
                'Firstname': 'Jackson',
                'Surname': 'Jacob',
                'CreatedOn': '2020-11-14T19:54:04.000Z',
                'LastUpdatedOn': '2020-11-15T20:20:12.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            }
        ] as IRecordSet<unknown>
    },
    '22305c7ee0a0811e2b3abe4542083d33': {
        recordset: [
            {
                'PropertyId': 2,
                'UserId': 1,
                'Data1': 'Some updated text'
            }
        ] as IRecordSet<unknown>
    },
    '6cd67208f1330691e17bf11bab2cfee9': {
        recordset: [
            {
                'Id': 3,
                'Firstname': 'Jackson',
                'Surname': 'Spectre',
                'Data1': 2147483640,
                'CreatedOn': '2020-11-23T19:53:55.000Z',
                'LastUpdatedOn': '2020-11-25T22:59:39.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            }
        ] as IRecordSet<unknown>
    },
    '46263bfd597f5b23fbee08b58b173e7d': {
        recordset: [
            {
                'Id': 3,
                'Firstname': 'Jackson',
                'Surname': 'Spectre',
                'Data1': -2147483639,
                'CreatedOn': '2020-11-23T19:53:55.000Z',
                'LastUpdatedOn': '2020-11-25T22:59:39.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            }
        ] as IRecordSet<unknown>
    },
    '7fa3c3c38435af09b316dcbeb31ba26a': {
        recordset: [
            {
                'Id': 3,
                'Firstname': 'Jackson',
                'Surname': 'Spectre',
                'Data1': 31,
                'CreatedOn': '2020-11-23T19:53:55.000Z',
                'LastUpdatedOn': '2020-11-25T22:59:39.000Z',
                'LastUpdatedBy': 'API',
                'Obsolete': false,
                'ObsoletedOn': null,
                'ObsoletedBy': null
            }
        ] as IRecordSet<unknown>
    }
};

export default sqlToResult;