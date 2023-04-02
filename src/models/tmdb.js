const dbConn = require('../../dbconfig');
const axios = require("axios");

//insert movie in serie_film, film and categorie_serie_film with TMDB
async function insertMovie(movieId) {
    try {
        const query1 = "INSERT INTO serie_film (nom, resume, id_bande_annonce, url_vignette, url_vignette_mini, url_affiche) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";
        const query2 = "INSERT INTO film (date_sortie, id_video, id_serie_film) VALUES ($1, $2, $3)";
        const query3 = "select id from categorie where nom = $1";
        const query4 = "insert into categorie_serie_film (id_categorie, id_serie_film) VALUES ($1, $2)";
        const query5 = "insert into video (url, duree) VALUES ($1, $2) RETURNING id";
        const query6 = "insert into personne (nom, prenom) VALUES ($1, $2) RETURNING id";
        const query7 = "insert into personne_serie_film (id_personne, id_serie_film, status) VALUES ($1, $2, $3)";
        const query8 = "select id, nom, prenom from personne where nom = $1 and prenom = $2";
        // Retrieve movie data from TMDB
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}&language=fr`);
        const movieData = response.data;
        const listCategories = response.data.genres;
        const runtimeMovie = response.data.runtime;

        //retrieve video data from TMDB
        const video = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.API_KEY}&language=fr`);
        let trailerUrl = "https://www.youtube.com/watch?v=";
        const videoTable = video.data.results;
        videoTable.forEach(videoData => {
            if(videoData.site == "YouTube" && videoData.type == "Trailer") {
                trailerUrl = trailerUrl + videoData.key;
            }
        });

        //insert video info in video pour bande annonce
        /*const resultb = await dbConn.query(
            query5,
            [trailerUrl, "00:01:00"]
        );
        idTrailer = resultb.rows[0].id;*/

        //insert video info in video pour video
        const heures = Math.floor(runtimeMovie / 60);
        const minutes = runtimeMovie % 60;
        const heureMinuteSeconde = `${heures.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
        /*const resultv = await dbConn.query(
            query5,
            ["https://youtu.be/8Vkad-VzxZM", heureMinuteSeconde]
        );
        idVideo = resultv.rows[0].id;*/

        //Insert movie in serie_film
        /*const result = await dbConn.query(
            query1,
            [movieData.title, movieData.overview, idTrailer, 'https://image.tmdb.org/t/p/original' + movieData.backdrop_path, 'https://image.tmdb.org/t/p/w300' + movieData.backdrop_path, 'https://image.tmdb.org/t/p/original' + movieData.poster_path]
        );*/
        //get id of last insert
        //idFilm = result.rows[0].id;

        //retrieve cast and crew of the movie
        const credits = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.API_KEY}&language=fr`);
        const resultsCast = credits.data.cast;
        const resultsCrew = credits.data.crew;

        //insert cast of the movie
        /*for(var i=0; 10>i; i++) {
            const name = resultsCast[i].name;
            const department = resultsCast[i].known_for_department;
            let role = Trad(department);
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
                    [idCast, idFilm, role]
                );
            } else {
                await dbConn.query(
                    query7,
                    [ifPresent.rows[0].id, idFilm, role]
                );
            }
        }*/

        //insert crew of the movie
        /*for(var i=0; 10>i; i++) {
            const name = resultsCrew[i].name;
            const department = resultsCrew[i].known_for_department;
            let role = "";
            if(resultsCrew[i].job == "Director") {
                role = "realisateur";
            } else {
                role = Trad(department);
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
                    [idCrew, idFilm, role]
                );
            } else {
                await dbConn.query(
                    query7,
                    [ifPresent.rows[0].id, idFilm, role]
                );
            }
        }*/

        //Insert catégories
        const categories = listCategories.map(categorie => categorie.name);
        for (const categorie of categories) {
            let catId;
            const id_categorie = await dbConn.query(
                query3,
                [categorie]
            );
            if(!id_categorie.rows[0]) {
                catId = TradCat(categorie);
            } else {
                catId = id_categorie.rows[0].id;
            }
            console.log(categorie);
            console.log(catId);
            /*await dbConn.query(
                query4,
                [catId, idFilm]
            );*/
        }

        //Insert movie in film
        /*await dbConn.query(
            query2,
            [movieData.release_date, idVideo, idFilm]
        );*/
  
        console.log(`Inserted data for movies ${movieData.title} (${movieData.release_date})`);
    } catch (error) {
        console.error(`Error inserting data for movie ${movieId}: ${error}`);
    }
}

//insert 20 movies in the database
async function insertLimitMovie() {
    try {
        const query1 = "INSERT INTO serie_film (nom, resume, url_vignette, url_vignette_mini, url_affiche) VALUES ($1, $2, $3, $4, $5) RETURNING id";
        const query2 = "INSERT INTO film (date_sortie, id_serie_film) VALUES ($1, $2)";
        const query3 = "select id from categorie where nom = $1";
        const query4 = "insert into categorie_serie_film (id_categorie, id_serie_film) VALUES ($1, $2)";
        // Retrieve movie data from TMDB
        const response = await axios.get(`https://api.themoviedb.org/3/discover/movie/?api_key=${process.env.API_KEY}&language=fr&include_adult=false&release_date.gte=2023-01-01&release_date.lte=2023-03-01`);
        //console.log(response.data.results);
        const movieList = response.data.results;

        for (const movie of movieList) {
            //insert movie in serie_film
            //console.log(movie);
            const result = await dbConn.query(
                query1,
                [movie.title, movie.overview, 'https://image.tmdb.org/t/p/original' + movie.backdrop_path, 'https://image.tmdb.org/t/p/w300' + movie.backdrop_path, 'https://image.tmdb.org/t/p/original' + movie.poster_path]
            );
            //get id of last insert
            idFilm = result.rows[0].id;
            //console.log(idFilm);
            const categoriesId = movie.genre_ids;
            //console.log(categoriesId);
            const categResults = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}&language=fr`);
            //console.log(categResults.data.genres);
            categList = categResults.data.genres;
            for (const id of categoriesId) {
                for(list of categList) {
                    if(id == list.id) {
                        //console.log(id);
                        //console.log(list.id);
                        const id_categorie = await dbConn.query(
                            query3,
                            [list.name]
                        );
                        //console.log(id_categorie.rows[0]);
                        await dbConn.query(
                            query4,
                            [id_categorie.rows[0].id, idFilm]
                        );
                    }
                }
            }
            //Insert movie in film
            await dbConn.query(
                query2,
                [movie.release_date, idFilm]
            );
        }

  
        console.log(`Inserted data for movies`);
    } catch (error) {
        console.error(`Error inserting 20 data for movie: ${error}`);
    }
}

//insert categorie with TMDB
async function insertCategorie() {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}&language=fr`);
        const results = response.data.genres;
        const categorieData = results.map(categorie => categorie.name);

        for (const categorie of categorieData) {
            console.log(categorie);
            await dbConn.query(
                "INSERT INTO categorie (nom) VALUES ($1)",
                [categorie]
            );
        }
  
        console.log(`Inserted data for categorie`);
    } catch (error) {
        console.error(`Error inserting data for categorie: ${error}`);
    }
    return true;
}

function Trad(departement) {
    let result = "";
    if(departement == "Production") {
        result = "producteur";
    } else if(departement == "Acting") {
        result = "acteur";
    } else if(departement == "Visual Effects") {
        result = "visuel";
    } else if(departement == "Costume & Make-Up") {
        result = "costume";
    } else if(departement == "Art") {
        result = "art";
    } else if(departement == "Sound") {
        result = "son";
    } else if(departement == "Directing") {
        result = "directeur";
    } else if(departement == "Writing") {
        result = "scenario";
    } else if(departement == "Camera") {
        result = "camera";
    } else if(departement == "Editing") {
        result = "edition";
    } else if(departement == "Crew") {
        result = "membre";
    } else if(departement == "Lighting") {
        result = "lumiere";
    }

    return result;
}

function TradCat(categorie) {
    let catId = "";
    if(categorie == "Adventure") {
        catId = 2;
    } else if(categorie == "Fantasy") {
        catId = 9;
    } else if(categorie == "Drama") {
        catId = 7;
    } else if(categorie == "Documentary") {
        catId = 6;
    } else if(categorie == "Family") {
        catId = 8;
    } else if(categorie == "History") {
        catId = 10;
    } else if(categorie == "War") {
        catId = 18;
    } else if(categorie == "Science Fiction") {
        catId = 15;
    } else if(categorie == "Horror") {
        catId = 11;
    } else if(categorie == "Comedy") {
        catId = 4;
    }

    return catId;
}

module.exports = {
    insertMovie,
    insertCategorie,
    insertLimitMovie
};