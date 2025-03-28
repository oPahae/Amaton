import mongoose from "mongoose";

// Modèle Commandes (Cmds)
const CmdsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Référence au modèle User
    required: true
  },
  prods: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prod", // Référence au modèle Prod
      required: true
    },
    qtt: { type: Number, required: true } // Quantité commandée
  }],
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  code: { type: String, required: true, unique: true }
});

export default mongoose.models.Cmd || mongoose.model("Cmd", CmdsSchema);
