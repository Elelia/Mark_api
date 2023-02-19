const Seriefilm = require('../models/serie_film.class');
const SeriefilmFunction = require('../models/serie_film');

//fonction qui permet de créer tous les utilisateurs et de les retourner
async function allSeriefilm(req, res) {
    const results = await SeriefilmFunction.getAllSeriefilm();
    console.log(results);
    if (results.length > 0) {
        // create a new user object
        let allSeriefilm = results.map(oneSF => new Seriefilm(oneSF.id, oneSF.nom, oneSF.type, oneSF.age_min, oneSF.resume, oneSF.annee, oneSF.id_video, oneSF.actif, oneSF.url, oneSF.cat_id, oneSF.cat_nom));
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

module.exports = {
    allSeriefilm,
    allCategorie
};

// function Seriefilm(id, nom, type, age_min, resume, annee, id_video, actif) {
//     this.id = id;
//     this.nom = nom;
//     this.type = type;
//     this.age_min = age_min;
//     this.resume = resume;
//     this.annee = annee;
//     this.id_video = id_video;
//     this.actif = actif;
// }

// exports.getAllSeriefilm = (req, res) => {
//     //console.log("all users");
//     //console.log(res);
//     SeriefillModel.getAllSeriefilm((users) => {
//         let allSeriefilm = users.map(oneSeriefilm => new Seriefilm(oneSeriefilm.id, oneSeriefilm.nom, oneSeriefilm.type, oneSeriefilm.age_min, oneSeriefilm.resume, oneSeriefilm.annee, oneSeriefilm.id_video, oneSeriefilm.actif,));
//         let results = JSON.stringify(allSeriefilm);
//         console.log("easy les films");
//         res.send(results);
//     })
// }