// const dbConn = require('../../dbconfig');
require('dotenv').config();

class User {
  constructor(id, nom, prenom, mail, admin) {
    this.id = id;
    this.nom = nom;
    this.prenom = prenom;
    this.mail = mail;
    this.admin = admin;
  }

  getId() {
    return this.id;
  }

  getNom() {
    return this.nom;
  }

  setNom(nom) {
    this.nom = nom;
  }

  getPrenom() {
    return this.prenom;
  }

  setPrenom(prenom) {
    this.prenom = prenom;
  }

  getMail() {
    return this.mail;
  }

  setMail(mail) {
    this.mail = mail;
  }

  getAdmin() {
    return this.admin;
  }
}

module.exports = User;
