import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./lib/connect.js";

import auth from "./routes/auth.js";
import modules from "./routes/modules.js";
import ads from "./routes/ads.js";
import cats from "./routes/cats.js";
import cmds from "./routes/cmds.js";
import feedbacks from "./routes/feedbacks.js";
import infos from "./routes/infos.js";
import prods from "./routes/prods.js";
import user from "./routes/user.js";
import admin from "./routes/admin.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

connect();

app.use("/api/auth", auth);
app.use("/api/modules", modules);
app.use("/api/ads", ads);
app.use("/api/cats", cats);
app.use("/api/cmds", cmds);
app.use("/api/feedbacks", feedbacks);
app.use("/api/infos", infos);
app.use("/api/prods", prods);
app.use("/api/user", user);
app.use("/api/admin", admin);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});