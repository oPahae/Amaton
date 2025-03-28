import { Router } from 'express';
import connect from '../lib/connect.js';
import Infos from '../models/Infos.js';

const router = Router();

// Récupérer les infos
router.get('/get', async (req, res) => {
  try {
    const infos = await Infos.findOne().select('-__v -_id');
    res.status(200).json(infos || {});
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour ou créer les infos
router.post('/set', async (req, res) => {
  try {
    const data = req.body;
    let infos = await Infos.findOne();

    if (!infos) {
      infos = new Infos(data);
    } else {
      Object.assign(infos, data);
    }

    await infos.save();
    res.status(200).json({ message: 'Informations mises à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;