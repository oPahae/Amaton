import mongoose from "mongoose";

// Modèle Feedback (Feedback)
const FeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Référence au modèle User
    required: true,
  },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// Création du modèle s'il n'existe pas déjà
export default mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);