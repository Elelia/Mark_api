const dbConn = require('../../dbconfig');
const axios = require("axios");

//insert movie in serie_film, film and categorie_serie_film with TMDB
async function insertMovie(movieId) {
    try {
        const query1 = "INSERT INTO serie_film (nom, resume, url_vignette, url_vignette_mini, url_affiche) VALUES ($1, $2, $3, $4, $5) RETURNING id";
        const query2 = "INSERT INTO film (date_sortie, id_serie_film) VALUES ($1, $2)";
        const query3 = "select id from categorie where nom = $1";
        const query4 = "insert into categorie_serie_film (id_categorie, id_serie_film) VALUES ($1, $2)";
        // Retrieve movie data from TMDB
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}&language=fr`);
        const movieData = response.data;
        const listCategories = response.data.genres;

        //Insert movie in serie_film
        const result = await dbConn.query(
            query1,
            [movieData.title, movieData.overview, 'https://image.tmdb.org/t/p/original' + movieData.backdrop_path, 'https://image.tmdb.org/t/p/w300' + movieData.backdrop_path, 'https://image.tmdb.org/t/p/original' + movieData.poster_path]
        );
        //get id of last insert
        idFilm = result.rows[0].id;
        console.log(idFilm);

        const categories = listCategories.map(categorie => categorie.name);
        for (const categorie of categories) {
            const id_categorie = await dbConn.query(
                query3,
                [categorie]
            );
            console.log(id_categorie.rows[0]);
            await dbConn.query(
                query4,
                [id_categorie.rows[0].id, idFilm]
            );
        }

        //Insert movie in film
        await dbConn.query(
            query2,
            [movieData.release_date, idFilm]
        );
  
        console.log(`Inserted data for movies ${movieData.title} (${movieData.release_date})`);
    } catch (error) {
        console.error(`Error inserting data for movie ${movieId}: ${error}`);
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

module.exports = {
    insertMovie,
    insertCategorie
};