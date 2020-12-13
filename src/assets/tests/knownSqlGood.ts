import { IResult, IRecordSet } from 'mssql';

// Hash SQL Hash lookup to result
const sqlToResult: Record<string, Partial<IResult<unknown>>> = {
    // Order by fields
    '43584fe83b3d1e9795a1fa786265b48e': {
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
    '95eec111866f1c7f42dee455320df549': {
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
    '27a9cc3e16ee93b973b25e194a8b0b1c': {
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
    'e2e40d15f0f50b682e9e2d7c645d7f16': {
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
    'b8db4154112216d71dd3ba7022e9cb94': {
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
    'aaee66c703452d161085371207ac3367': {
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
    '1b5f44c9042aaf7c5939f0f47ef59a3c': {
        recordset: [
            {
                'PropertyId': 1,
                'UserId': 2,
                'Data1': 'LOL'
            }
        ] as IRecordSet<unknown>
    },
    // Select all user
    'ef9932a20f730d57b5f35024e359e3e7': {
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
    '7167f8920b6f1d62b7c1ddf934ba199e': {
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