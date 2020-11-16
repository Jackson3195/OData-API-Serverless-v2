import * as mssql from 'mssql';

// Hash SQL Hash lookup to result
const sqlToResult: Record<string, Partial<mssql.IResult<unknown>>> = {
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
        ] as mssql.IRecordSet<unknown>
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
        ] as mssql.IRecordSet<unknown>
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
        ] as mssql.IRecordSet<unknown>
    }
};

export default sqlToResult;