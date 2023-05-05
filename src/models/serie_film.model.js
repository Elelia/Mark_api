const dbConn = require('../../dbconfig');
const axios = require('axios');
const utils = require('../utils/function');

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
    // console.log('connected');

    const res = await client.query(query);
    // console.log('Query result:', res.rows);

    client.release();
    // console.log('disconnected');
    return res.rows;
  } catch (err) {
    console.error(err);
  }
}

async function getAllCategorieFilm() {
  const query = `
    select
    cat.*
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
    // on ouvre la connexion
    const client = await dbConn.connect();

    // on exécute la requête
    const res = await client.query(query);

    // on ferme la connexion
    client.release();
    return res.rows;
  } catch (err) {
    console.error(err);
  }
}

async function getIdCategorie() {
  const query = 'SELECT id  FROM categorie';

  let result;
  try {
    // on ouvre la connexion
    const client = await dbConn.connect();

    // on exécute la requête
    const res = await client.query(query);

    // on ferme la connexion
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

  try {
    // on ouvre la connexion
    const client = await dbConn.connect();

    // on exécute la requête
    const res = await client.query(query);

    // on ferme la connexion
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
    // on ouvre la connexion
    const client = await dbConn.connect();

    // on exécute la requête
    const res = await client.query(query);

    // on ferme la connexion
    client.release();
    return res.rows;
  } catch (err) {
    console.error(err);
  }
}

// pas utilisée pour l'instant
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
  // console.log(result.rows);
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
    // on ouvre la connexion
    const client = await dbConn.connect();

    // on exécute la requête
    await client.query(query, [id_compte, id_serie_film, comment, note]);

    // on ferme la connexion
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
    // on ouvre la connexion
    const client = await dbConn.connect();

    // on exécute la requête
    const res = await client.query(query, [id]);

    // on ferme la connexion
    client.release();
    return res.rows;
  } catch (err) {
    console.error(err);
  }
  // return result.rows;
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
    // on ouvre la connexion
    const client = await dbConn.connect();

    // on exécute la requête
    const res = await client.query(query, [id]);

    // on ferme la connexion
    client.release();
    return res.rows;
  } catch (err) {
    console.error(err);
  }
  // return result.rows;
}

// pas utilisée pour l'instant
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
    // on ouvre la connexion
    const client = await dbConn.connect();

    // on exécute la requête
    const res = await client.query(query, [id]);

    // on ferme la connexion
    client.release();
    return res.rows;
  } catch (err) {
    console.error(err);
  }
  // return result.rows;
}

//get movie with administration pannel
async function getMovieTMDB(movieId, name_categorie) {
  try {
    const results = [];
    const query = 'select * from categorie where id = $1';

    // Retrieve movie data from TMDB
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}&language=fr`);
    const movieData = response.data;
    const listCategories = response.data.genres;

    const categories = listCategories.map((categorie) => categorie.name);
    const res = await dbConn.query(query,[name_categorie]);

    for(const categorie of categories) {
      catId = utils.TradCat(categorie);
      if(catId != '') {
        if(res.rows[0].id === catId) {
          results.push(movieData.title, res.rows[0].nom, movieData.overview, movieData.release_date);
        }
      }
      results.push(movieData.title, res.rows[0].nom, movieData.overview, movieData.release_date);
    }

    return results;
    //console.log(`Inserted data for movies ${movieData.title} (${movieData.release_date})`);
  } catch (error) {
    //console.error(error);
  }
}

//retrouve 20 films de TMDB en fonction de l'id catégorie envoyé
async function getMovieCatTMDB(id_categorie) {
  try {
    const results = [];
    let id_cat = '';
    const query = 'select * from categorie where id = $1';

    const catResponse = await axios.get(`https://api.themoviedb.org/3//genre/movie/list?api_key=${process.env.API_KEY}&language=fr`);
    const listCategories = catResponse.data.genres;

    const res = await dbConn.query(query,[id_categorie]);

    //récupère l'id catégorie de tmdb en fonction de l'id de la catégorie en base
    for(var i = 0; listCategories.length > i; i++) {
      //console.log(listCategories[i].id);
      if(listCategories[i].name ==  res.rows[0].nom) {
        id_cat = listCategories[i].id;
      }
    }

    console.log(id_cat);

    // Retrieve movie data from TMDB
    const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=fr&include_adult=false&with_genres=${id_cat}`);
    const movieList = response.data.results;

    for (const movie of movieList) {
      const data = {
        id: movie.id,
        title: movie.title,
        categorie: res.rows[0].nom,
        overview:  movie.overview,
        release_date: movie.release_date
      };
      results.push(data);
    }

    return results;
  } catch (error) {
    console.error(error);
  }
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
  getFilmByCategorieId,
  getMovieTMDB,
  getMovieCatTMDB
};
