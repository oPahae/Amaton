import express from 'express';
import connect from '../lib/connect.js';
import User from '../models/User.js';
import Prod from '../models/Prod.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/buy', async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const product = await Prod.findById(productId);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    const existingItem = user.cart.find((item) => item.name === product.name);

    if (existingItem) {
      existingItem.qtt += 1;
    } else {
      user.cart.push({
        id: productId,
        name: product.name,
        mark: product.mark,
        price: product.price,
        promo: product.promo,
        stock: product.stock,
        images: product.images,
        qtt: 1,
      });
    }

    await user.save();
    res.status(200).json({ message: 'Produit ajouté au panier avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.delete('/drop', async (req, res) => {
  try {
    await connect();
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: 'ID utilisateur manquant' });

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: 'Utilisateur introuvable' });

    res.status(200).json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/getAll', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs.' });
  }
});

router.get('/getInfos', async (req, res) => {
  try {
    await connect();
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: 'User ID is required' });

    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/psswd', async (req, res) => {
  try {
    await connect();
    const { id, currentPassword, newPassword } = req.body;
    if (!id || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Données manquantes' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(401).json({ message: 'Mot de passe actuel incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/update', async (req, res) => {
  try {
    await connect();
    const { id, username, email } = req.body;
    if (!id || !username || !email) {
      return res.status(400).json({ message: 'Données manquantes' });
    }

    const user = await User.findByIdAndUpdate(id, { username, email }, { new: true });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    res.status(200).json({ message: 'Profil mis à jour', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;