import express from 'express';
import mongoose from 'mongoose';
import Cat from '../models/Cat.js';
import connect from '../lib/connect.js';

const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const { name, img } = req.body;
    if (!name || !img) return res.status(400).json({ error: 'Nom et image requis.' });

    const newCat = new Cat({ name, img, subcats: [] });
    await newCat.save();

    res.status(201).json(newCat);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la catégorie.' });
  }
});

router.delete('/delete', async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requis.' });

    await Cat.findByIdAndDelete(id);
    res.status(200).json({ message: 'Catégorie supprimée.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

router.get('/get', async (req, res) => {
  try {
    const categories = await Cat.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories.' });
  }
});

router.put('/update', async (req, res) => {
  try {
    const { id, name, img } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requis.' });

    const updatedCat = await Cat.findByIdAndUpdate(id, { name, img }, { new: true });

    res.status(200).json(updatedCat);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la modification de la catégorie.' });
  }
});

router.post('/subcats/add', async (req, res) => {
  try {
    const { catId, name } = req.body;
    if (!catId || !name) return res.status(400).json({ error: 'ID et nom requis.' });

    const category = await Cat.findById(catId);
    if (!category) return res.status(404).json({ error: 'Catégorie non trouvée.' });

    const newSubcat = { id: new mongoose.Types.ObjectId(), name, cat: category.name };
    category.subcats.push(newSubcat);
    await category.save();

    res.status(201).json(newSubcat);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la sous-catégorie.' });
  }
});

router.delete('/subcats/delete', async (req, res) => {
  try {
    const { catId, subcatId } = req.body;
    if (!catId || !subcatId) return res.status(400).json({ error: 'ID requis.' });

    const category = await Cat.findById(catId);
    if (!category) return res.status(404).json({ error: 'Catégorie non trouvée.' });

    category.subcats = category.subcats.filter((sub) => sub.id.toString() !== subcatId);
    await category.save();

    res.status(200).json({ message: 'Sous-catégorie supprimée.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

router.put('/subcats/update', async (req, res) => {
  try {
    const { catId, subcatId, name } = req.body;
    if (!catId || !subcatId || !name) return res.status(400).json({ error: 'Données incomplètes.' });

    const category = await Cat.findById(catId);
    if (!category) return res.status(404).json({ error: 'Catégorie non trouvée.' });

    const subcat = category.subcats.find((sub) => sub.id.toString() === subcatId);
    if (!subcat) return res.status(404).json({ error: 'Sous-catégorie non trouvée.' });

    subcat.name = name;
    await category.save();

    res.status(200).json(subcat);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la modification.' });
  }
});

export default router;