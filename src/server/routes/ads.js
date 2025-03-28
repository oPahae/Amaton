import express from 'express';
import connect from '../lib/connect.js';
import Prod from '../models/Prod.js';
import Cat from '../models/Cat.js';
import Cmd from '../models/Cmd.js';
import User from '../models/User.js';
import Ad from '../models/Ad.js';
import { Parser } from 'json2csv';
import XLSX from 'xlsx';
import PDFDocument from 'pdfkit';

const router = express.Router();

router.post('/add', async (req, res) => {
  const { base64Image } = req.body;

  try {
    const newAd = new Ad({ img: base64Image });
    const savedAd = await newAd.save();
    res.status(201).json(savedAd);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

router.get('/get', async (req, res) => {
  try {
    const ads = await Ad.find({});
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

router.post('/delete', async (req, res) => {
  const { id } = req.body;

  try {
    const ad = await Ad.findById(id);
    if (!ad) return res.status(404).json({ message: 'Publicité non trouvée' });

    await Ad.findByIdAndDelete(id);
    res.status(200).json({ message: 'Publicité supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

export default router;