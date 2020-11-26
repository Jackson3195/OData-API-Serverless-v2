import { IResult, IRecordSet } from 'mssql';

// Hash SQL Hash lookup to result
const sqlToResult: Record<string, Partial<IResult<unknown>>> = {
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