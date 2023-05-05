// traduit les données récupérer de TMDB pour qu'elles correspondent à celles en base pour les personnes
function Trad(departement) {
    let result = '';
    if (departement == 'Production') {
      result = 'producteur';
    } else if (departement == 'Acting') {
      result = 'acteur';
    } else if (departement == 'Visual Effects') {
      result = 'visuel';
    } else if (departement == 'Costume & Make-Up') {
      result = 'costume';
    } else if (departement == 'Art') {
      result = 'art';
    } else if (departement == 'Sound') {
      result = 'son';
    } else if (departement == 'Directing') {
      result = 'directeur';
    } else if (departement == 'Writing') {
      result = 'scenario';
    } else if (departement == 'Camera') {
      result = 'camera';
    } else if (departement == 'Editing') {
      result = 'edition';
    } else if (departement == 'Crew') {
      result = 'membre';
    } else if (departement == 'Lighting') {
      result = 'lumiere';
    }
  
    return result;
  }
  
  //renvoit l'id de la bonne catégorie de la base de données en fonction du nom récupéré depuis TMDB
  function TradCatFirst(categorie) {
    let catId = '';
    if (categorie == 'Adventure') {
      catId = 2;
    } else if (categorie == 'Fantasy') {
      catId = 9;
    } else if (categorie == 'Drama') {
      catId = 7;
    } else if (categorie == 'Documentary') {
      catId = 6;
    } else if (categorie == 'Family') {
      catId = 8;
    } else if (categorie == 'History') {
      catId = 10;
    } else if (categorie == 'War') {
      catId = 18;
    } else if (categorie == 'Science Fiction') {
      catId = 15;
    } else if (categorie == 'Horror') {
      catId = 11;
    } else if (categorie == 'Comedy') {
      catId = 4;
    }
  
    return catId;
  }

  function TradCatAdd(categorie) {
    let catName = '';
    if (categorie == 'Adventure') {
      catName = 'Aventure';
    } else if (categorie == 'Fantasy') {
      catName = 'Fantastique';
    } else if (categorie == 'Drama') {
      catName = 'Drame';
    } else if (categorie == 'Documentary') {
      catName = 'Documentaire';
    } else if (categorie == 'Family') {
      catName = 'Familial';
    } else if (categorie == 'History') {
      catName = 'Histoire';
    } else if (categorie == 'War') {
      catName = 'Guerre';
    } else if (categorie == 'Science Fiction') {
      catName = 'Science-Fiction';
    } else if (categorie == 'Horror') {
      catName = 'Horreur';
    } else if (categorie == 'Comedy') {
      catName = 'Comédie';
    }
  
    return catId;
  }

  module.exports = {
    Trad,
    TradCatFirst,
    TradCatAdd
  };