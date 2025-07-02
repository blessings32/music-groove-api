import indexRouter from "./routes/indexRouter.mjs";
import express from "express";
import setAppLocals from "./config/locals.mjs";
import errorHandler from "./middleware/errohandler.mjs";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { join } from "path";
import dotenv from "dotenv";
import cors from "cors";
import https from "https";
import fs from "fs";
dotenv.config();
// Importing necessary modules and setting up the environment
const options = {
  key: fs.readFileSync("./ssl/server.key"),
  cert: fs.readFileSync("./ssl/server.cert"),
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "https://localhost",
    credentials: true,
  })
);
app.set("trust proxy", 1);
setAppLocals(app);

app.use(cookieParser(process.env.COOKIE_SIGN));
app.use(express.json());
app.get("/", (req, res) => {
  console.log("loading login app");
  res.sendFile(join(__dirname, "./public/login.html"));
});
app.use(express.static("public"));
app.use(indexRouter);

app.use(errorHandler);
https.createServer(options, app).listen(PORT, () => {
  console.log("listening on port 3000");
});
