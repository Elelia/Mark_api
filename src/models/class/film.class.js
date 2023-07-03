const Seriefilm = require("./serie_film.class");

class Film extends Seriefilm {
    constructor(id, nom, age_min, resume, id_bande_annonce, url_vignette, url_affiche, date_sortie, id_video, cat_id, cat_nom, id_film, trailer) {
        super(id, nom, age_min, resume, id_bande_annonce, url_vignette, url_affiche, date_sortie, id_video, cat_id, cat_nom);
        this.id_film = id_film;
        this.trailer = trailer;
    }
}

module.exports = Film;