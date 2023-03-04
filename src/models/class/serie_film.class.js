class Seriefilm {
    constructor(id, nom, age_min, resume, id_bande_annonce, url_vignette, url_affiche, date_sortie, id_video, cat_id, cat_nom){
        this.id = id;
        this.nom = nom;
        this.age_min = age_min;
        this.resume = resume;
        this.id_bande_annonce = id_bande_annonce;
        this.url_vignette = url_vignette;
        this.url_affiche = url_affiche;
        this.date_sortie = date_sortie;
        this.id_video = id_video;
        this.cat_id = cat_id;
        this.cat_name = cat_nom;
    }
}

module.exports = Seriefilm;