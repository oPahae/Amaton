import mongoose from "mongoose";

// Modèle Produit (Prod)
const ProdSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mark: { type: String, required: true },
  price: { type: Number, required: true },
  promo: { type: Number, default: 0 },
  stock: { type: Number, required: true },
  cat: { type: String, required: true },
  subcat: { type: String, required: true },
  images: { type: [String], default: [] },
  rating: { type: Number, default: 0 },
  descr: { type: String, required: false },
  date: { type: Date, default: Date.now },
  buys: { type: Number, default: 0 },
  cmnts: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      content: { type: String, required: true },
      rating: { type: Number, default: 5 },
    },
  ],
});

export default mongoose.models.Prod || mongoose.model("Prod", ProdSchema);