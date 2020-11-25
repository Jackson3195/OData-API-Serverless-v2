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
    '599c39e7dc9669fa0e43606999be73eb': {
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
    '361941de31702b8057084a31b4dd9c07': {
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
    '30f31aef111008fa17baef3aa00e574a': {
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
    '1ccae16b644c1d4021795799830a9b6e': {
        recordset: [
            {
                'PropertyId': 2,
                'UserId': 1,
                'Data1': 'Some updated text'
            }
        ] as IRecordSet<unknown>
    }
};

export default sqlToResult;