import Prod from './_models/Prod'; // Ajuste le chemin selon ton projet
import connect from './_lib/connect';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    await connect();

    const result = await Prod.deleteMany({}); // Supprime tous les produits

    res.status(200).json({ message: 'Tous les produits ont été supprimés', deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Erreur serveur :', error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
}