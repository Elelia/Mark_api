const dbConn = require('../../dbconfig');

async function getAllFilm() {
  
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

    try {
        const client = await dbConn.connect();
        //console.log('connected');

        const res = await client.query(query);
        //console.log('Query result:', res.rows);

        client.release();
        //console.log('disconnected');
        return res.rows;
    } catch (err) {
        console.error(err);
    }
}

async function getAllCategorieFilm() {
  
    const query = `
        select cat.*
        from
        categorie cat
        inner join
        categorie_serie_film csf
        on
        cat.id = csf.id_categorie
        inner join
		serie_film sf
		on
		csf.id_serie_film = sf.id
		inner join
		film
		on
		sf.id = film.id_serie_film
        group by
        cat.id
        order by
        cat.id
    `;
  
    let result;
    try {
        //on ouvre la connexion
        const client = await dbConn.connect();

        //on exécute la requête
        const res = await client.query(query);

        //on ferme la connexion
        client.release();
        return res.rows;
    } catch (err) {
        console.error(err);
    }
}

async function getIdCategorie() {
  
    const query = `SELECT id  FROM categorie`;
  
    let result;
    try {
        //on ouvre la connexion
        const client = await dbConn.connect();

        //on exécute la requête
        const res = await client.query(query);

        //on ferme la connexion
        client.release();
        return res.rows;
    } catch (err) {
        console.error(err);
    }
}

async function getAllSerie() {
  
    const query = `
        select 
        cat.id as cat_id,
        cat.nom as cat_nom,
        sf.id as id_serie_film,
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
        where
        sf.id not in (select id_serie_film from film)
        group by
        cat.id,
        sf.id
        order by
        cat.id
    `;
  
    let result;
    try {
        //on ouvre la connexion
        const client = await dbConn.connect();

        //on exécute la requête
        const res = await client.query(query);

        //on ferme la connexion
        client.release();
        return res.rows;
    } catch (err) {
        console.error(err);
    }
}

async function getAllCategorieSerie() {
  
    const query = `
        select cat.*
        from
        categorie cat
        inner join
        categorie_serie_film csf
        on
        cat.id = csf.id_categorie
        inner join
		serie_film sf
		on
		csf.id_serie_film = sf.id
		where
		sf.id not in (select id_serie_film from film)
        group by
        cat.id
        order by
        cat.id
    `;
  
    let result;
    try {
        //on ouvre la connexion
        const client = await dbConn.connect();

        //on exécute la requête
        const res = await client.query(query);

        //on ferme la connexion
        client.release();
        return res.rows;
    } catch (err) {
        console.error(err);
    }
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

async function insertAvis(id_compte, id_serie_film, comment, note) {
    dbConn.connect();
  
    const query = `
        insert into
        avis
        (id_compte, id_serie_film, commentaire, note, jour)
        VALUES ($1, $2, $3, $4, NOW())
    `;
  
    let result = false;
    try {
        //on ouvre la connexion
        const client = await dbConn.connect();

        //on exécute la requête
        await client.query(query, [id_compte, id_serie_film, comment, note]);

        //on ferme la connexion
        client.release();
        result = true;
        // await dbConn.query(query, [id_compte, id_serie_film, comment, note]);
        // result = true;
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
        //on ouvre la connexion
        const client = await dbConn.connect();

        //on exécute la requête
        const res = await client.query(query, [id]);

        //on ferme la connexion
        client.release();
        return res.rows;
    } catch (err) {
        console.error(err);
    }
    //return result.rows;
}

async function getUrlVideo(id) {
    dbConn.connect();

    const query = `
        select 
        url
        from 
        video
        where
        id = $1
    `;

    try {
        //on ouvre la connexion
        const client = await dbConn.connect();

        //on exécute la requête
        const res = await client.query(query, [id]);

        //on ferme la connexion
        client.release();
        return res.rows;
    } catch(err) {
        console.error(err);
    }
    //return result.rows;
}

//pas utilisée pour l'instant
async function getFilmByCategorieId(id) {
    dbConn.connect();
  
    const query = `
        select
        sf.id as id_serie_film,
        sf.nom,
        sf.resume,
        sf.age_min,
        cat.id as cat_id,
        cat.nom as cat_nom,
        f.date_sortie,
        sf.url_vignette,
        sf.url_affiche,
        trailer.url,
        trailer.id as id_bande_annonce,
        v.id as id_video
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
        inner join
        video trailer
        on
        sf.id_bande_annonce = trailer.id
        inner join
        video v
        on
        f.id_video = v.id
        where
        cat.id = $1
    `;
  
    let result;
    try {
        //on ouvre la connexion
        const client = await dbConn.connect();

        //on exécute la requête
        const res = await client.query(query, [id]);

        //on ferme la connexion
        client.release();
        return res.rows;
    } catch (err) {
        console.error(err);
    }
    //return result.rows;
}

module.exports = {
  getAllFilm,
  getIdCategorie,
  getAllCategorieFilm,
  insertAvis,
  getAllAvis,
  getUrlVideo,
  getAllCategorieSerie,
  getAllSerie,
  getFilmByCategorieId
};