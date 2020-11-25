const badSql: Record<string, Error> = {
    '3a604a512e9ce61d9567b845ac04337d': new Error('Cannot insert the value NULL into column \'landlord\', table \'playground.dbo.property\'; column does not allow nulls. INSERT fails.')
};

export default badSql;