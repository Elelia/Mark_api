class Seriefilm {
    constructor(id, nom, type, age_min, resume, annee, id_video, actif, url, cat_id, cat_nom){
        this.id = id;
        this.nom = nom;
        this.type = type;
        this.age_min = age_min;
        this.resume = resume;
        this.annee = annee;
        this.id_video = id_video;
        this.actif = actif;
        this.url = url;
        this.cat_id = cat_id;
        this.cat_name = cat_nom;
    }
}

module.exports = Seriefilm;