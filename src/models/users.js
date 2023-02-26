const dbConn = require('../../dbconfig');
const bcrypt = require('bcrypt');

//all users
async function getAllUsers() {
    //console.log(mail);
    dbConn.connect();
  
    const query = `SELECT * FROM compte`;
    //console.log(query);
  
    let result;
    try {
        result = await dbConn.query(query);
        //console.log(result.rows);
    } catch (err) {
        console.error(err);
    }
    //console.log(result.rows);
    return result.rows;
}

//connect one user
async function connectUser(mail, mdp) {
    dbConn.connect();
  
    const query1 = `SELECT mdp FROM compte WHERE mail=$1`;
    const query2 = `SELECT * FROM compte WHERE mail=$1 and mdp=$2`;
    //const query3 = `UPDATE compte SET mdp = $2 WHERE mail=$1`;
  
    let result;
    let valid = false;
    try {
        res = await dbConn.query(query1, [mail]);
        //console.log(res);
        hash = res.rows[0].mdp;
        //console.log(hash);
        //let hash = await bcrypt.hash(password, 10);
        //await dbConn.query(query3, [mail, hash]);
        valid = await bcrypt.compare(mdp, hash);
        if(valid) {
            result = await dbConn.query(query2, [mail, hash]);
        }
    } catch (err) {
        console.error(err);
    }
    //console.log(result.rows);
    return result.rows;
}

module.exports = {
    connectUser,
    getAllUsers
};