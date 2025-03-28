import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "1111";

export function verifyAuth(req, res) {
  const token = req.cookies?.AdminAuthToken;

  if (!token) {
    return null;
  }

  try {
    const admin = jwt.verify(token, JWT_SECRET);
    return { id: admin.id, username: admin.username };
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}