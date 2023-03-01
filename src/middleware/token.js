const jwt = require('jsonwebtoken');

// Middleware function to generate JWT
function generateToken(user) {
  const payload = { id: user.id, isAdmin: user.admin };
  const accessToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
  return accessToken;
}

// Middleware function to authenticate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if(authHeader) {
    //const token = authHeader.split(" ")[1];
    console.log(authHeader);
    jwt.verify(authHeader, process.env.SECRET_KEY, (err, payload) => {
      if(err) {
        //403 c'est quand on a un token mais qu'il n'est pas bon
        return res.status(403).json("Your token is incorrect");
      }
      req.user = payload;
      next();
    })
  } else {
    //401 c'est quand on n'a pas le token
    res.status(401).json("You don't have any token");
  }
}

function sendCookie(token, next) {
  console.log(token);
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  }).sendStatus(200);
  next();
}

module.exports = {
  generateToken,
  authenticateToken,
  sendCookie
};