import mongoose from "mongoose";

// Modèle Admin (Admin)
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);