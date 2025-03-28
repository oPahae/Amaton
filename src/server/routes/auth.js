import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import connect from '../lib/connect.js';
import User from '../models/User.js';
import VerificationCode from '../models/VerifCode.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || '1111';
const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing infos' });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Password incorrect!' });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    const serialized = serialize("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    res.setHeader("Set-Cookie", serialized);
    return res.status(200).json({ message: "Logged In Successfully!" });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.cookie('authToken', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logout successful' });
});

// Register
router.post('/register', async (req, res) => {
  const { username, email, password, country } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'Missing infos' });

  try {
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already used' });
    if (await User.findOne({ username })) return res.status(400).json({ message: 'Username already used' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, cart: [], cmdsCount: 0 });
    await newUser.save();

    res.status(201).json({ message: 'Registered Successfully! You can Login now' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Google Login
router.post('/googleLogin', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Missing Google token' });

  try {
    const ticket = await googleClient.verifyIdToken({ idToken: token, audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID });
    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      const hashedPassword = await bcrypt.hash(email + JWT_SECRET, 10);
      user = new User({ username: name, email, password: hashedPassword, cart: [], cmdsCount: 0 });
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    res.cookie('authToken', jwtToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 86400000 });

    res.status(200).json({ message: 'Login successful', username: user.username });
  } catch (error) {
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

// Send Verification Code
router.post('/sendCode', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No user with this email' });

    const code = Math.floor(100000 + Math.random() * 900000);
    await VerificationCode.findOneAndUpdate({ email }, { email, code, createdAt: new Date() }, { upsert: true });

    setTimeout(() => VerificationCode.findOneAndDelete({ email }), 300000);

    const transporter = nodemailer.createTransport({ host: 'smtp-relay.brevo.com', port: 587, auth: { user: process.env.BREVO_USER, pass: process.env.BREVO_API } });
    await transporter.sendMail({ from: process.env.BREVO_SENDER, to: email, subject: 'Verification Code', text: `Your verification code is: ${code}` });

    res.status(200).json({ message: 'Verification code sent!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', details: error.message });
  }
});

// Verify Code
router.post('/verifyCode', async (req, res) => {
  const { email, code } = req.body;
  await connect();
  const record = await VerificationCode.findOne({ email });

  if (!record || record.code !== code) return res.status(400).json({ message: 'Invalid code or email' });

  await VerificationCode.deleteOne({ email });
  res.status(200).json({ message: 'Code verified' });
});

// Reset Password
router.post('/resetPassword', async (req, res) => {
  const { email, password } = req.body;
  await connect();
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate({ email }, { password: hashedPassword });

  res.status(200).json({ message: 'Password reset successfully' });
});

export default router;