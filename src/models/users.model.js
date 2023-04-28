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

  let result;
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
async function updateUser(id, mdp, nom, prenom, mail) {
  dbConn.connect();

  const query = 'UPDATE compte SET mdp, nom, prenom, mail  WHERE mail=$1';

  try {

  } catch (err) {
    console.error(err);
  }
  // console.log(result.rows);
  return result.rows;
}

// connect one user
async function checkPassword(id, mdp) {
  dbConn.connect();

  const query = 'SELECT mdp FROM compte WHERE id=$1';

  let result = false;
  try {
    // donc si y a une erreur de mdp il gère pas bien l'erreur et crash
    res = await dbConn.query(query1, [id]);
    hash = res.rows[0].mdp;
    // let hash = await bcrypt.hash(password, 10);
    // await dbConn.query(query3, [mail, hash]);
    result = await bcrypt.compare(mdp, hash);
  } catch (err) {
    console.error(err);
  }
  return result;
}

// get user by mail
async function getUserByMail(mail) {
  dbConn.connect();

  const query = 'SELECT * FROM compte where mail = $1';

  let result;
  try {
    result = await dbConn.query(query, [mail]);
  } catch (err) {
    console.error(err);
  }
  return result.rows;
}

// insert user
async function insertUser(nom, prenom, mail, admin, mdp) {
  dbConn.connect();

  const query = 'insert into compte (nom, prenom, mail, admin, mdp) values ($1, $2, $3, $4, $5)';

  try {
    // hash le mot de passe saisit par l'utilisateur pour l'enregistrer en base
    const hash = await bcrypt.hash(mdp, 10);
    await dbConn.query(query, [nom, prenom, mail, admin, hash]);
  } catch (err) {
    console.error(err);
  }
  return true;
}

module.exports = {
  connectUser,
  getAllUsers,
  getUserById,
  updateUser,
  checkPassword,
  getUserByMail,
  insertUser,
};
