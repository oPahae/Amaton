import mongoose from "mongoose";

// Modèle Informations (Infos)
const InfosSchema = new mongoose.Schema({
  tel: { type: String, required: true },
  email: { type: String, required: true },
  about: { type: String, required: true },
  facebook: { type: String, required: true },
  instagram: { type: String, required: true },
  linkedin: { type: String, required: true },
  github: { type: String, required: true },
  cih: { type: String, required: true },
  paypal: { type: String, required: true },
  website: { type: String, required: true },
});

export default mongoose.models.Info || mongoose.model("Info", InfosSchema);