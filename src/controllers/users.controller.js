// la classe User
const nodemailer = require('nodemailer');
const User = require('../models/class/users.class');
// les fonctions liées à user
const UserFunction = require('../models/users.model');
// pour gérer les tokens
const Token = require('../utils/session');

// fonction qui permet de connecter un utilisateur
async function loginUser(req, res) {
  const { email, password } = req.body;
  const result = await UserFunction.connectUser(email, password);

  if (!result.length) {
    res.status(400).json({
      success: false,
      message: 'Login failed',
    });
  }

  const {
    id, nom, prenom, mail, admin, mdp,
  } = result[0];
  const user = new User(id, nom, prenom, mail, admin, mdp);
  delete user.mdp;

  const token = Token.generateToken(user);

  //l'envoie de token dans les cookies ne fonctionne pas
  Token.setTokenCookie(res, token);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    user,
    token,
  });
}

// fonction utilisé lors de la connection google, pour récupérer un token
async function loginGoogle(req, res) {
  const email = req.body.mail;
  const result = await UserFunction.getUserByMail(email);

  if (!result.length) {
    res.status(400).json({
      success: false,
      message: 'No user',
    });
  }

  const {
    id, nom, prenom, mail, admin, mdp,
  } = result[0];
  const user = new User(id, nom, prenom, mail, admin, mdp);
  delete user.mdp;

  const token = Token.generateToken(user);

  //l'envoie de token dans les cookies ne fonctionne pas
  Token.setTokenCookie(res, token);

  res.status(200).json({
    success: true,
    message: 'Generate token success',
    token
  });
}

// fonction qui permet de créer tous les utilisateurs et de les retourner
async function allUsers(req, res) {
  const results = await UserFunction.getAllUsers();
  if (results.length > 0) {
    // create a new user object
    const allUsers = results.map((oneUser) => new User(oneUser.id, oneUser.nom, oneUser.prenom, oneUser.mail, oneUser.admin, oneUser.mdp));

    res.status(200).json(allUsers);
  } else {
    res.status(500).send('No values');
  }
}

//permet de modifier certaines informations de l'utilisateur
async function modifyUser(req, res) {
  let goodPassword;
  let result = false;
  const id = req.user.id;
  const { mail } = req.body;
  const { nom } = req.body;
  const { prenom } = req.body;
  const mdp = req.body.verifyPassword;
  //const oldmdp = req.body.oldpassword;
  const newmdp = req.body.newPassword;
  goodPassword = await UserFunction.checkPassword(id, mdp);
  if(!goodPassword) {
    console.log("pas bon");
    res.status(400).json({
      success: false,
      message: 'Wrong password'
    });
  } else {
    //si l'utilisateur a décidé de changer son mot de passe
    if(newmdp != '') {
      result = await UserFunction.updateUser(id, nom, prenom, mail, newmdp);
    } else {
      result = await UserFunction.updateUser(id, nom, prenom, mail, mdp);
    }
    console.log(result);
    if(!result) {
      res.status(400).json({
        success: false,
        message: 'Error while updating user'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Update user success'
    });
  }
}

// fonction qui retourne un objet user en fonction de son id
async function userById(req, res) {
  //req.user.id correspond aux informations de l'utilisateur connecté que l'on a sauvegardé à l'authentification du token
  const result = await UserFunction.getUserById(req.user.id);

  if (!result.length) {
    res.status(400).json({
      success: false,
      message: 'get user by id failed',
    });
  }

  const {
    id, nom, prenom, mail, admin, mdp,
  } = result[0];
  const user = new User(id, nom, prenom, mail, admin, mdp);

  delete user.mdp;

  res.status(200).json(user);
}

// fonction qui permet de connecter un utilisateur
async function logoutUser(req, res) {
  Token.clearTokenCookie(req, res);
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
}

// retrouver un utilisateur via un mail
async function userByMail(req, res) {
  const result = await UserFunction.getUserByMail(req.params.mail);
  if (result.length > 0) {
    // create a new user object
    const user = result.map((oneUser) => new User(oneUser.id, oneUser.nom, oneUser.prenom, oneUser.mail, oneUser.admin, oneUser.mdp));
    console.log(user);
    // revoir les codes d'erreur
    res.status(200).json({
      user,
      message: 'Success',
    });
  } else {
    res.status(200).json({
      message: 'no user with this mail',
    });
  }
}

// fonction qui sert à l'inscription d'un utilisateur, que ce soit via google ou via le formulaire
// envoie également un mail pour signaler que l'inscription a réussit
async function createOneUser(req, res) {
  const result = await UserFunction.insertUser(req.body.nom, req.body.prenom, req.body.mail, req.body.admin, req.body.mdp);
  if (result) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ADDRESS_MAIL,
        pass: process.env.PASSWORD_MAIL,
      },
    });
    /* transporter.verify(function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log("Server is ready to take our messages");
            }
        }); */
    const message = {
      from: process.env.ADDRESS_MAIL,
      to: req.body.mail,
      subject: 'Inscription réussie à Mark',
      text: "Bonjour ! Votre inscription à notre site web Mark s'est bien déroulée. Vous pouvez dès à présent vous connecter avec vos identifiants afin de regarder vos films et séries préférés !",
      html: '<p>Contenu du message en format HTML</p>',
    };
    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`E-mail envoyé: ${info.response}`);
      }
    });
    res.status(200).json({
      success: true,
      message: 'insert new user into compte',
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'insert new user failed',
    });
  }
}

//fonction pour insérer valeur dans preference_categorie
async function createPreferenceCategorie(req, res) {
  const result = await UserFunction.insertPreferenceCategorie(req.body.id_compte, req.body.id_categorie);
  if(!result) {
    res.status(400).json({
      success: false,
      message: 'insert preference categorie failed',
    });
  }

  res.status(200).json({
    success: true,
    message: 'insert preference categorie success',
  });
}

//permet d'envoyer un message au mail de mark
//ne fonctionne pas, problème au niveau des autorisations, il faudrait utiliser une autre méthode
async function formContact(req, res) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: req.body.mail,
      pass: process.env.PASSWORD_MAIL,
    },
  });
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  const message = {
    from: req.body.mail,
    to: "projetmarkensitech@gmail.com",
    subject: "Formulaire de contact Mark",
    text: req.body.message
  };
  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
      res.status(400).json({
        success: false,
        message: 'Error while sending mail',
      });
    } else {
      console.log(`E-mail envoyé: ${info.response}`);
      res.status(200).json({
        success: true,
        message: 'sending mail is a success',
      });
    }
  });
}

module.exports = {
  loginUser,
  loginGoogle,
  allUsers,
  userById,
  logoutUser,
  userByMail,
  createOneUser,
  createPreferenceCategorie,
  modifyUser,
  formContact
};
