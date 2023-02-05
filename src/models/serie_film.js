var dbConn = require('../../dbconfig');

exports.getAllSeriefilm = (response) => {
    dbConn.query('SELECT * FROM serie_film', (err, res) => {
      if (err) {
        throw err
      } if(Array.isArray(res.rows) && res.rows.length === 0) {
        dbConn.end(function() {
          throw new Error('No results found');
        })
      }
      else {
        console.log('Get all series films is a success !');
        response(res.rows);
      }
    })
}