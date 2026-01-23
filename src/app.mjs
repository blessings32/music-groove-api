import express from "express";
import { join } from "path";
//import buttonPressRouter from "./routes/buttonPressRouter.mjs";
//import playlistRouter from "./routes/playlistRouter.mjs";
//import libraryRouter from "./routes/libraryRouter.mjs";
import artists from "./routes/artists.mjs";
import suggestTracksRouter from "./routes/suggestTracks.mjs";
import setAppLocals from "../config/locals.mjs";
import userAuth from "./routes/userauth.mjs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import aunthenticateUser from "./controllers/aunthenticateUser.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const app = express();
setAppLocals(app);
router.get("/", (req, res) => {
  console.log("loading login app");
  res.sendFile(join(__dirname, "../public/login.html"));
});
router.use(userAuth);
router.use(aunthenticateUser);
router.use(artists);
// router.get("/home", (req, res) => {
//   console.log("loading home page");
//   res.sendFile(join(__dirname, "../public/indexrtx.html"));
// });
//router.use(libraryRouter);
//router.use(playlistRouter);
//router.use(buttonPressRouter);
router.use(suggestTracksRouter);

export default router;
