import { readFileSync } from "fs";

const favartistTemp = readFileSync("./html_template/favourite.html", "utf-8");
const defaultTemp = readFileSync(
  "./html_template/default_template.html",
  "utf-8"
);
const nowPlayingList = readFileSync(
  "./html_template/now_playing_template.html",
  "utf-8"
);
const playlistsHTMLFile = readFileSync(
  "./html_template/playlists_for_writeme.html",
  "utf-8"
);

const artistsHTMLFile = readFileSync("./html_template/artists.html", "utf-8");
const albumTracksHTMLFile = readFileSync(
  "./html_template/album_songs.html",
  "utf-8"
);
const albumTracksTrHTMLFile = readFileSync(
  "./html_template/album_songs_tr.html",
  "utf-8"
);
const metroSpider = readFileSync("./json/metro_spiderman_album.json", "utf-8");
const metroSpiderJSONObject = JSON.parse(metroSpider);
const albumHTMLFile = readFileSync("./html_template/albums.html", "utf-8");
const nowPlayingHTMLFile = readFileSync("./now_playing_list.html", "utf-8");
//const index = readFileSync("./index.html", "utf-8");
const feedTemp = readFileSync("./html_template/feed_tamplate.html", "utf-8");
const songsJson = readFileSync("./json/songs.json", "utf-8");
const homePlaylist = JSON.parse(songsJson);
const recentTemp = readFileSync(
  "./html_template/recent_template.html",
  "utf-8"
);
const recentJson = readFileSync("./json/recent.json", "utf-8");
const recentPlaylist = JSON.parse(recentJson);
const newSongs = readFileSync("./json/new_songs.json", "utf-8");
const newSongsPlaylist = JSON.parse(newSongs);
const playlist = readFileSync("./html_template/playlist.html", "utf-8");
const playlistJson = readFileSync("./json/playlist.json", "utf-8");
const playlistJsonObj = JSON.parse(playlistJson);
const artistProfileHTMLFile = readFileSync(
  "./html_template/artist_profile.html",
  "utf-8"
);
const artistProfilePopular = readFileSync(
  "./html_template/artist-profile/popular-release.html",
  "utf-8"
);
const artistProfileLatest = readFileSync(
  "./html_template/artist-profile/latest-release.html",
  "utf-8"
);
const artistProfileDiscovery = readFileSync(
  "./html_template/artist-profile/discovery.html",
  "utf-8"
);
const artistProfileAlbum = readFileSync(
  "./html_template/artist-profile/album.html",
  "utf-8"
);
const saintJhn = readFileSync("./json/saint-jhns-profile.json", "utf-8");
const saintJhnProfile = JSON.parse(saintJhn);

let indexR = "";
let playlistLength = 0;
let currentPlaylist = "";
export default function setAppLocals(app) {
  app.locals.artistProfileDiscovery = artistProfileDiscovery;
  app.locals.artistProfileAlbum = artistProfileAlbum;
  app.locals.artistProfileLatest = artistProfileLatest;
  app.locals.artistProfilePopular = artistProfilePopular;
  app.locals.saintJhnProfile = saintJhnProfile;
  app.locals.playlistLength = playlistLength;
  app.locals.recentPlaylist = recentPlaylist;
  app.locals.currentPlaylist = currentPlaylist;
  app.locals.artistsHTMLFile = artistsHTMLFile;
  app.locals.albumHTMLFile = albumHTMLFile;
  app.locals.homePlaylist = homePlaylist;
  app.locals.playlistJsonObj = playlistJsonObj;
  app.locals.albumTracksHTMLFile = albumTracksHTMLFile;
  app.locals.albumTracksTrHTMLFile = albumTracksTrHTMLFile;
  app.locals.metroSpiderJSONObject = metroSpiderJSONObject;
  app.locals.playlist = playlist;
  app.locals.newSongsPlaylist = newSongsPlaylist;
  app.locals.recentTemp = recentTemp;
  app.locals.feedTemp = feedTemp;
  app.locals.favartistTemp = favartistTemp;
  app.locals.indexR = indexR;
  app.locals.playlistsHTMLFile = playlistsHTMLFile;
  app.locals.nowPlayingList = nowPlayingList;
  app.locals.defaultTemp = defaultTemp;
  app.locals.nowPlayingHTMLFile = nowPlayingHTMLFile;
  app.locals.artistProfileHTMLFile = artistProfileHTMLFile;
}
