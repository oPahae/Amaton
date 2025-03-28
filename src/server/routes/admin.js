import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import connect from '../lib/connect.js';
import Admin from '../models/Admin.js';
import VerificationCode from '../models/VerifCode.js';
import nodemailer from 'nodemailer';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || '1111';

router.post('/login', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Missing infos' });

  try {
    const admin = await Admin.findOne({});
    if (!admin) return res.status(404).json({ message: 'Admin not found!' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Password incorrect!' });

    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: '1d' });
    const serialized = serialize('AdminAuthToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    res.setHeader('Set-Cookie', serialized);
    res.status(200).json({ message: 'Logged In Successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

router.post('/logout', (req, res) => {
  res.setHeader('Set-Cookie', serialize('AdminAuthToken', '', { httpOnly: true, sameSite: 'strict', path: '/', expires: new Date(0) }));
  res.status(200).json({ message: 'Logout successful' });
});

router.post('/psswd', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Données manquantes' });

  try {
    const admin = await Admin.findOne({});
    if (!admin) return res.status(404).json({ message: 'Admin introuvable' });

    const match = await bcrypt.compare(currentPassword, admin.password);
    if (!match) return res.status(401).json({ message: 'Mot de passe actuel incorrect' });

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.post('/resetPassword', async (req, res) => {
  const { password } = req.body;
  await connect();
  const admin = await Admin.findOne({});
  if (!admin) return res.status(404).json({ message: 'Admin introuvable' });

  try {
    admin.password = await bcrypt.hash(password, 10);
    await admin.save();
    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/sendCode', async (req, res) => {
  await connect();
  const admin = await Admin.findOne();
  if (!admin) return res.status(404).json({ message: 'No admin found' });
  const email = admin.email;

  const code = Math.floor(100000 + Math.random() * 900000);
  await VerificationCode.findOneAndUpdate({ email }, { email, code, createdAt: new Date() }, { upsert: true });

  setTimeout(async () => await VerificationCode.findOneAndDelete({ email }), 300000);

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: { user: process.env.BREVO_USER, pass: process.env.BREVO_API },
  });

  try {
    await transporter.sendMail({
      from: process.env.BREVO_SENDER,
      to: email,
      subject: 'Code de vérification',
      text: `Votre code de vérification est : ${code}`,
    });
    res.status(200).json({ message: 'Verification code sent!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error });
  }
});

router.post('/verifyCode', async (req, res) => {
  const { code } = req.body;
  await connect();
  const admin = await Admin.findOne();
  const email = admin.email;

  const verificationRecord = await VerificationCode.findOne({ email });
  if (!verificationRecord || verificationRecord.code !== code) {
    return res.status(400).json({ message: 'Invalid code or email' });
  }

  await VerificationCode.deleteOne({ email });
  res.status(200).json({ message: 'Code verified' });
});

router.post('/update', async (req, res) => {
  const { email } = req.body;
  await connect();
  const admin = await Admin.findOne();

  admin.email = email;
  await admin.save();
  res.status(200).json({ message: 'Email mis à jour', admin });
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing infos' });

  try {
    if (await Admin.findOne({ email })) return res.status(400).json({ message: 'Email already used' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Registered Successfully! You can Login now' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;