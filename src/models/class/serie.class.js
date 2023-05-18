const Seriefilm = require("./serie_film.class");

class Serie extends Seriefilm {
    constructor(id, nom, age_min, resume, id_bande_annonce, url_vignette, url_affiche, date_sortie, id_video, cat_id, cat_nom, saison, episode) {
        super(id, nom, age_min, resume, id_bande_annonce, url_vignette, url_affiche, date_sortie, id_video, cat_id, cat_nom);
        this.saison = saison;
        this.episode = episode;
    }
}

module.exports = Serie;