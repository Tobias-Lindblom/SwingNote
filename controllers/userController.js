const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Skapar en JWT-token för autentisering, som är giltig i 30 dagar
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Hämta alla användare förutom den inloggade och lägger till vänstatus
exports.getAllUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    const users = await User.find({
      _id: { $ne: req.user.id }
    }).select('-password'); // Exkluderar lösenord från svaret
    
    // lägg till information om vänrelationer för varje användare
    const usersWithFriendStatus = users.map(user => {
      const userObj = user.toObject();
      userObj.isFriend = currentUser.friends.includes(user._id);
      userObj.hasIncomingRequest = currentUser.friendRequests.includes(user._id);
      userObj.hasSentRequest = currentUser.sentRequests.includes(user._id);
      
      return userObj;
    });
    
    res.status(200).json(usersWithFriendStatus);
  } catch (error) {
    console.error('fel vid hämtning av användare:', error);
    res.status(500).json({ message: 'Serverfel' });
  }
};

// Registrerar en ny användare efter att ha validerat och hashat lösenordet
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Fyll i alla fält' });

  const userExists = await User.findOne({ email });
  if (userExists)
     return res.status(400).json({ message: 'Användaren finns redan' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashedPassword });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400).json({ message: 'ogiltig användardata' });
  }
};

// Loggar in en användare genom att verifiera e-post och lösenord
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({ message: 'Ogiltiga inloggningsuppgifter' });
  }
};

// Returnerar information om den inloggade användaren
exports.getMe = async (req, res) => {
  const { _id, name, email } = req.user;
  res.status(200).json({ _id, name, email });
};

// Söker efter användare baserat på namn eller e-post, exkluderar vänner och förfrågningar
exports.getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    
    // bygger sökfrågan om söktermen finns
    const searchQuery = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const user = await User.findById(req.user.id);
    
    // Hämta användare som inte redan är kopplade till den inloggade (vän, skickad eller mottagen förfrågan)
    const users = await User.find({
      ...searchQuery,
      _id: { 
        $ne: req.user.id,
        $nin: [...user.friends, ...user.friendRequests, ...user.sentRequests]
      }
    }).select('-password');
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};