const dbConn = require('../../dbconfig');
const axios = require('axios');
const utils = require('../utils/function');

//retrouve tous les films de la base de données
async function getAllFilm() {
  const query = `
    select 
    cat.id as cat_id,
    cat.nom as cat_nom,
	sf.id as id_serie_film,
    sf.*,
	f.id as id_film,
    f.*,
    trailer.url as trailer
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
    group by
    cat.id,
    sf.id,
    f.id,
    trailer.id
    order by
    cat.id
  `;

  try {
    const client = await dbConn.connect();

    const res = await client.query(query);

    client.release();
    return res.rows;
  } catch (err) {
    console.error(err);
  }
}

//retrouve toutes les catégories des films de la base de données
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

  try {
    const client = await dbConn.connect();

    const res = await client.query(query);

    client.release();
    return res.rows;
  } catch (err) {
    console.error(err);
  }
}

// pas utilisée pour l'instant
async function getFilmByCategorieId(id) {

  const query = `
    select
    sf.id as id_serie_film,
    sf.nom,
    sf.resume,
    sf.age_min,
    cat.id as cat_id,
    cat.nom as cat_nom,
    f.date_sortie,
    f.id as id_film,
    sf.url_vignette,
    sf.url_affiche,
    trailer.url as trailer,
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

//get movie with administration pannel à partir du fichier json
//beaucoup de données à charger alors la fonction n'est pas utilisée
async function getMovieTMDB(movieId, name_categorie) {
  try {
    const client = await dbConn.connect();
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
    client.release();

    return results;
    //console.log(`Inserted data for movies ${movieData.title} (${movieData.release_date})`);
  } catch (error) {
    //console.error(error);
  }
}

//retrouve 20 films de TMDB en fonction de l'id catégorie envoyé
async function getMovieCatTMDB(id_categorie) {
  try {
    const client = await dbConn.connect();
    const results = [];
    let page = Math.floor(Math.random() * 501);
    let id_cat = '';
    const query = 'select * from categorie where id = $1';
    const query2 = 'select nom from serie_film where nom = $1';

    const catResponse = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}&language=fr`);
    const listCategories = catResponse.data.genres;

    const res = await client.query(query,[id_categorie]);

    //récupère l'id catégorie de tmdb en fonction de l'id de la catégorie en base
    for(var i = 0; listCategories.length > i; i++) {
      //console.log(listCategories[i].id);
      if(listCategories[i].name ==  res.rows[0].nom) {
        id_cat = listCategories[i].id;
      }
    }

    // Retrieve movie data from TMDB
    let getResp = false;
    let response = null;
    while(!getResp) {
      response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=fr&include_adult=false&with_genres=${id_cat}&page=${page}`);
      if(response.data.results.length !== 0) {
        getResp = true;
      } else {
        page = Math.floor(Math.random() * 501);
      }
    }

    const movieList = response.data.results;

    for (const movie of movieList) {
      const resp = await client.query(query2,[movie.title]);
      if(!resp.rows[0]) {
        const data = {
          id: movie.id,
          title: movie.title,
          categorie: res.rows[0].nom,
          overview:  movie.overview,
          release_date: movie.release_date
        };
        results.push(data);
      }
    }
    client.release();

    return results;
  } catch (error) {
    console.error(error);
  }
}

//fonction qui affiche retrouve 20 films en fonction des préférences catégorie de l'utilisateur
async function getMovieByPref(id_user){
  const query = `
    select distinct
      sf.id as id_serie_film,
      sf.nom,
      sf.age_min,
      sf.resume,
      sf.id_bande_annonce,
      sf.url_vignette,
      sf.url_affiche,
      f.date_sortie,
      f.id_video,
      v.url,
      trailer.url,
      cat.id as cat_id,
      cat.nom as cat_nom
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
      preference_categorie pc
      on
      pc.id_categorie = cat.id
      inner join
      compte c
      on
      c.id = pc.id_compte
      inner join
      video v
      on
      f.id_video = v.id
      inner join
      video trailer
      on
      sf.id_bande_annonce = trailer.id
    where
      c.id = $1
    limit 20;
  `;

  try {
    const client = await dbConn.connect();

    const res = await client.query(query, [id_user]);

    client.release();
    return res.rows;
  } catch (err) {
    console.error(err);
  }
}

//permet de mettre à jour des films
async function updateMovie(id, nom, age_min, release, vignette, affiche, trailer) {
  const query = `
    UPDATE 
    serie_film
    SET 
    nom=$2, age_min=$3, url_vignette=$4, url_affiche=$5
    WHERE 
    id=$1
  `;
  const query2 = `
    UPDATE 
    film
    SET 
    date_sortie=$2
    WHERE 
    id_serie_film=$1
  `;
  const query3 = `
    UPDATE 
    video
    SET 
    url=$2
    WHERE id IN (
      SELECT id_video
      FROM film
      WHERE id_serie_film = $1
    )
  `;

  try {
    const client = await dbConn.connect();

    await client.query(query, [id, nom, age_min, vignette, affiche]);
    await client.query(query2, [id, release]);
    await client.query(query3, [id, trailer]);

    client.release();
    return true;
  } catch(err){
    console.error(err);
  }
}

//supprimer un film en base
async function deleteMovie(id, id_film) {
  const query = `
      delete from personne_serie_film where id_serie_film=$1
    `;
    const query2 = `
      delete from avis where id_serie_film=$1
    `;
    const query3 = `
      delete from personne_serie_film where id_serie_film=$1
    `;
    const query4 = `
      delete from visionnage where id_film=$1
    `;
    const query5 = `
      delete from categorie_serie_film where id_serie_film=$1
    `;
    const query6 = `
      delete from film where id=$1
    `;
    const query7 = `
      delete from video where id in (select id_video from film where id=$1)
    `;
    const query8 = `
      delete from serie_film where id=$1
    `;
  try {
    const client = await dbConn.connect();

    await client.query(query, [id]);
    await client.query(query2, [id]);
    await client.query(query3, [id]);
    await client.query(query4, [id_film]);
    await client.query(query5, [id]);
    await client.query(query6, [id_film]);
    await client.query(query7, [id_film]);
    await client.query(query8, [id]);

    client.release();
    return true;
  } catch(err) {
    console.log(err);
  }
}

//retrouve les 20 films les plus vus dans le mois
async function getMovieMostSeen(){
  const query = `
  select distinct on (f.id)
  cat.id as cat_id,
  cat.nom as cat_nom,
  sf.id as id_serie_film,
  sf.*,
  f.id as id_film,
  f.*,
  trailer.url as trailer
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
  visionnage v
  on
  v.id_film = f.id
  where
  f.id in (
    select
    f.id
    from
    visionnage v
    inner join
    film f
    on
    v.id_film = f.id
    group by
    v.id_film,
    f.id
    order by
    count(id_film) desc
  ) and
  EXTRACT(MONTH FROM v.jour) = EXTRACT(MONTH FROM CURRENT_DATE) and
  EXTRACT(YEAR FROM v.jour) = EXTRACT(YEAR FROM CURRENT_DATE)
  group by
  cat.id,
  sf.id,
  f.id,
  trailer.id
  limit 20
  `;

  try {
    const client = await dbConn.connect();

    const res = await client.query(query);

    client.release();
    return res.rows;
  } catch(err) {
    console.log(err);
  }
}

//retrouve les 20 films qui sont sortis les plus récemment
async function getLastMovie(){
  const query = `
    select * 
    from (
      select distinct on (f.id)
      cat.id as cat_id,
      cat.nom as cat_nom,
      sf.id as id_serie_film,
      sf.*,
      f.id as id_film,
      f.*,
      trailer.url as trailer
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
      group by
      cat.id,
      sf.id,
      f.id,
      trailer.id
      order by
      f.id, f.date_sortie desc
    ) sub
    order by date_sortie desc
    limit 20
  `;

  try {
    const client = await dbConn.connect();

    const res = await client.query(query);

    client.release();
    return res.rows;
  } catch(err) {
    console.log(err);
  }
}

//compte les catégories les plus vues
async function getMovieCountByCategorie(){
  const query = `
    select
    cat.nom as cat_nom,
    count(v.id)
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
    left join
    visionnage v
    on
    v.id_film = f.id
    group by
    cat.nom
  `;

  try {
    const client = await dbConn.connect();

    const res = await client.query(query);

    client.release();
    return res.rows;
  } catch(err) {
    console.log(err);
  }
}

//retrouve toutes les catégories de la base de données
async function getCountFilmByMonth(){
  const query = `
    select
    to_char(v.jour, 'Month') AS mois,
    count(v.id)
    from 
    visionnage v
    inner join
    film f
    on
    f.id = v.id_film
    left join
    serie_film sf
    on
    sf.id = f.id
    GROUP BY
    to_char(v.jour, 'Month')
    ORDER BY
    mois
  `;

  try {
    const client = await dbConn.connect();

    const res = await client.query(query);

    client.release();
    return res.rows;
  } catch(err) {
    console.log(err);
  }
}

module.exports = {
  getAllFilm,
  getAllCategorieFilm,
  getFilmByCategorieId,
  getMovieTMDB,
  getMovieCatTMDB,
  getMovieByPref,
  updateMovie,
  deleteMovie,
  getMovieMostSeen,
  getLastMovie,
  getMovieCountByCategorie,
  getCountFilmByMonth
};
