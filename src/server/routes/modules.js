export const config = {
  api: {
    bodyParser: {
      sizeLimit: '99999mb',
    },
  },
};

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

// Export Route
router.get('/export', async (req, res) => {
  const { type, format } = req.query;
  let data;

  switch (type) {
    case 'Prod': data = await Prod.find({}).lean(); break;
    case 'Cat': data = await Cat.find({}).lean(); break;
    case 'Cmd': data = await Cmd.find({}).lean(); break;
    case 'User': data = await User.find({}).lean(); break;
    default: return res.status(400).json({ message: 'Type invalide' });
  }

  if (!data.length) return res.status(404).json({ message: 'Aucune donnée trouvée' });

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(data);
  }

  if (format === 'csv') {
    try {
      const fields = Object.keys(data[0]);
      const parser = new Parser({ fields });
      const csv = parser.parse(data);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${type}.csv`);
      return res.status(200).send(csv);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur de conversion en CSV', error });
    }
  }

  if (format === 'xlsx') {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');
      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=${type}.xlsx`);
      return res.status(200).send(buffer);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur de conversion en Excel', error });
    }
  }

  if (format === 'pdf') {
    try {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${type}.pdf`);

      doc.pipe(res);
      doc.fontSize(20).text(`Exportation des ${type}s`, { align: 'center' });
      doc.moveDown();

      data.forEach((item, index) => {
        doc.fontSize(12).text(`• ${JSON.stringify(item, null, 2)}`);
        if (index < data.length - 1) doc.moveDown();
      });

      doc.end();
      return;
    } catch (error) {
      return res.status(500).json({ message: 'Erreur de conversion en PDF', error });
    }
  }

  res.status(400).json({ message: 'Format non supporté (JSON, CSV, Excel, PDF seulement)' });
});

// Import Route
router.post('/import', async (req, res) => {

  try {
    const { importType, data } = req.body;

    if (!importType || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: 'Données invalides' });
    }

    let insertedCount = 0;
    let Model;
    switch (importType) {
      case 'Prod': Model = Prod; break;
      case 'Cat': Model = Cat; break;
      case 'Cmd': Model = Cmd; break;
      case 'User': Model = User; break;
      default: return res.status(400).json({ error: 'Type invalide.' });
    }

    // Récupérer les clés du modèle Mongoose
    const modelKeys = Object.keys(Model.schema.paths);

    // Vérifier si chaque objet correspond aux champs du modèle
    const isValidData = data.every(item => {
      const itemKeys = Object.keys(item);
      return itemKeys.every(key => modelKeys.includes(key));
    });

    if (!isValidData) {
      return res.status(400).json({ error: 'Les données JSON ne correspondent pas au modèle choisi.' });
    }

    for (const item of data) {
      const query = { _id: item._id };
      const update = { $setOnInsert: item };
      const options = { upsert: true };

      const result = await Model.updateOne(query, update, options);
      if (result.upsertedCount > 0) insertedCount++;
    }

    res.status(200).json({ message: 'Importation terminée', insertedCount });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

export default router;