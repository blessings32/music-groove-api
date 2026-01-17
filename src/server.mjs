import appJS from "./app.mjs";
import express from "express";
import setAppLocals from "../config/locals.mjs";
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
const PORT = process.env.PORT || 3000;

setAppLocals(app);

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",      // frontend development server
  credentials: true,             // Allow cookies
//   optionsSuccessStatus: 200,
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(cookieParser(process.env.COOKIE_SIGN));
app.use(express.json());

app.get("/", (req, res) => {
  console.log("loading login app");
  res.sendFile(join(__dirname, "./public/login.html"));
});

app.use(express.static("public"));
app.use(appJS);
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`:-) using server.mjs app listening on port ${PORT}`);
});
