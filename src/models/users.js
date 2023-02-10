const dbConn = require('../../dbconfig');

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
    console.log(result.rows);
    return result.rows;
}

//connect one user
async function connectUser(mail, mdp) {
    //console.log(mail);
    dbConn.connect();
  
    const query = `SELECT * FROM compte WHERE mail=$1 and mdp=$2`;
    //console.log(query);
  
    let result;
    try {
        result = await dbConn.query(query, [mail, mdp]);
        //console.log(result.rows);
    } catch (err) {
        console.error(err);
    }
    console.log(result.rows);
    return result.rows;
}

module.exports = {
    connectUser,
    getAllUsers
};