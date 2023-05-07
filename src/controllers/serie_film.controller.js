const Seriefilm = require('../models/class/serie_film.class');
const Film = require('../models/class/film.class');
const SeriefilmFunction = require('../models/serie_film.model');
const Session = require('../session');
const fs = require('fs');
const TMDBFunction = require('../models/tmdb');

// variables globales pour avoir mes tableaux d'objet ?

// fonction qui retourne tous les fimms
async function allFilm(req, res) {
  const results = await SeriefilmFunction.getAllFilm();
  if (results) {
    // create a new user object
    const allSeriefilm = results.map((oneSF) => new Film(oneSF.id_serie_film, oneSF.nom, oneSF.age_min, oneSF.resume, oneSF.id_bande_annonce, oneSF.url_vignette, oneSF.url_affiche, oneSF.date_sortie, oneSF.id_video, oneSF.cat_id, oneSF.cat_nom, oneSF.id_film));
    res.status(200).json(allSeriefilm);
  } else {
    res.status(404).send('No values');
  }
}

// fonction qui retourne les catégories des films
async function allCategorieFilm(req, res) {
  const results = await SeriefilmFunction.getAllCategorieFilm();
  if (results) {
    res.status(200).json(results);
  } else {
    res.status(404).send('No values');
  }
}

// fonction qui retourne toutes les séries
async function allSerie(req, res) {
  const results = await SeriefilmFunction.getAllSerie();
  if (results) {
    // create a new user object
    const allSeriefilm = results.map((oneSF) => new Seriefilm(oneSF.id_serie_film, oneSF.nom, oneSF.age_min, oneSF.resume, oneSF.id_bande_annonce, oneSF.url_vignette, oneSF.url_affiche, oneSF.date_sortie, oneSF.id_video, oneSF.cat_id, oneSF.cat_nom));
    res.status(200).json(allSeriefilm);
  } else {
    res.status(404).send('No values');
  }
}

// fonction qui retourne les catégories des séries
async function allCategorieSerie(req, res) {
  const results = await SeriefilmFunction.getAllCategorieSerie();
  if (results) {
    res.status(200).json(results);
  } else {
    res.status(404).send('No values');
  }
}

// pas utilisée mais finira peut-être pas être utile ?
async function allSeriefilmByCategorie(req, res) {
  const ids = await SeriefilmFunction.getIdCategorie();
  const results = [];
  if (ids.length > 0) {
    for (let i = 0; ids.length > i; i++) {
      // console.log(ids[i].id + "******");
      const get = await SeriefilmFunction.getAllSeriefilmByCategorie(ids[i].id);
      // console.log(get + [ids[i].id]);
      if (get != '') {
        results[i] = get;
      }
      // results[i] = await SeriefilmFunction.getAllSeriefilmByCategorie(ids[i].id);
      // console.log(results[i] + "*****");
    }
    // const results = await SeriefilmFunction.getAllSeriefilmByCategorie(ids);
    // console.log(results);
    const allSeriefilm = [];
    for (let i = 0; results.length > i; i++) {
      allSeriefilm[i] = results[i].map((oneSF) => new Seriefilm(oneSF.id, oneSF.nom, oneSF.type, oneSF.age_min, oneSF.resume, oneSF.annee, oneSF.id_video, oneSF.actif, oneSF.url));
    }
    // console.log(allSeriefilm);
    // let allSeriefilm = results.map(oneSF =>
    //     new Seriefilm(oneSF.id, oneSF.nom, oneSF.type, oneSF.age_min, oneSF.resume, oneSF.annee, oneSF.id_video, oneSF.actif, oneSF.url)
    //     );
    res.status(200).json(allSeriefilm);
  } else {
    res.status(500).send('No values');
  }
}

// fonction qui retourne les catégories
async function addAvis(req, res) {
  const id_compte = req.body.userId;
  const id_serie_film = req.body.seriefilmId;
  const { comment } = req.body;
  const { note } = req.body;
  const { date } = req.body;

  console.log(req.body);
  const result = await SeriefilmFunction.insertAvis(id_compte, id_serie_film, comment, note, date);
  if (result) {
    res.status(201).json(result);
  } else {
    res.status(500).send('Error while insert avis');
  }
}

// fonction qui retourne tous les avis
async function allAvis(req, res) {
  const results = await SeriefilmFunction.getAllAvis(req.params.serie_film_id);
  if (results) {
    res.status(200).json(results);
  } else {
    res.status(500).send('No values');
  }
}

//
async function oneUrlVideo(req, res) {
  const results = await SeriefilmFunction.getUrlVideo(req.params.id_video);
  if (results) {
    res.status(200).json(results);
  } else {
    res.status(500).send('No values');
  }
}

// fonction qui retourne les informations de films de l'id de la catégorie reçu
async function filmByCategorieId(req, res) {
  const results = await SeriefilmFunction.getFilmByCategorieId(req.params.cat_id);
  if (results) {
    const allSeriefilm = results.map((oneSF) => new Seriefilm(oneSF.id_serie_film, oneSF.nom, oneSF.age_min, oneSF.resume, oneSF.id_bande_annonce, oneSF.url_vignette, oneSF.url_affiche, oneSF.date_sortie, oneSF.id_video, oneSF.cat_id, oneSF.cat_nom));
    res.status(200).json(allSeriefilm);
  } else {
    res.status(500).send('No values');
  }
}

//fonction qui retourne les films du fichier json mais en fait c'est compliqué
async function getMoviesTMDB(req, res) {
  const results = [];
  fs.readFile('movie_ids_04_01_2023.json', async (error, data) => {
    if (error) {
      console.error(`Error reading file: ${error}`);
      return;
    }
    const movies = JSON.parse(data);
    const movieIds = movies.map((movie) => movie.id);

    for (const movieId of movieIds) {
      const res = await SeriefilmFunction.getMovieTMDB(movieId, req.body.id);
      console.log(res);
      results.push(res);
    }
  });
  res.status(200).json(results);
}

//retrouve 20 films de TMDB en fonction de l'id catégorie envoyé
async function getMoviesCatTMDB(req, res) {
  const results = await SeriefilmFunction.getMovieCatTMDB(req.params.id);
  if(!results) {
    res.status(500).send('No values');
  }
  res.status(200).json(results);
}

//ajoute en base les films sélectionnés via l'admin
async function insertMovieSelected(req, res) {
  await TMDBFunction.insertMovie(req.body.id_movie);
  res.status(200).json({
    success: true,
    message: 'Insert movie selected successful',
  });
}

//retrouve 20 séries de TMDB en fonction de l'id catégorie envoyé
async function getSeriesCatTMDB(req, res) {
  const results = await SeriefilmFunction.getSerieCatTMDB(req.params.id);
  if(!results) {
    res.status(500).send('No values');
  }
  res.status(200).json(results);
}

//ajoute en base les séries sélectionné via l'admin
async function insertSerieSelected(req, res) {
  await SeriefilmFunction.insertSerie(req.body.id_serie);
  res.status(200).json({
    success: true,
    message: 'Insert serie selected successful',
  });
}

async function filmByPreference(req, res) {
  const results = await SeriefilmFunction.getMovieByPref(req.user.id);
  if (results) {
    const allSeriefilm = results.map((oneSF) => new Seriefilm(oneSF.id_serie_film, oneSF.nom, oneSF.age_min, oneSF.resume, oneSF.id_bande_annonce, oneSF.url_vignette, oneSF.url_affiche, oneSF.date_sortie, oneSF.id_video, oneSF.cat_id, oneSF.cat_nom));
    res.status(200).json(allSeriefilm);
  } else {
    res.status(500).send('No values');
  }
}

async function videoSaw(req, res) {
  const results = await SeriefilmFunction.insertVisionnage(req.user.id, req.body.id_film, req.body.id_episode);
  if (!results) {
    res.status(500).send('No values');
  }
  res.status(200).json('Success');
}

module.exports = {
  allFilm,
  allCategorieFilm,
  allSerie,
  allCategorieSerie,
  addAvis,
  allAvis,
  oneUrlVideo,
  filmByCategorieId,
  getMoviesCatTMDB,
  insertMovieSelected,
  getSeriesCatTMDB,
  insertSerieSelected,
  filmByPreference,
  videoSaw
};
