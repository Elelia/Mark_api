const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

const Users = require('../controllers/users.controller');

router.get('/', Users.getAllUsers);

router.get('/login/:mail/:mdp', Users.connectUser);

module.exports = router;