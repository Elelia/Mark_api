const pg = require('pg');

const pool = new pg.Pool({
    user: 'lisa',
    host: 'fs405877-002.eu.clouddb.ovh.net',
    database: 'mark',
    password: 'pinG07unF',
    port: 35274
});

module.exports = pool;
