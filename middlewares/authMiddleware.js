
const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // agora req.user.id está disponível
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }
}

module.exports = authenticateJWT;
