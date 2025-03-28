import bcrypt from "bcryptjs";
import connect from "../_lib/connect";
import Admin from "../_models/Admin";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "1111";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Missing infos" });
  }

  try {
    await connect();

    const admin = await Admin.findOne({});
    if (!admin) {
      return res.status(404).json({ message: "Admin not found!" });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Password incorrect!" });
    }

    // Générer un jeton JWT
    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // Enregistrer le jeton dans un cookie
    const serialized = serialize("AdminAuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: "/",
    });

    res.setHeader("Set-Cookie", serialized);
    return res.status(200).json({ message: "Logged In Successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
}