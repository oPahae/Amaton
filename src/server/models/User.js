import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    country: { type: String, required: false },
    cart: [
      {
        id: mongoose.Schema.Types.ObjectId,
        name: { type: String, required: true },
        mark: { type: String, required: true },
        price: { type: Number, required: true },
        promo: { type: Number, default: 0 },
        stock: { type: Number, required: true },
        images: { type: [String], default: [] },
        date: { type: Date, default: Date.now },
        qtt: { type: Number, required: true },
      },
    ],
    cmdsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);