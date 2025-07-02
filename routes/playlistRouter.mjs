import { Router } from "express";
const router = Router();

router.post("/playlist", (req, res) => {
  try {
    let currentPlaylist = req.app.locals.currentPlaylist;
    let body = req.body;
    const parsedData = body;
    req.app.locals.currentPlaylist = parsedData["bodyContent"].toString();
    res.status(200).send(JSON.stringify("playlist set"));
  } catch (err) {
    console.error("Error setting playlist:", err);
  }
});

export default router;
