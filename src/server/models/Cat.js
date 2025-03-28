import mongoose from "mongoose";

// Modèle Catégories (Cat)
const CatSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subcats: [{
    id: mongoose.Schema.Types.ObjectId,
    name: String,
  }],
  img: { type: String, required: true },
});

export default mongoose.models.Cat || mongoose.model("Cat", CatSchema);