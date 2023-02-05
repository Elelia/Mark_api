const SeriefillModel = require('../models/serie_film');

function Seriefilm(id, nom, type, age_min, resume, annee, id_video, actif) {
    this.id = id;
    this.nom = nom;
    this.type = type;
    this.age_min = age_min;
    this.resume = resume;
    this.annee = annee;
    this.id_video = id_video;
    this.actif = actif;
}

exports.getAllSeriefilm = (req, res) => {
    //console.log("all users");
    //console.log(res);
    SeriefillModel.getAllSeriefilm((users) => {
        let allSeriefilm = users.map(oneSeriefilm => new Seriefilm(oneSeriefilm.id, oneSeriefilm.nom, oneSeriefilm.type, oneSeriefilm.age_min, oneSeriefilm.resume, oneSeriefilm.annee, oneSeriefilm.id_video, oneSeriefilm.actif,));
        let results = JSON.stringify(allSeriefilm);
        console.log("easy les films");
        res.send(results);
    })
}