const pg = require('pg');

const pool = new pg.Pool({
    user: 'lisa',
    host: 'fs405877-002.eu.clouddb.ovh.net',
    database: 'mark',
    password: '*******',
    port: 35274
});

const getVideos = (req, res) => {
    pool.query('SELECT * FROM video', (err, res) => {
        if(err) {
            throw err
        }
        console.log('Bravo !')
        // pool.end()
    })
}

module.exports = {
    getVideos
}
