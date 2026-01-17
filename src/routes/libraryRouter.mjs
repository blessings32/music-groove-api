import { Router } from "express";
import { templateReplacer } from "../utils.mjs";
import {
  getArtistPofile,
  getHomePlaylist,
  getAlbums,
  getAlbumById,
  getArtists,
} from "../database.mjs";
const router = Router();

router.post("/api/library/artist/*", async (req, res) => {
  console.log("loading artist library routes id: ", req.user);
  try {
    const {
      artistProfileHTMLFile,
      artistsHTMLFile,

      artistProfilePopular,
      artistProfileLatest,
      artistProfileDiscovery,
      artistProfileAlbum,
    } = req.app.locals;
    //need to change it later
    const homePlaylist = await getHomePlaylist();
    const artists = await getArtists();
    let replacedTemplate = "";
    console.log(req.url);
    if (req.url == "/api/library/artist/profile/") {
      let body = req.body;

      body = body["bodyContent"];
      let saintJhnProfile = await getArtistPofile(body);
      let popular = templateReplacer(saintJhnProfile[1], artistProfilePopular);
      let latest = templateReplacer(saintJhnProfile[2], artistProfileLatest);

      let album = templateReplacer(saintJhnProfile[4], artistProfileAlbum);
      let discovery = templateReplacer(
        saintJhnProfile[3],
        artistProfileDiscovery
      );
      let x = templateReplacer(saintJhnProfile[0], artistProfileHTMLFile);
      x = x.replace("{%ALBUMS%}", album);
      x = x.replace("{%POPULAR%}", popular);
      x = x.replace("{%LATESTRELEASE%}", latest);
      x = x.replace("{%DISCOVERY%}", discovery);
      replacedTemplate = x;
    } else if (req.url == "/api/library/artist/") {
      replacedTemplate = templateReplacer(artists, artistsHTMLFile);
    }

    replacedTemplate =
      "<div class='playlist-div-container'>" + replacedTemplate + "</div>";
    res.status(200).send(JSON.stringify(replacedTemplate));
  } catch (error) {
    console.error("Error in /api/library/artist/*:", error);
  }
});

router.post("/api/library/*", async (req, res) => {
  try {
    const {
      playlistJsonObj,
      playlistsHTMLFile,
      homePlaylist,
      albumHTMLFile,
      albumTracksHTMLFile,
      albumTracksTrHTMLFile,
    } = req.app.locals;
    let replacedTemplate = "";
    console.log(req.url);

    const albums = await getAlbums();
    if (req.url == "/api/library/albums/tracks/") {
      const albumId = Number(req.body.id);
      console.log("album id:", req.body["id"]);
      const albumFromdb = await getAlbumById(albumId);
      //let body = req.body;
      let albumTracksHTMLFileReplaced = templateReplacer(
        albumFromdb[0],
        albumTracksHTMLFile
      );
      let tracks = templateReplacer(albumFromdb[1], albumTracksTrHTMLFile);
      albumTracksHTMLFileReplaced = albumTracksHTMLFileReplaced.replace(
        /{%SONGS%}/g,
        tracks
      );
      return res.status(200).send(JSON.stringify(albumTracksHTMLFileReplaced));
    } else if (req.url == "/api/library/playlist") {
      replacedTemplate = templateReplacer(playlistJsonObj, playlistsHTMLFile);
    } else if (req.url == "/api/library/album") {
      replacedTemplate = templateReplacer(albums, albumHTMLFile);
    }
    replacedTemplate =
      "<div class='playlist-div-container'>" + replacedTemplate + "</div>";
    res.status(200).send(JSON.stringify(replacedTemplate));
  } catch (error) {
    console.error("Error in /api/library/*:", error);
  }
});
export default router;
