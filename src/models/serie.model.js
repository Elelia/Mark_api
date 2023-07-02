const dbConn = require('../../dbconfig');
const axios = require('axios');
const utils = require('../utils/function');

//retrouve toutes les séries de la base de données
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
    const client = await dbConn.connect();

    const res = await client.query(query);

    client.release();
    return res.rows;
  } catch (err) {
    console.error(err);
  }
}

async function getSaisonByIdSerie(id) {
  const query = `
    select
    s.*
    from
    saison s
    inner join
    serie_film sf
    on
    s.id_serie_film = sf.id
    where
    sf.id = $1
  `;

  try {
    const client = await dbConn.connect();

    const res = await client.query(query, [id]);

    client.release();
    return res.rows;
  } catch (err) {
    console.error(err);
  }
}

async function getEpisodeBySaison(id) {
  const query = `
    select
    e.*,
    v.url
    from
    episode e
    inner join
    saison s
    on
    e.id_saison = s.id
    inner join
    video v
    on
    e.id_video = v.id
    where
    s.id = $1
  `;

  try {
    const client = await dbConn.connect();

    const res = await client.query(query, [id]);

    client.release();
    return res.rows;
  } catch (err) {
    console.error(err);
  }
}

//retrouve toutes les catégories des films de la base de données
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

//retrouve 20 séries de TMDB en fonction de l'id catégorie envoyé
async function getSerieCatTMDB(id_categorie) {
  try {
    const client = await dbConn.connect();
    const results = [];
    let page = Math.floor(Math.random() * 501);
    let id_cat = '';
    const query = 'select * from categorie where id = $1';
    const query2 = 'select nom from serie_film where nom = $1';

    const catResponse = await axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.API_KEY}&language=fr`);
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
    //boucle pour être sûr de tomber sur des résultats
    let getResp = false;
    let response = null;
    while(!getResp) {
      response = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${process.env.API_KEY}&language=fr&include_adult=false&with_genres=${id_cat}&page=${page}`);
      if(response.data.results.length !== 0) {
        getResp = true;
      } else {
        page = Math.floor(Math.random() * 501);
      }
    }
    const serieList = response.data.results;

    for (const serie of serieList) {
      const resp = await client.query(query2,[serie.name]);
      if(!resp.rows[0]) {
        const data = {
          id: serie.id,
          title: serie.name,
          categorie: res.rows[0].nom,
          overview:  serie.overview,
          release_date: serie.first_air_date
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

//ajotue une série en base de données
async function insertSerie(id_serie) {
  try {
    const client = await dbConn.connect();

    // liste des query
    const query1 = 'INSERT INTO serie_film (nom, resume, id_bande_annonce, url_vignette, url_vignette_mini, url_affiche) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
    const query2 = 'INSERT INTO saison (nom, id_serie_film, date_sortie, date_mise_en_ligne) VALUES ($1, $2, $3, $4) RETURNING id';
    const query3 = 'select id from categorie where nom = $1';
    const query4 = 'insert into categorie_serie_film (id_categorie, id_serie_film) VALUES ($1, $2)';
    const query5 = 'insert into video (url, duree) VALUES ($1, $2) RETURNING id';
    const query6 = 'insert into personne (nom, prenom) VALUES ($1, $2) RETURNING id';
    const query7 = 'insert into personne_serie_film (id_personne, id_serie_film, status) VALUES ($1, $2, $3)';
    const query8 = 'select id, nom, prenom from personne where nom = $1 and prenom = $2';
    const query9 = 'select nom from serie_film where nom = $1';
    const query10 = 'insert into episode (nom, resume, id_saison, id_video) values ($1, $2, $3, $4)';

    //retrieve serie from TMDB
    const response = await axios.get(`https://api.themoviedb.org/3/tv/${id_serie}?api_key=${process.env.API_KEY}&language=fr`);
    const serie = response.data;
    const listCategories = response.data.genres;
    const resp = await client.query(
      query9,
      [serie.name],
    );
    if (!resp.rows[0]) {
      // retrieve video data from TMDB
      const video = await axios.get(`https://api.themoviedb.org/3/tv/${id_serie}/videos?api_key=${process.env.API_KEY}&language=fr`);
      let trailerUrl = 'https://www.youtube.com/watch?v=';
      const videoTable = video.data.results;
      videoTable.forEach((videoData) => {
        if (videoData.site == 'YouTube' && videoData.type == 'Trailer') {
            trailerUrl += videoData.key;
        }
      });

      // insert video info in video pour bande annonce
      const resultb = await client.query(
        query5,
        [trailerUrl, '00:01:00']
      );
      const idTrailer = resultb.rows[0].id;

      // insert serie in serie_film
      const result = await client.query(
        query1,
        [serie.name, serie.overview, idTrailer, `https://image.tmdb.org/t/p/original${serie.backdrop_path}`, `https://image.tmdb.org/t/p/w300${serie.backdrop_path}`, `https://image.tmdb.org/t/p/original${serie.poster_path}`]
      );
      idSerie = result.rows[0].id;

      // retrieve cast and crew of the serie
      const credits = await axios.get(`https://api.themoviedb.org/3/tv/${id_serie}/credits?api_key=${process.env.API_KEY}&language=fr`);
      const resultsCast = credits.data.cast;
      const resultsCrew = credits.data.crew;

      // insert cast of the serie
      for (var i = 0; i < 10; i++) {
        if (resultsCast[i]) {
          const { name } = resultsCast[i];
          const department = resultsCast[i].known_for_department;
          const role = utils.Trad(department);
          const split = name.indexOf(' ');
          const prenom = name.substring(0, split);
          const nom = name.substring(split + 1);
          // vérifier que la personne n'est pas déjà présente dans la base
          const ifPresent = await client.query(
            query8,
            [nom, prenom],
          );
          if (!ifPresent.rows[0]) {
            const getid = await client.query(
              query6,
              [nom, prenom]
            );
            idCast = getid.rows[0].id;
            await client.query(
              query7,
              [idCast, idSerie, role]
            );
          } else {
            await client.query(
              query7,
              [ifPresent.rows[0].id, idSerie, role]
            );
          }
        }
      }

      // insert crew of the serie
      for (var i = 0; i < 10; i++) {
        if (resultsCrew[i]) {
          const { name } = resultsCrew[i];
          const department = resultsCrew[i].known_for_department;
          let role = '';
          if (resultsCrew[i].job == 'Director') {
            role = 'realisateur';
          } else {
            role = utils.Trad(department);
          }
          const split = name.indexOf(' ');
          const prenom = name.substring(0, split);
          const nom = name.substring(split + 1);
          // vérifier que la personne n'est pas déjà présente dans la base
          const ifPresent = await client.query(
            query8,
            [nom, prenom],
          );
          if (!ifPresent.rows[0]) {
            const getid = await client.query(
              query6,
              [nom, prenom],
            );
            idCrew = getid.rows[0].id;
            await client.query(
              query7,
              [idCrew, idSerie, role]
            );
          } else {
            await client.query(
              query7,
              [ifPresent.rows[0].id, idSerie, role]
            );
          }
        }
      }

      // insert catégories
      const categories = listCategories.map((categorie) => categorie.name);
      for (const categorie of categories) {
        let catId;
        const id_categorie = await client.query(
          query3,
          [categorie]
        );
        if (!id_categorie.rows[0]) {
          catId = utils.TradCatFirst(categorie);
        } else {
          catId = id_categorie.rows[0].id;
        }
        await client.query(
          query4,
          [catId, idSerie]
        );
      }

      // insert season
      const seasonTable = response.data.seasons;
      const date = (new Date()).toISOString().split('T')[0];
      for (var i = 0; seasonTable.length > i; i++) {
        if (seasonTable[i].season_number != 0) {
          const seasonId = seasonTable[i].season_number;
          const season = await client.query(
            query2,
            [seasonTable[i].name, idSerie, seasonTable[i].air_date, date]
          );
          idSeason = season.rows[0].id;
          const getEpisode = await axios.get(`https://api.themoviedb.org/3/tv/${id_serie}/season/${seasonId}?api_key=${process.env.API_KEY}&language=fr`);
          const episodesList = getEpisode.data.episodes;
          for (let j = 0; episodesList.length > j; j++) {
            const runtimeSerie = episodesList[j].runtime;
            let heureMinuteSeconde = '';
            // insert video info in video pour video episode
            if (runtimeSerie != null) {
              if (runtimeSerie > 59) {
                const heures = Math.floor(runtimeSerie / 60);
                const minutes = runtimeSerie % 60;
                heureMinuteSeconde = `${heures.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
              } else {
                heureMinuteSeconde = `00:${runtimeSerie}:00`;
              }
            } else {
              heureMinuteSeconde = '00:40:00';
            }
            const resultv = await client.query(
              query5,
              ['https://www.youtube.com/watch?v=5VGoAXkxNo4', heureMinuteSeconde]
            );
            const idVideo = resultv.rows[0].id;

            // insert episode in episode
            await client.query(
              query10,
              [episodesList[j].name, episodesList[j].overview, idSeason, idVideo]
            );
          }
        }
      }
    }
    client.release();
    
    console.log('Inserted serie successfull');
  } catch (error) {
    console.error(`Error inserting serie: ${error}`);
  }
}

//retrouve les 20 séries les plus vues du mois actuel
async function getMostSerieSeen() {
  const query = `
  select distinct on (sf.id)
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
  inner join
  saison s
  on
  s.id_serie_film = sf.id
  inner join
  episode e
  on
  e.id_saison = s.id
  inner join
  visionnage v
  on
  v.id_episode = e.id
  where
  sf.id not in (select id_serie_film from film) and
  e.id in (
    select
    e.id
    from
    serie_film sf
    inner join
    saison s
    on
    s.id_serie_film = sf.id
    inner join
    episode e
    on
    e.id_saison = s.id
    inner join
    visionnage v
    on
    v.id_episode = e.id
    group by
    v.id_episode,
    e.id
    order by
    count(id_episode) desc
  ) and
  EXTRACT(MONTH FROM v.jour) = EXTRACT(MONTH FROM CURRENT_DATE) and
  EXTRACT(YEAR FROM v.jour) = EXTRACT(YEAR FROM CURRENT_DATE)
  group by
  cat.id,
  sf.id
  limit 20
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

//fonction qui affiche retrouve 20 séries en fonction des préférences catégorie de l'utilisateur
async function getSerieByPref(id_user){
  const query = `
    select distinct
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
    inner join
    preference_categorie pc
    on
    pc.id_categorie = cat.id
    inner join
    compte c
    on
    c.id = pc.id_compte
    where
    sf.id not in (select id_serie_film from film) and
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

//fonction qui affiche retrouve 20 séries en fonction des préférences catégorie de l'utilisateur
async function getSerieCountByCategorie(){
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
  saison s
  on
  s.id_serie_film = sf.id
  inner join
  episode e
  on
  e.id_saison = s.id
  inner join
  visionnage v
  on
  v.id_episode = e.id
  where
  sf.id not in (select id_serie_film from film)
  group by
  cat.nom
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

module.exports = {
  getAllCategorieSerie,
  getAllSerie,
  getSerieCatTMDB,
  insertSerie,
  getSaisonByIdSerie,
  getEpisodeBySaison,
  getMostSerieSeen,
  getSerieByPref,
  getSerieCountByCategorie
};
