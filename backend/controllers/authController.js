const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const admin = require('firebase-admin');

// Optional Firebase initialization for verifying Google tokens
try {
  const serviceAccount = require('../config/firebase-service-account.json');
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  console.log('Firebase admin initialized successfully with service account');
} catch (error) {
  console.log('Firebase admin initialization skipped or failed:', error.message);
}

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'User'
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!admin.apps.length) {
      return res.status(500).json({ message: 'Firebase Admin not configured on server. Please add your service account.' });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name } = decodedToken;

    // Check if user exists
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Create user without a password
      user = await User.create({
        name: name || 'Google User',
        email,
        password: null, // Allow null for Google users
        role: 'User'
      });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ message: 'Google authentication failed. ' + error.message });
  }
};

module.exports = { registerUser, loginUser, googleLogin };
