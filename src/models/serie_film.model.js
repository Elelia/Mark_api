const dbConn = require('../../dbconfig');

async function getAllSeriefilm() {
    dbConn.connect();
  
    const query = `
        select 
        cat.id as cat_id,
        cat.nom as cat_nom,
		sf.id as id_serie_film,
        sf.*,
		f.id as id_film,
        f.*
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
        inner join
		film f
		on
		f.id_serie_film = sf.id
        group by
        cat.id,
        sf.id,
        f.id
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
  
    const query = `
        select cat.*
        from
        categorie cat
        inner join
        categorie_serie_film csf
        on
        cat.id = csf.id_categorie
        group by
        cat.id
        order by
        cat.id
    `;
  
    let result;
    try {
        result = await dbConn.query(query);
    } catch (err) {
        console.error(err);
    }
    //console.log(result.rows);
    return result.rows;
}

//pas utilisée pour l'instant
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

//pas utilisée pour l'instant
async function getAllSeriefilmByCategorie(id) {
    dbConn.connect();
  
    const query = `
        select 
        cat.id as cat_id,
        cat.nom as cat_nom,
        sf.*
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
        group by
        cat.id,
        sf.id
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

async function insertAvis(id_compte, id_serie_film, comment, note, date) {
    dbConn.connect();
  
    const query = `
        insert into
        avis
        (id_compte, id_serie_film, commentaire, note, jour)
        VALUES ($1, $2, $3, $4, $5)
    `;
  
    let result = false;
    try {
        await dbConn.query(query, [id_compte, id_serie_film, comment, note, date]);
        result = true;
    } catch (err) {
        console.error(err);
    }
    return result;
}

async function getAllAvis(id) {
    dbConn.connect();
  
    const query = `
        select
        avis.*
        from
        avis
        inner join
        serie_film sf
        on
        sf.id = avis.id_serie_film
        where
        sf.id = $1
    `;
  
    let result;
    try {
        result = await dbConn.query(query, [id]);
    } catch (err) {
        console.error(err);
    }
    return result.rows;
}

module.exports = {
  getAllSeriefilm,
  getIdCategorie,
  getAllCategorie,
  insertAvis,
  getAllAvis
};