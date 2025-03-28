import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Référence au modèle User
      required: true
    },
    prods: [
      {
        id: String,
        name: String,
        mark: String,
        price: Number,
        promo: Number,
        stock: Number,
        qtt: Number,
      },
    ],
    date: String,
    code: { type: String, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.History || mongoose.model("History", HistorySchema);