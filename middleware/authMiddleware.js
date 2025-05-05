const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware: skyddar rutter genom att verifiera JWT-token
const protect = async (req, res, next) => {
  let token;

  // Kontrollera att en auktoriseringsheader finns och börjar med 'Bearer'
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      // Extrahera token från headern
      token = req.headers.authorization.split(' ')[1];

      // Verifierar token med hemlig nyckel
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Hämtar användardata utan lösenord och lägg till i req-objektet
      req.user = await User.findById(decoded.id).select('-password');
      
      next(); // Fortsätt till nästa middleware
    } catch (error) {
      res.status(401).json({ message: 'Ej auktoriserad' });
    }
  }
// Om ingen token skickades med
  if (!token) {
    res.status(401).json({ message: 'Ingen token, åtkomst nekad' });
  }
};

module.exports = { protect };