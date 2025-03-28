import express from 'express';
import connect from '../lib/connect.js';
import Cmd from '../models/Cmd.js';
import User from '../models/User.js';
import Prod from '../models/Prod.js';
import History from '../models/History.js';
import Infos from '../models/Infos.js';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';

const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const { user, prods, total, code } = req.body;
    if (!user || !prods || !total || !code) return res.status(400).json({ message: 'Données manquantes' });

    const existingUser = await User.findById(user);
    if (!existingUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    existingUser.cmdsCount += 1;
    existingUser.cart = [];
    await existingUser.save();

    const validatedProds = [];
    for (const item of prods) {
      const product = await Prod.findById(item.product);
      if (!product) return res.status(404).json({ message: `Produit introuvable : ${item.product}` });
      validatedProds.push({ product: product._id, qtt: item.qtt });
    }

    const newCmd = new Cmd({ user: existingUser._id, prods: validatedProds, total, code });
    await newCmd.save();

    res.status(201).json({ message: 'Commande ajoutée avec succès', cmd: newCmd });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.post('/delete', async (req, res) => {
  try {
    const { id } = req.body;
    const cmd = await Cmd.findById(id);
    if (!cmd) return res.status(404).json({ message: 'Commande non trouvée' });
    await Cmd.findByIdAndDelete(id);
    res.status(200).json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.get('/get', async (req, res) => {
  try {
    const cmds = await Cmd.find({}).populate('prods.product', 'name mark price promo stock').populate('user', 'username email cmdsCount').lean();
    res.status(200).json(cmds);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await History.find({});
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.post('/validate', async (req, res) => {
  try {
    const { id } = req.body;
    const cmd = await Cmd.findById(id).populate('prods.product');
    if (!cmd) return res.status(404).json({ message: 'Commande non trouvée' });

    for (const item of cmd.prods) {
      if (item.product.stock < item.qtt) return res.status(400).json({ message: `Stock insuffisant pour ${item.product.name}` });
    }

    for (const item of cmd.prods) {
      item.product.stock -= item.qtt;
      item.product.buys += item.qtt;
      await item.product.save();
    }

    const newHistory = new History({
      user: cmd.user._id,
      prods: cmd.prods.map(p => ({
        id: p.product._id,
        name: p.product.name,
        mark: p.product.mark,
        price: p.product.price,
        promo: p.product.promo,
        stock: p.product.stock,
        qtt: p.qtt
      })),
      date: cmd.date,
      code: cmd.code
    });
    await newHistory.save();
    await Cmd.findByIdAndDelete(id);

    res.status(200).json({ message: 'Commande validée et déplacée dans l\'historique' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.post('/mail/validation', async (req, res) => {
    try {
      await connect();
      const { cmd } = req.body;
      if (!cmd.user.email) return res.status(400).json({ message: 'Email is required' });
  
      const user = await User.findOne({ email: cmd.user.email });
      if (!user) return res.status(404).json({ message: 'No user with this email' });
  
      const infos = await Infos.findOne({});
      const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        auth: {
          user: process.env.BREVO_USER,
          pass: process.env.BREVO_API,
        },
      });
  
      const pdfBuffer = await generateInvoicePDF(cmd, infos);
  
      await transporter.sendMail({
        from: process.env.BREVO_SENDER,
        to: cmd.user.email,
        subject: 'Confirmation de votre commande sur AMATON',
        text: `Votre code de commande est : ${cmd.code}. Une facture en PDF est jointe à cet email.`,
        html: `<p>Bonjour ${cmd.user.username}, votre commande est confirmée. Voici le code : ${cmd.code}</p>` ,
        attachments: [{
          filename: `Facture_${cmd.code}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        }],
      });
  
      res.status(200).json({ message: 'Email with invoice sent!' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
  });
  
  router.post('/mail/annulation', async (req, res) => {
    try {
      await connect();
      const { email, raison, infos } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'No user with this email' });
  
      const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        auth: {
          user: process.env.BREVO_USER,
          pass: process.env.BREVO_API,
        },
      });
  
      await transporter.sendMail({
        from: process.env.BREVO_SENDER,
        to: email,
        subject: 'Annulation de commande',
        html: `<p>Votre commande ${infos.code} a été annulée pour la raison suivante : ${raison}</p>`
      });
  
      res.status(200).json({ message: 'Annulation email sent!' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
  });
  
  const generateInvoicePDF = async (cmd, infos) => {
    return new Promise(async (resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      let buffers = [];
  
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
  
      doc.fontSize(25).text('Facture', 100, 80);
      doc.text(`Commande: ${cmd.code}`, 100, 130);
      doc.text(`Client: ${cmd.user.username}`, 100, 160);
  
      doc.moveDown();
  
      cmd.prods.forEach((item, index) => {
        doc.text(`${item.product.name} x ${item.qtt} - ${item.product.price} MAD`);
      });
  
      doc.text(`Total: ${cmd.total} MAD`, { underline: true });
      doc.end();
    });
  };

export default router;