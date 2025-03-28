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
    if (req.method === 'POST') {
        await connect()
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

            const modelKeys = Object.keys(Model.schema.paths);

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
    }
}