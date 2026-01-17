import { Router } from "express";
import { templateReplacer } from "../utils.mjs";
import {
  getHomePlaylist,
  getNewTracks,
  getArtists,
  setRecentPlay,
  getRecentPlay,
  getAllTracks,
} from "../database.mjs";
const router = Router();
router.post("/api/buttonPress/controls", async (req, res) => {
  try {
    let { currentPlaylist, playlistLength } = req.app.locals;
    let recentPlaylist = await getRecentPlay(req.user);
    let newSongsPlaylist = await getNewTracks();
    let homePlaylist = await getHomePlaylist();
    switch (currentPlaylist) {
      case "homePlaylist":
        playlistLength = homePlaylist.length;
        res.status(200).send(
          JSON.stringify({
            playlist: homePlaylist,
            length: playlistLength,
          })
        );
        break;
      case "recentPlaylist":
        playlistLength = recentPlaylist.length;
        res.status(200).send(
          JSON.stringify({
            playlist: recentPlaylist,
            length: playlistLength,
          })
        );
        break;
      case "newSongsPlaylist":
        playlistLength = newSongsPlaylist.length;
        res.status(200).send(
          JSON.stringify({
            playlist: newSongsPlaylist,
            length: playlistLength,
          })
        );
        break;
      default:
        playlistLength = homePlaylist.length;
        res.status(200).send(
          JSON.stringify({
            playlist: homePlaylist,
            length: playlistLength,
          })
        );
        break;
    }
  } catch (error) {
    console.error("Error in /api/buttonPress/controls:", error);
  }
});
router.post("/api/buttonPress/controls/recentplays", (req, res) => {
  try {
    const trackId = req.body;
    const userId = Number(req.user);
    console.log(trackId);
    setRecentPlay(userId, trackId.trackId);
  } catch (err) {
    console.log("recent plays error:", err);
  }
});
router.post("/api/buttonPress/setplaylist", async (req, res) => {
  try {
    let {
      feedTemp,
      nowPlayingList,
      recentTemp,
      favartistTemp,
      playlistJsonObj,
      nowPlayingHTMLFile,
      playlist,
      defaultTemp,
    } = req.app.locals;
    let recentPlaylist = await getRecentPlay(req.user);
    let artists = await getArtists();
    let alltracks = await getAllTracks();
    let newSongsPlaylist = await getNewTracks();
    let homePlaylist = await getHomePlaylist();
    let parsedBody = req.body;
    let bodyContent = parsedBody["bodyContent"];

    bodyContent = bodyContent.toLowerCase();
    if (bodyContent === "default") {
      let indexR = defaultTemp.replace(
        "{%FEEDMUSIC%}",
        templateReplacer(homePlaylist, feedTemp)
      );

      indexR = indexR.replace(
        "{%RECENTMUSIC%}",
        templateReplacer(recentPlaylist, recentTemp)
      );

      indexR = indexR.replace(
        "{%NEWMUSIC%}",
        templateReplacer(newSongsPlaylist, recentTemp)
      );

      indexR = indexR.replace(
        "{%FAVARTIST%}",
        templateReplacer(artists, favartistTemp)
      );

      indexR = indexR.replace(
        "{%PLAYLIST%}",
        templateReplacer(playlistJsonObj, playlist)
      );
      res.status(200).send(JSON.stringify(indexR));
    } else if (bodyContent === "recentsongs") {
      let replacedTemplate = templateReplacer(alltracks, nowPlayingList);
      let nowPLayingFileRelaced = nowPlayingHTMLFile.replace(
        "{%SONGS%}",
        replacedTemplate
      );
      res.status(200).send(JSON.stringify(nowPLayingFileRelaced));
    } else if (bodyContent === "homeplaylist") {
      let replacedTemplate = templateReplacer(homePlaylist, nowPlayingList);
      let nowPLayingFileRelaced = nowPlayingHTMLFile.replace(
        "{%SONGS%}",
        replacedTemplate
      );
      res.status(200).send(JSON.stringify(nowPLayingFileRelaced));
    } else if (bodyContent === "newsongsplaylist") {
      let replacedTemplate = templateReplacer(newSongsPlaylist, nowPlayingList);
      let nowPLayingFileRelaced = nowPlayingHTMLFile.replace(
        "{%SONGS%}",
        replacedTemplate
      );
      res.status(200).send(JSON.stringify(nowPLayingFileRelaced));
    } else if (bodyContent === "recentplaylist") {
      let replacedTemplate = templateReplacer(recentPlaylist, nowPlayingList);
      let nowPLayingFileRelaced = nowPlayingHTMLFile.replace(
        "{%SONGS%}",
        replacedTemplate
      );
      res.status(200).send(JSON.stringify(nowPLayingFileRelaced));
    } else if (bodyContent === "mock") {
      let replacedTemplate = " ";
      let nowPLayingFileRelaced = nowPlayingHTMLFile.replace(
        "{%SONGS%}",
        replacedTemplate
      );
      res.status(200).send(JSON.stringify(nowPLayingFileRelaced));
    }
  } catch (error) {
    console.error("Error in /api/buttonPress/setplaylist:", error);
  }
});
export default router;
