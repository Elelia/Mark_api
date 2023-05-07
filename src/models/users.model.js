const bcrypt = require('bcrypt');
const dbConn = require('../../dbconfig');

// all users
async function getAllUsers() {
  const query = 'SELECT * FROM compte';

  let result;
  try {
    // on ouvre la connexion
    const client = await dbConn.connect();

    // on exécute la requête
    const res = await client.query(query);

    // on ferme la connexion
    client.release();
    return res.rows;
  } catch (err) {
    console.error(err);
  }
  // return result.rows;
}

// connect one user
async function connectUser(mail, mdp) {
  const query1 = 'SELECT mdp FROM compte WHERE mail=$1';
  const query2 = 'SELECT * FROM compte WHERE mail=$1 and mdp=$2';

  let result;
  let valid = false;
  try {
    // on ouvre la connexion
    const client = await dbConn.connect();

    // on exécute la requête
    const res = await client.query(query1, [mail]);
    hash = res.rows[0].mdp;
    valid = await bcrypt.compare(mdp, hash);
    if (valid) {
      result = await client.query(query2, [mail, hash]);
    }
    // on ferme la connexion
    client.release();

    // donc si y a une erreur de mdp il gère pas bien l'erreur et crash
    // res = await dbConn.query(query1, [mail]);
    // hash = res.rows[0].mdp;
    // let hash = await bcrypt.hash(password, 10);
    // await dbConn.query(query3, [mail, hash]);
    /* valid = await bcrypt.compare(mdp, hash);
        if(valid) {
            result = await dbConn.query(query2, [mail, hash]);
        } else {
            return false;
        } */
  } catch (err) {
    console.error(err);
  }
  // console.log(result.rows);
  return result.rows;
}

// get user by id
async function getUserById(id) {
  const query = 'SELECT * FROM compte where id = $1';

  try {
    // on ouvre la connexion
    const client = await dbConn.connect();

    // on exécute la requête
    const res = await client.query(query, [id]);

    // on ferme la connexion
    client.release();
    return res.rows;
  } catch (err) {
    console.error(err);
  }
  // return result.rows;
}

// modifie les informations d'un compte donné par l'id
async function updateUser(id, nom, prenom, mail, mdp) {
  const query = 'UPDATE compte SET nom=$2, prenom=$3, mail=$4, mdp=$5  WHERE id=$1';

  try {
    const client = await dbConn.connect();

    const hash = await bcrypt.hash(mdp, 10);
    await client.query(query, [id, nom, prenom, mail, hash]);

    client.release();
    return true;
  } catch (err) {
    console.error(err);
  }
}

// connect one user
async function checkPassword(id, mdp) {

  const query = 'SELECT mdp FROM compte WHERE id=$1';

  let result = false;
  try {
    const client = await dbConn.connect();
    // donc si y a une erreur de mdp il gère pas bien l'erreur et crash
    res = await client.query(query, [id]);
    hash = res.rows[0].mdp;
    // let hash = await bcrypt.hash(password, 10);
    // await dbConn.query(query3, [mail, hash]);
    result = await bcrypt.compare(mdp, hash);
    client.release();
  } catch (err) {
    console.error(err);
  }
  return result;
}

// get user by mail
async function getUserByMail(mail) {

  const query = 'SELECT * FROM compte where mail = $1';

  let result;
  try {
    const client = await dbConn.connect();

    result = await client.query(query, [mail]);
    client.release();
  } catch (err) {
    console.error(err);
  }

  return result.rows;
}

// insert user
async function insertUser(nom, prenom, mail, admin, mdp) {

  const query = 'insert into compte (nom, prenom, mail, admin, mdp) values ($1, $2, $3, $4, $5)';

  try {
    const client = await dbConn.connect();

    // hash le mot de passe saisit par l'utilisateur pour l'enregistrer en base
    const hash = await bcrypt.hash(mdp, 10);
    await client.query(query, [nom, prenom, mail, admin, hash]);
    client.release();
    return true;
  } catch (err) {
    console.error(err);
  }
  //return true;
}

//insert les préférences de l'utilisateur pour les catégories
async function insertPreferenceCategorie(id_compte, id_categorie) {
  const query = 'INSERT into preference_categorie (id_compte, id_categorie) values ($1, $2)';

  let result = false;
  try {
    // on ouvre la connexion
    const client = await dbConn.connect();

    // on exécute la requête
    await client.query(query, [id_compte, id_categorie]);

    // on ferme la connexion
    client.release();
    result = true;
  } catch (err) {
    console.error(err);
  }
  return result;
}

//vinsert les préférences de l'utilisateur pour les acteurs/réalisateurs
async function insertPreferencePersonne(id_compte, id_personne) {
  const query = 'INSERT into preference_personne (id_compte, id_personne) values ($1, $2)';

  let result = false;
  try {
    // on ouvre la connexion
    const client = await dbConn.connect();

    // on exécute la requête
    await client.query(query, [id_compte, id_personne]);

    // on ferme la connexion
    client.release();
    result = true;
  } catch (err) {
    console.error(err);
  }
  return result;
}

async function getActeurs() {
  const query = `
    select
    p.nom,
    p.prenom
    from
    personne p
    inner join
    personne_serie_film psf
    on
    p.id = psf.id_personne
    where
    psf.status = 'acteur'
  `;

  try {
    // on ouvre la connexion
    const client = await dbConn.connect();

    // on exécute la requête
    res = await client.query(query);

    // on ferme la connexion
    client.release();
    return res.rows;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  connectUser,
  getAllUsers,
  getUserById,
  updateUser,
  checkPassword,
  getUserByMail,
  insertUser,
  insertPreferenceCategorie,
  insertPreferencePersonne,
  getActeurs
};
