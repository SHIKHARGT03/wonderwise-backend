import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to generate JWT and send as cookie
function sendTokenResponse(user, res) {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

// @route POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    sendTokenResponse(user, res); // Automatically log in after signup
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email, password);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    sendTokenResponse(user, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ msg: 'Logged out successfully' });
});

// @route GET /api/auth/profile (protected route)
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

// @route POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { tokenId } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        googleId,
        email,
        name,
        password: '',
      });
      await user.save();
    }

    sendTokenResponse(user, res);
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Google authentication failed' });
  }
});

export default router;
