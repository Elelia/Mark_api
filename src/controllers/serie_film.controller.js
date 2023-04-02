const Seriefilm = require('../models/class/serie_film.class');
const SeriefilmFunction = require('../models/serie_film.model');
const Session = require('../../session');

//fonction qui permet de créer tous les utilisateurs et de les retourner
async function allSeriefilm(req, res) {
    const results = await SeriefilmFunction.getAllSeriefilm();
    console.log(results);
    if (results.length > 0) {
        // create a new user object
        let allSeriefilm = results.map(oneSF => new Seriefilm(oneSF.id_serie_film, oneSF.nom, oneSF.age_min, oneSF.resume, oneSF.id_bande_annonce, oneSF.url_vignette, oneSF.url_affiche, oneSF.date_sortie, oneSF.id_video, oneSF.cat_id, oneSF.cat_nom));
        res.status(200).json(allSeriefilm);
    } else {
        res.status(500).send('No values');
    }
}

//fonction qui retourne les catégories
async function allCategorie(req, res) {
    const results = await SeriefilmFunction.getAllCategorie();
    if (results.length > 0) {
        res.status(200).json(results);
    } else {
        res.status(500).send('No values');
    }
}

//pas utilisée mais finira peut-être pas être utile ?
async function allSeriefilmByCategorie(req, res) {
    const ids = await SeriefilmFunction.getIdCategorie();
    let results = [];
    if (ids.length > 0) {
        for(let i = 0;ids.length > i; i++) {
            //console.log(ids[i].id + "******");
            var get = await SeriefilmFunction.getAllSeriefilmByCategorie(ids[i].id);
            //console.log(get + [ids[i].id]);
            if(get != '') {
                results[i] = get;
            }
            //results[i] = await SeriefilmFunction.getAllSeriefilmByCategorie(ids[i].id);
            //console.log(results[i] + "*****");
        }
        //const results = await SeriefilmFunction.getAllSeriefilmByCategorie(ids);
        //console.log(results);
        let allSeriefilm = [];
        for(let i = 0;results.length > i; i++) {
            allSeriefilm[i] = results[i].map(oneSF => 
                new Seriefilm(oneSF.id, oneSF.nom, oneSF.type, oneSF.age_min, oneSF.resume, oneSF.annee, oneSF.id_video, oneSF.actif, oneSF.url)
                );   
        }
        //console.log(allSeriefilm);
        // let allSeriefilm = results.map(oneSF => 
        //     new Seriefilm(oneSF.id, oneSF.nom, oneSF.type, oneSF.age_min, oneSF.resume, oneSF.annee, oneSF.id_video, oneSF.actif, oneSF.url)
        //     );
        res.status(200).json(allSeriefilm);
    } else {
        res.status(500).send('No values');
    }
}

//fonction qui retourne les catégories
async function addAvis(req, res) {
    console.log(req.body);
    var id_compte = req.body.userId;
    var id_serie_film = req.body.seriefilmId;
    var comment = req.body.comment;
    var note = req.body.note;
    var date = req.body.date;
    const result = await SeriefilmFunction.insertAvis(id_compte, id_serie_film, comment, note, date);
    if (result) {
        res.status(200).json(result);
    } else {
        res.status(500).send('Error while insert avis');
    }
}

//fonction qui retourne les catégories
async function allAvis(req, res) {
    const results = await SeriefilmFunction.getAllAvis(req.params.serie_film_id);
    if (results.length > 0) {
        console.log(results);
        //Session.allowCors(handler);
        res.status(200).json(results);
    } else {
        res.status(500).send('No values');
    }
}

module.exports = {
    allSeriefilm,
    allCategorie,
    addAvis,
    allAvis
};