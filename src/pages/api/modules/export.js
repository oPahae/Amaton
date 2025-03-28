import connect from '../_lib/connect';
import Prod from '../_models/Prod';
import Cat from '../_models/Cat';
import Cmd from '../_models/Cmd';
import User from '../_models/User';
import { Parser } from 'json2csv';
import XLSX from 'xlsx';
import PDFDocument from 'pdfkit';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '99999mb',
    },
  },
};

export default async function handler(req, res) {
  await connect();

  if (req.method === 'GET') {
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

    return res.status(400).json({ message: 'Format non supporté (JSON, CSV, Excel, PDF seulement)' });
  }

  res.status(405).json({ message: 'Méthode non autorisée' });
}
