const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

const Users = require('../controllers/users.controller');

//route qui retourne tous les comptes de la db
router.get('/', Users.allUsers);

//route qui permet de connecter un utilisateur s'il a rentré son bon mail et mpd
router.post('/login', Users.loginUser);

module.exports = router;