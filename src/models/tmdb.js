const axios = require('axios');
const dbConn = require('../../dbconfig');
const utils = require('../utils/function');

// insert movie in serie_film, film and categorie_serie_film with TMDB start DDB
async function insertMovie(movieId) {
  try {
    const query1 = 'INSERT INTO serie_film (nom, resume, id_bande_annonce, url_vignette, url_vignette_mini, url_affiche) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
    const query2 = 'INSERT INTO film (date_sortie, id_video, id_serie_film) VALUES ($1, $2, $3)';
    const query3 = 'select id from categorie where nom = $1';
    const query4 = 'insert into categorie_serie_film (id_categorie, id_serie_film) VALUES ($1, $2)';
    const query5 = 'insert into video (url, duree) VALUES ($1, $2) RETURNING id';
    const query6 = 'insert into personne (nom, prenom) VALUES ($1, $2) RETURNING id';
    const query7 = 'insert into personne_serie_film (id_personne, id_serie_film, status) VALUES ($1, $2, $3)';
    const query8 = 'select id, nom, prenom from personne where nom = $1 and prenom = $2';

    // Retrieve movie data from TMDB
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}&language=fr`);
    const movieData = response.data;
    const listCategories = response.data.genres;
    const runtimeMovie = response.data.runtime;

    // retrieve video data from TMDB
    const video = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.API_KEY}&language=fr`);
    let trailerUrl = 'https://www.youtube.com/watch?v=';
    const videoTable = video.data.results;
    videoTable.forEach((videoData) => {
      if (videoData.site == 'YouTube' && videoData.type == 'Trailer') {
        trailerUrl += videoData.key;
      }
    });

    // insert video info in video pour bande annonce
    const resultb = await dbConn.query(
      query5,
      [trailerUrl, '00:01:00'],
    );
    idTrailer = resultb.rows[0].id;

    // insert video info in video pour video
    const heures = Math.floor(runtimeMovie / 60);
    const minutes = runtimeMovie % 60;
    const heureMinuteSeconde = `${heures.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    const resultv = await dbConn.query(
      query5,
      ['https://youtu.be/8Vkad-VzxZM', heureMinuteSeconde],
    );
    idVideo = resultv.rows[0].id;

    // Insert movie in serie_film
    const result = await dbConn.query(
      query1,
      [movieData.title, movieData.overview, idTrailer, `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`, `https://image.tmdb.org/t/p/w300${movieData.backdrop_path}`, `https://image.tmdb.org/t/p/original${movieData.poster_path}`],
    );
    // get id of last insert
    idFilm = result.rows[0].id;

    // retrieve cast and crew of the movie
    const credits = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.API_KEY}&language=fr`);
    const resultsCast = credits.data.cast;
    const resultsCrew = credits.data.crew;

    // insert cast of the movie
    for (var i = 0; i < 10; i++) {
      const { name } = resultsCast[i];
      const department = resultsCast[i].known_for_department;
      const role = utils.Trad(department);
      const split = name.indexOf(' ');
      const prenom = name.substring(0, split);
      const nom = name.substring(split + 1);
      // vérifier que la personne n'est pas déjà présente dans la base
      const ifPresent = await dbConn.query(
        query8,
        [nom, prenom],
      );
      if (!ifPresent.rows[0]) {
        const getid = await dbConn.query(
          query6,
          [nom, prenom],
        );
        idCast = getid.rows[0].id;
        await dbConn.query(
          query7,
          [idCast, idFilm, role],
        );
      } else {
        await dbConn.query(
          query7,
          [ifPresent.rows[0].id, idFilm, role],
        );
      }
    }

    // insert crew of the movie
    for (var i = 0; i < 10; i++) {
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
      const ifPresent = await dbConn.query(
        query8,
        [nom, prenom],
      );
      if (!ifPresent.rows[0]) {
        const getid = await dbConn.query(
          query6,
          [nom, prenom],
        );
        idCrew = getid.rows[0].id;
        await dbConn.query(
          query7,
          [idCrew, idFilm, role],
        );
      } else {
        await dbConn.query(
          query7,
          [ifPresent.rows[0].id, idFilm, role],
        );
      }
    }

    // Insert catégories
    const categories = listCategories.map((categorie) => categorie.name);
    for (const categorie of categories) {
      let catId;
      const id_categorie = await dbConn.query(
        query3,
        [categorie],
      );
      if (!id_categorie.rows[0]) {
        catId = utils.TradCat(categorie);
      } else {
        catId = id_categorie.rows[0].id;
      }
      await dbConn.query(
        query4,
        [catId, idFilm],
      );
    }

    // Insert movie in film
    await dbConn.query(
      query2,
      [movieData.release_date, idVideo, idFilm],
    );

    console.log(`Inserted data for movies ${movieData.title} (${movieData.release_date})`);
  } catch (error) {
    console.error(`Error inserting data for movie ${movieId}: ${error}`);
  }
}

// insert 20 movies in the database start DDB
async function insertLimitMovie() {
  try {
    const query1 = 'INSERT INTO serie_film (nom, resume, id_bande_annonce, url_vignette, url_vignette_mini, url_affiche) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
    const query2 = 'INSERT INTO film (date_sortie, id_video, id_serie_film) VALUES ($1, $2, $3)';
    const query3 = 'select id from categorie where nom = $1';
    const query4 = 'insert into categorie_serie_film (id_categorie, id_serie_film) VALUES ($1, $2)';
    const query5 = 'insert into video (url, duree) VALUES ($1, $2) RETURNING id';
    const query6 = 'insert into personne (nom, prenom) VALUES ($1, $2) RETURNING id';
    const query7 = 'insert into personne_serie_film (id_personne, id_serie_film, status) VALUES ($1, $2, $3)';
    const query8 = 'select id, nom, prenom from personne where nom = $1 and prenom = $2';
    const query9 = 'select nom from serie_film where nom = $1';

    // Retrieve movie data from TMDB
    const response = await axios.get(`https://api.themoviedb.org/3/discover/movie/?api_key=${process.env.API_KEY}&language=fr&include_adult=false&release_date.gte=2023-01-01&release_date.lte=2023-04-01`);
    const movieList = response.data.results;

    for (const movie of movieList) {
      const resp = await dbConn.query(
        query9,
        [movie.title],
      );
      if (!resp.rows[0]) {
        const movieId = movie.id;

        // retrive info of the film for runtime
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}&language=fr`);
        const runtimeMovie = response.data.runtime;

        // retrieve video data from TMDB
        const video = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.API_KEY}&language=fr`);
        let trailerUrl = 'https://www.youtube.com/watch?v=';
        const videoTable = video.data.results;
        videoTable.forEach((videoData) => {
          if (videoData.site == 'YouTube' && videoData.type == 'Trailer') {
            trailerUrl += videoData.key;
          }
        });

        // insert video info in video pour bande annonce
        const resultb = await dbConn.query(
          query5,
          [trailerUrl, '00:01:00'],
        );
        idTrailer = resultb.rows[0].id;

        // insert video info in video pour video
        const heures = Math.floor(runtimeMovie / 60);
        const minutes = runtimeMovie % 60;
        const heureMinuteSeconde = `${heures.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
        const resultv = await dbConn.query(
          query5,
          ['https://youtu.be/8Vkad-VzxZM', heureMinuteSeconde],
        );
        idVideo = resultv.rows[0].id;

        // insert movie in serie_film
        const result = await dbConn.query(
          query1,
          [movie.title, movie.overview, idTrailer, `https://image.tmdb.org/t/p/original${movie.backdrop_path}`, `https://image.tmdb.org/t/p/w300${movie.backdrop_path}`, `https://image.tmdb.org/t/p/original${movie.poster_path}`],
        );
        // get id of last insert
        idFilm = result.rows[0].id;

        // retrieve cast and crew of the movie
        const credits = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.API_KEY}&language=fr`);
        const resultsCast = credits.data.cast;
        const resultsCrew = credits.data.crew;

        // insert cast of the movie
        for (var i = 0; i < 10; i++) {
          const { name } = resultsCast[i];
          const department = resultsCast[i].known_for_department;
          const role = utils.Trad(department);
          const split = name.indexOf(' ');
          const prenom = name.substring(0, split);
          const nom = name.substring(split + 1);
          // vérifier que la personne n'est pas déjà présente dans la base
          const ifPresent = await dbConn.query(
            query8,
            [nom, prenom],
          );
          if (!ifPresent.rows[0]) {
            const getid = await dbConn.query(
              query6,
              [nom, prenom],
            );
            idCast = getid.rows[0].id;
            await dbConn.query(
              query7,
              [idCast, idFilm, role],
            );
          } else {
            await dbConn.query(
              query7,
              [ifPresent.rows[0].id, idFilm, role],
            );
          }
        }

        // insert crew of the movie
        for (var i = 0; i < 10; i++) {
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
          const ifPresent = await dbConn.query(
            query8,
            [nom, prenom],
          );
          if (!ifPresent.rows[0]) {
            const getid = await dbConn.query(
              query6,
              [nom, prenom],
            );
            idCrew = getid.rows[0].id;
            await dbConn.query(
              query7,
              [idCrew, idFilm, role],
            );
          } else {
            await dbConn.query(
              query7,
              [ifPresent.rows[0].id, idFilm, role],
            );
          }
        }

        // insert catégories
        const categoriesId = movie.genre_ids;
        const categResults = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}&language=fr`);
        categList = categResults.data.genres;
        for (const id of categoriesId) {
          let catId;
          for (list of categList) {
            if (id == list.id) {
              const id_categorie = await dbConn.query(
                query3,
                [list.name],
              );
              if (!id_categorie.rows[0]) {
                catId = utils.TradCat(categorie);
              } else {
                catId = id_categorie.rows[0].id;
              }
              await dbConn.query(
                query4,
                [catId, idFilm],
              );
            }
          }
        }

        // Insert movie in film
        await dbConn.query(
          query2,
          [movie.release_date, idVideo, idFilm],
        );
      } else {
        console.log('bah non');
      }
    }

    console.log('Inserted data for movies');
  } catch (error) {
    console.error(`Error inserting 20 data for movie: ${error}`);
  }
}

// insert into serie start DDB
async function insertSerie() {
  try {
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

    // retrieve serie from TMDB
    // const responseEn = await axios.get(`https://api.themoviedb.org/3/discover/tv/?api_key=${process.env.API_KEY}&language=fr&vote_count.gte=4&with_original_language=en`);
    // const serieEn = responseEn.data.results;
    /* for (const serie of serieEn) {
            const resp = await dbConn.query(
                query9,
                [serie.name]
            );
            if(!resp.rows[0]) {
                const serieId = serie.id;
                //retrive info of the serie
                const response = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}?api_key=${process.env.API_KEY}&language=fr`);

                //retrieve video data from TMDB
                const video = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/videos?api_key=${process.env.API_KEY}&language=fr`);
                let trailerUrl = "https://www.youtube.com/watch?v=";
                const videoTable = video.data.results;
                videoTable.forEach(videoData => {
                    if(videoData.site == "YouTube" && videoData.type == "Trailer") {
                        trailerUrl = trailerUrl + videoData.key;
                    }
                });

                //insert video info in video pour bande annonce
                const resultb = await dbConn.query(
                    query5,
                    [trailerUrl, "00:01:00"]
                );
                idTrailer = resultb.rows[0].id;

                //insert serie in serie_film
                const result = await dbConn.query(
                    query1,
                    [serie.name, serie.overview, idTrailer, 'https://image.tmdb.org/t/p/original' + serie.backdrop_path, 'https://image.tmdb.org/t/p/w300' + serie.backdrop_path, 'https://image.tmdb.org/t/p/original' + serie.poster_path]
                );
                idSerie = result.rows[0].id;

                //retrieve cast and crew of the serie
                const credits = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/credits?api_key=${process.env.API_KEY}&language=fr`);
                const resultsCast = credits.data.cast;
                const resultsCrew = credits.data.crew;

                //insert cast of the serie
                for(var i=0; 10>i; i++) {
                    if(resultsCast[i]) {
                        const name = resultsCast[i].name;
                        const department = resultsCast[i].known_for_department;
                        let role = utils.Trad(department);
                        const split = name.indexOf(" ");
                        let prenom = name.substring(0, split);
                        let nom = name.substring(split + 1);
                        //vérifier que la personne n'est pas déjà présente dans la base
                        const ifPresent = await dbConn.query(
                            query8,
                            [nom, prenom]
                        );
                        if(!ifPresent.rows[0]) {
                            const getid = await dbConn.query(
                                query6,
                                [nom, prenom]
                            );
                            idCast = getid.rows[0].id;
                            await dbConn.query(
                                query7,
                                [idCast, idSerie, role]
                            );
                        } else {
                            await dbConn.query(
                                query7,
                                [ifPresent.rows[0].id, idSerie, role]
                            );
                        }
                    }
                }

                //insert crew of the serie
                for(var i=0; 10>i; i++) {
                    if(resultsCrew[i]) {
                        const name = resultsCrew[i].name;
                        const department = resultsCrew[i].known_for_department;
                        let role = "";
                        if(resultsCrew[i].job == "Director") {
                            role = "realisateur";
                        } else {
                            role = utils.Trad(department);
                        }
                        const split = name.indexOf(" ");
                        let prenom = name.substring(0, split);
                        let nom = name.substring(split + 1);
                        //vérifier que la personne n'est pas déjà présente dans la base
                        const ifPresent = await dbConn.query(
                            query8,
                            [nom, prenom]
                        );
                        if(!ifPresent.rows[0]) {
                            const getid = await dbConn.query(
                                query6,
                                [nom, prenom]
                            );
                            idCrew = getid.rows[0].id;
                            await dbConn.query(
                                query7,
                                [idCrew, idSerie, role]
                            );
                        } else {
                            await dbConn.query(
                                query7,
                                [ifPresent.rows[0].id, idSerie, role]
                            );
                        }
                    }
                }

                //insert catégories
                const categoriesId = serie.genre_ids;
                const categResults = await axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.API_KEY}&language=fr`);
                categList = categResults.data.genres;
                for (const id of categoriesId) {
                    let catId;
                    for(list of categList) {
                        if(id == list.id) {
                            const id_categorie = await dbConn.query(
                                query3,
                                [list.name]
                            );
                            if(!id_categorie.rows[0]) {
                                catId = utils.TradCat(categorie);
                            } else {
                                catId = id_categorie.rows[0].id;
                            }
                            await dbConn.query(
                                query4,
                                [catId, idSerie]
                            );
                        }
                    }
                }

                //insert season
                const seasonTable = response.data.seasons;
                var date = (new Date()).toISOString().split('T')[0];
                for(var i=0; seasonTable.length > i; i++) {
                    if(seasonTable[i].season_number != 0) {
                        var seasonId = seasonTable[i].season_number;
                        const season = await dbConn.query(
                            query2,
                            [seasonTable[i].name, idSerie, seasonTable[i].air_date, date]
                        );
                        idSeason = season.rows[0].id;
                        const getEpisode = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/season/${seasonId}?api_key=${process.env.API_KEY}&language=fr`);
                        const episodesList = getEpisode.data.episodes;
                        for(var j=0; episodesList.length > j; j++) {
                            var runtimeSerie = episodesList[j].runtime;
                            var heureMinuteSeconde = '';
                            //insert video info in video pour video episode
                            if(runtimeSerie != null) {
                                if(runtimeSerie > 59) {
                                    var heures = Math.floor(runtimeSerie / 60);
                                    var minutes = runtimeSerie % 60;
                                    heureMinuteSeconde = `${heures.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
                                } else {
                                    heureMinuteSeconde = `00:${runtimeSerie}:00`;
                                }
                            } else {
                                heureMinuteSeconde = `00:40:00`;
                            }
                            const resultv = await dbConn.query(
                                query5,
                                ["https://www.youtube.com/watch?v=5VGoAXkxNo4", heureMinuteSeconde]
                            );
                            var idVideo = resultv.rows[0].id;

                            //insert episode in episode
                            await dbConn.query(
                                query10,
                                [episodesList[j].name, episodesList[j].overview, idSeason, idVideo]
                            );
                        }
                    }
                }
            }
        } */

    // series françaises
    const responseFr = await axios.get(`https://api.themoviedb.org/3/discover/tv/?api_key=${process.env.API_KEY}&language=fr&vote_count.gte=3&with_original_language=fr`);
    const serieFr = responseFr.data.results;
    for (const serie of serieFr) {
      const resp = await dbConn.query(
        query9,
        [serie.name],
      );
      if (!resp.rows[0]) {
        const serieId = serie.id;
        // retrive info of the serie
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}?api_key=${process.env.API_KEY}&language=fr`);

        // retrieve video data from TMDB
        const video = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/videos?api_key=${process.env.API_KEY}&language=fr`);
        let trailerUrl = 'https://www.youtube.com/watch?v=';
        const videoTable = video.data.results;
        videoTable.forEach((videoData) => {
          if (videoData.site == 'YouTube' && videoData.type == 'Trailer') {
            trailerUrl += videoData.key;
          }
        });

        // insert video info in video pour bande annonce
        const resultb = await dbConn.query(
          query5,
          [trailerUrl, '00:01:00'],
        );
        idTrailer = resultb.rows[0].id;

        // insert serie in serie_film
        const result = await dbConn.query(
          query1,
          [serie.name, serie.overview, idTrailer, `https://image.tmdb.org/t/p/original${serie.backdrop_path}`, `https://image.tmdb.org/t/p/w300${serie.backdrop_path}`, `https://image.tmdb.org/t/p/original${serie.poster_path}`],
        );
        idSerie = result.rows[0].id;

        // retrieve cast and crew of the serie
        const credits = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/credits?api_key=${process.env.API_KEY}&language=fr`);
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
            const ifPresent = await dbConn.query(
              query8,
              [nom, prenom],
            );
            if (!ifPresent.rows[0]) {
              const getid = await dbConn.query(
                query6,
                [nom, prenom],
              );
              idCast = getid.rows[0].id;
              await dbConn.query(
                query7,
                [idCast, idSerie, role],
              );
            } else {
              await dbConn.query(
                query7,
                [ifPresent.rows[0].id, idSerie, role],
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
            const ifPresent = await dbConn.query(
              query8,
              [nom, prenom],
            );
            if (!ifPresent.rows[0]) {
              const getid = await dbConn.query(
                query6,
                [nom, prenom],
              );
              idCrew = getid.rows[0].id;
              await dbConn.query(
                query7,
                [idCrew, idSerie, role],
              );
            } else {
              await dbConn.query(
                query7,
                [ifPresent.rows[0].id, idSerie, role],
              );
            }
          }
        }

        // insert catégories
        const categoriesId = serie.genre_ids;
        const categResults = await axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.API_KEY}&language=fr`);
        categList = categResults.data.genres;
        for (const id of categoriesId) {
          let catId;
          for (list of categList) {
            if (id == list.id) {
              const id_categorie = await dbConn.query(
                query3,
                [list.name],
              );
              if (!id_categorie.rows[0]) {
                catId = utils.TradCat(categorie);
              } else {
                catId = id_categorie.rows[0].id;
              }
              await dbConn.query(
                query4,
                [catId, idSerie],
              );
            }
          }
        }

        // insert season
        const seasonTable = response.data.seasons;
        const date = (new Date()).toISOString().split('T')[0];
        for (var i = 0; seasonTable.length > i; i++) {
          if (seasonTable[i].season_number != 0) {
            const seasonId = seasonTable[i].season_number;
            const season = await dbConn.query(
              query2,
              [seasonTable[i].name, idSerie, seasonTable[i].air_date, date],
            );
            idSeason = season.rows[0].id;
            const getEpisode = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/season/${seasonId}?api_key=${process.env.API_KEY}&language=fr`);
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
              const resultv = await dbConn.query(
                query5,
                ['https://www.youtube.com/watch?v=5VGoAXkxNo4', heureMinuteSeconde],
              );
              const idVideo = resultv.rows[0].id;

              // insert episode in episode
              await dbConn.query(
                query10,
                [episodesList[j].name, episodesList[j].overview, idSeason, idVideo],
              );
            }
          }
        }
      }
    }

    console.log('Inserted serie');
  } catch (error) {
    console.error(`Error inserting serie: ${error}`);
  }
}

// insert categorie with TMDB start DDB
async function insertCategorie() {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}&language=fr`);
    const results = response.data.genres;
    const categorieData = results.map((categorie) => categorie.name);

    for (const categorie of categorieData) {
      console.log(categorie);
      await dbConn.query(
        'INSERT INTO categorie (nom) VALUES ($1)',
        [categorie],
      );
    }

    console.log('Inserted data for categorie');
  } catch (error) {
    console.error(`Error inserting data for categorie: ${error}`);
  }
  return true;
}

// insert catégories des séries start DDB
async function insertCategorieSerie() {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.API_KEY}&language=fr`);
    const results = response.data.genres;
    const categorieData = results.map((categorie) => categorie.name);

    for (const categorie of categorieData) {
      const ifPresent = await dbConn.query(
        'SELECT nom from categorie where nom = $1',
        [categorie],
      );
      if (!ifPresent.rows[0]) {
        await dbConn.query(
          'INSERT INTO categorie (nom) VALUES ($1)',
          [categorie],
        );
      }
    }

    console.log('Inserted data for categorie');
  } catch (error) {
    console.error(`Error inserting data for categorie: ${error}`);
  }
  return true;
}

module.exports = {
  insertMovie,
  insertCategorie,
  insertLimitMovie,
  insertSerie,
  insertCategorieSerie,
};
