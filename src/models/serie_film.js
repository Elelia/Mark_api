const dbConn = require('../../dbconfig');

async function getAllSeriefilm() {
    dbConn.connect();
  
    const query = `
        select 
        cat.id as cat_id,
        cat.nom as cat_nom,
        sf.*,
        image.url
        from 
        categorie cat
        inner join
        categorie_serie_film csf
        on
        cat.id = csf.id_categorie
        inner join
        serie_film sf
        on
        sf.id = csf.id_serie_film
        left join 
        image 
        on 
        sf.id = image.id_serie_film
        group by
        cat.id,
        sf.id,
        image.id
        order by
        cat.id
    `;
  
    let result;
    try {
        result = await dbConn.query(query);
    } catch (err) {
        console.error(err);
    }
    return result.rows;
}

async function getAllCategorie() {
    dbConn.connect();
  
    const query = `select cat.*
    from
    categorie cat
    inner join
    categorie_serie_film csf
    on
    cat.id = csf.id_categorie
    group by
    cat.id
    order by
    cat.id`;
  
    let result;
    try {
        result = await dbConn.query(query);
    } catch (err) {
        console.error(err);
    }
    //console.log(result.rows);
    return result.rows;
}

async function getIdCategorie() {
    dbConn.connect();
  
    const query = `SELECT id  FROM categorie`;
  
    let result;
    try {
        result = await dbConn.query(query);
    } catch (err) {
        console.error(err);
    }
    //console.log(result.rows);
    return result.rows;
}

async function getAllSeriefilmByCategorie(id) {
    dbConn.connect();
  
    const query = `
        select 
        cat.id as cat_id,
        cat.nom as cat_nom,
        sf.*,
        image.url
        from 
        categorie cat
        inner join
        categorie_serie_film csf
        on
        cat.id = csf.id_categorie
        inner join
        serie_film sf
        on
        sf.id = csf.id_serie_film
        left join 
        image 
        on 
        sf.id = image.id_serie_film
        group by
        cat.id,
        sf.id,
        image.id
        order by
        cat.id
    `;
  
    let result;
    try {
        result = await dbConn.query(query, [id]);
    } catch (err) {
        console.error(err);
    }
    //console.log(result.rows);
    return result.rows;
}

module.exports = {
  getAllSeriefilm,
  getIdCategorie,
  getAllSeriefilmByCategorie,
  getAllCategorie
};

// var dbConn = require('../../dbconfig');

// exports.getAllSeriefilm = (response) => {
//     dbConn.query('SELECT * FROM serie_film', (err, res) => {
//       if (err) {
//         throw err
//       } if(Array.isArray(res.rows) && res.rows.length === 0) {
//         dbConn.end(function() {
//           throw new Error('No results found');
//         })
//       }
//       else {
//         console.log('Get all series films is a success !');
//         response(res.rows);
//       }
//     })
// }