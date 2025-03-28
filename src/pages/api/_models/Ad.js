import mongoose from "mongoose";

// Modèle Publicités (Ads)
const AdSchema = new mongoose.Schema({
  img: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Ad || mongoose.model("Ad", AdSchema);