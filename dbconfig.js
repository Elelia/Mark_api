const pg = require('pg');

const pool = new pg.Pool({
    user: 'lisa',
    host: '*********',
    database: '*********',
    password: '********',
    port: 35274
});

module.exports = pool;
