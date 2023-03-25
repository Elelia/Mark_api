const jwt = require('jsonwebtoken');
const { addToBlacklist } = require('../utils/token');
const { getBlacklist } = require('../utils/token');

//génère un token à la connection de l'utilisateur
function generateToken(user) {
  const payload = { id: user.id, isAdmin: user.admin };
  const accessToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
  return accessToken;
}

// Middleware function to authenticate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if(authHeader) {
    const token = authHeader.split(" ")[1];
    console.log(token);
    const blacklist = getBlacklist();
    if (blacklist.includes(token)) {
      // token has been blacklisted, reject it
      res.sendStatus(401).json("token is blacklisted");
    } else {
      jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
        if(err) {
          //403 c'est quand on a un token mais qu'il n'est pas bon
          return res.status(403).json("Your token is incorrect");
        }
        req.user = payload;
        next();
      })
    }
  } else {
    //401 c'est quand on n'a pas le token
    res.status(401).json("You don't have any token");
  }
}

//refresh le token de l'utilisateur pour qu'il ne perde pas sa section à l'expiration
//si il est encore actif
//donc faire ça à chaque route protégé ?
function refreshToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.sendStatus(401);
    }

    // Vérifiez si le token expire bientôt
    const now = Date.now() / 1000; // Convertit la date en secondes
    const { exp } = decoded;

    if (exp - now > 60 * 15) { // Si le token expire dans plus de 15 minutes, on ne le rafraîchit pas encore
      return next();
    }

    // Génère un nouveau token avec une nouvelle durée de validité
    const newToken = generateToken(decoded);

    // Envoie le nouveau token au client dans un cookie sécurisé
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // Durée de validité du cookie (ici 24 heures)
    });

    next();
  });
}

function setTokenCookie(res, token) {
  // Configuration du cookie avec le token JWT
  res.cookie('token', token, {
    httpOnly: true, // Empêcher l'accès au cookie depuis le code JavaScript côté client
    secure: true, // Utiliser uniquement pour les connexions HTTPS
    sameSite: 'strict', // Empêcher les attaques CSRF
    maxAge: 3600000, // Temps d'expiration du cookie en millisecondes (1 heure)
  });
}

//quand l'utilisateur se logout
function blacklistToken(req, res, next) {
  try {
    const token = req.cookies.token;
    // add token to blacklist
    addToBlacklist(token);
    // clear cookie
    res.clearCookie('token');
    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

module.exports = {
  generateToken,
  authenticateToken,
  refreshToken,
  setTokenCookie,
  blacklistToken
};