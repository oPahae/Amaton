import express from 'express';
import Prod from '../models/Prod.js';
import User from '../models/User.js';
import connect from '../lib/connect.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/add', async (req, res) => {
  const { name, mark, price, promo, stock, cat, subcat, images, descr } = req.body;
  try {
    const newProd = new Prod({ name, mark, price, promo, stock, cat, subcat, images, rating: 5, descr, cmnts: [] });
    const savedProd = await newProd.save();
    res.status(201).json(savedProd);
  } catch (error) {
    console.error('Erreur lors de la création du produit :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post('/cmnt', async (req, res) => {
  const { productId, userId, content, rating } = req.body;
  try {
    const product = await Prod.findById(productId);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    const newComment = {
      user: new mongoose.Types.ObjectId(userId),
      content,
      rating,
    };

    product.cmnts.push(newComment);

    const totalRatings = product.cmnts.reduce((acc, cmnt) => acc + cmnt.rating, 0);
    const averageRating = (totalRatings / product.cmnts.length).toFixed(1);

    product.rating = averageRating;
    await product.save();

    res.status(200).json({ message: 'Commentaire ajouté avec succès', comment: newComment, newRating: product.rating });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.delete('/delete', async (req, res) => {
  const { id } = req.body;
  try {
    const deletedProd = await Prod.findByIdAndDelete(id);
    if (!deletedProd) return res.status(404).json({ error: 'Produit non trouvé.' });
    res.status(200).json({ message: 'Produit supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

router.get('/get', async (req, res) => {
  try {
    const prods = await Prod.find().sort({ date: -1 });
    res.status(200).json(prods);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/getID', async (req, res) => {
  const { id } = req.query;
  try {
    const product = await Prod.findById(id).populate({
      path: 'cmnts.user',
      model: User,
      select: 'username',
    });
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.put('/update', async (req, res) => {
  const { _id, name, mark, price, promo, stock, cat, subcat, images, descr } = req.body;
  try {
    const updatedProd = await Prod.findByIdAndUpdate(
      _id,
      { name, mark, price, promo, stock, cat, subcat, images, descr },
      { new: true }
    );
    if (!updatedProd) return res.status(404).json({ error: 'Produit non trouvé.' });
    res.status(200).json(updatedProd);
  } catch (error) {
    console.error('Erreur API update :', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

router.post('/deleteCmnt', async (req, res) => {
  const { prodID, cmntID } = req.body;
  try {
    await connect()
      if (!prodID) return res.status(400).json({ message: "Product ID is required" });
  
      const prod = await Prod.findById(prodID);
      if (!prod) return res.status(404).json({ message: "Product not found" });
  
      prod.cmnts = prod.cmnts.filter(cmnt => cmnt._id.toString() !== cmntID);
      await prod.save();
      res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
      console.error("Erreur serveur: " + error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;