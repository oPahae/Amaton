import { Router } from 'express';
import connect from '../lib/connect.js';
import Feedback from '../models/Feedback.js';

const router = Router();

// Ajouter un feedback
router.post('/add', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ message: 'Feedback ajouté avec succès', feedback });
  } catch (error) {
    res.status(500).json({ message: 'Erreur Serveur' });
  }
});

// Récupérer les feedbacks
router.get('/get', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({}).populate('user');
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Erreur Serveur' });
  }
});

export default router;