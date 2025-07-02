// === Audio Player & UI Logic ===
// This file handles music playback, playlist navigation, and dynamic UI updates for the music app.

// --- DOM ELEMENTS ---
const audio = document.getElementById("music");
const playButton = document.querySelector(".btn_play");
const repeatButton = document.querySelector(".repeat");
const shuffleButton = document.querySelector(".shuffle");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const seek = document.querySelector(".moving_bar");
const seekContainer = document.querySelector(".progress_bar");
const elapsedMinute = document.querySelector(".elapesd_minutes");
const elapsedSecond = document.querySelector(".elapsed_seconds");
const trackLenth = document.querySelector(".track_length");
const title = document.querySelector(".playing_song_title");
const artistSpan = document.querySelector(".playing_song_artist");
const writeMe = document.querySelector(".writeMe");
const libraryButton = document.querySelector(".library");
const homeButton = document.querySelector(".home_navigation");
const playlistButtonInLibrary = document.querySelectorAll(".first");
const playingArtwork = document.querySelector(".img-artwork");
const ngrok = "https://localhost:3000/";
// --- HTTP POST Helper ---
// Used for all backend communication. Handles 401 (unauthorized) by redirecting to login.
const httpPostRequster = (type, body, bodyType = "text") => {
  let address = (ngrok || "http://localhost:3000/") + type;
  let payload =
    bodyType === "text"
      ? { bodyContent: body, timestamp: new Date().toISOString() }
      : body;
  return fetch(address, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (response.status === 401) {
        window.location.href = "/"; // Not logged in, go to login page
        return Promise.reject("Redirected to login page");
      }
      return response.json();
    })
    .catch(console.log);
};

// Add this at the end of audio.mjs

// Function to set loading="lazy" on all images
function setLazyLoading(img) {
  if (!img.hasAttribute("loading")) {
    img.setAttribute("loading", "lazy");
  }
}

// Set lazy loading for all images initially
document.querySelectorAll("img").forEach(setLazyLoading);

// Observe DOM changes for dynamically added images
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.tagName === "IMG") setLazyLoading(node);
      if (node.querySelectorAll) {
        node.querySelectorAll("img").forEach(setLazyLoading);
      }
    });
  });
});
observer.observe(document.body, { childList: true, subtree: true });

// --- Playlist and UI Helpers ---
function setPlaylist(playl) {
  // Tells backend to set the current playlist
  httpPostRequster("playlist", playl).then(console.log).catch(console.log);
}

function setRoader(playlistName) {
  // Loads playlist content into the main UI area
  httpPostRequster("api/buttonPress/setplaylist", playlistName)
    .then((data) => {
      writeMe.innerHTML = data;
    })
    .catch(console.log);
}

// Converts seconds to MM:SS format for display
function SecondsToMinuteFull(seconds) {
  let minutes = Math.floor(seconds / 60);
  let secs = String(Math.floor(seconds % 60)).padStart(2, "00");
  return `${minutes}:${secs}`;
}

// --- Audio Player State ---
const playIcon = document.querySelector(".fa-play");
let playState = 0; // 0 = paused, 1 = playing
let loopMood = "default";
let index = 0;

// --- Playback Controls ---
function previous() {
  // Go to previous track in playlist
  httpPostRequster("api/buttonPress/controls", "buttonClicked").then((data) => {
    if (index < 0) index = data["length"] - 1;
    audio.src = data["playlist"][index]["location"];
    title.innerText = data["playlist"][index]["title"];
    artistSpan.innerText = data["playlist"][index]["artist"];
    audio.play();
    --index;
  });
}

function next_() {
  // Go to next track in playlist
  httpPostRequster("api/buttonPress/controls", "buttonClicked").then((data) => {
    if (index > data["length"] - 1) return (index = 0);
    audio.src = data["playlist"][index]["location"];
    title.innerText = data["playlist"][index]["title"];
    artistSpan.innerText = data["playlist"][index]["artist"];
    audio.play();
    ++index;
  });
}

function play_(
  source = "./Music/bankrol/Bankrol_Hayden_-_No_Drama.mp3",
  el = false
) {
  // Play or pause the current track
  audio.src =
    typeof source === "string"
      ? source
      : "./Music/bankrol/Bankrol_Hayden_-_No_Drama.mp3";
  audio.addEventListener(
    "loadedmetadata",
    () => {
      trackLenth.innerText = SecondsToMinuteFull(audio.duration);
    },
    { once: true }
  );

  // If a track element is provided, log the play to backend
  if (el) {
    httpPostRequster(
      "api/buttonPress/controls/recentplays",
      { trackId: el.dataset.trackId },
      "rawData"
    ).catch(console.log);
  }
  setPlaylist("homePlaylist");

  // Toggle play/pause
  if (playState === 0) {
    audio.play();
    playIcon.classList.replace("fa-play", "fa-pause");
    playState = 1;
  } else {
    playIcon.classList.replace("fa-pause", "fa-play");
    audio.pause();
    playState = 0;
  }
}

function playSelected(el) {
  // Play a specific track from the UI
  setPlaylist("homePlaylist");
  title.innerText = el.dataset.title;
  console.log(playingArtwork);
  playingArtwork.setAttribute("src", el.dataset.artwork);
  artistSpan.innerText = el.dataset.artist;
  play_(el.dataset.trackPath, el);
  playState = 0;
}

// --- INITIALIZATION ---
// Load default playlist on page load
document.addEventListener("DOMContentLoaded", () => {
  setRoader("default");
  console.log("body loaded");
});

// --- UI BUTTON EVENTS ---
libraryButton.addEventListener("click", () => setRoader("recentSongs"));
homeButton.addEventListener("click", () => setRoader("default"));
playButton.addEventListener("click", play_);
prevButton.addEventListener("click", previous);
nextButton.addEventListener("click", next_);

// --- AUDIO EVENTS ---
// Update progress bar and time display as audio plays
audio.addEventListener("timeupdate", () => {
  seek.style.width = (audio.currentTime * 100) / audio.duration + "%";
  elapsedSecond.innerText = String(Math.floor(audio.currentTime % 60)).padStart(
    2,
    "00"
  );
  elapsedMinute.innerText = String(Math.floor(audio.currentTime / 60));
});

// When a track ends, go to next or previous depending on loop mode
audio.addEventListener("ended", () => {
  loopMood == "default" ? next_() : previous();
});

// Allow user to seek by clicking the progress bar
seekContainer.addEventListener("click", (e) => {
  audio.currentTime = (e.offsetX / seekContainer.offsetWidth) * audio.duration;
});

// --- MAIN CLICK HANDLER ---
// Handles sidebar navigation, playlist, album, and artist clicks
document.addEventListener("click", (el) => {
  const writeMeInLibray = document.querySelector(".write_me_in_libray");

  // Sidebar navigation (Playlists, Artist, Albums, Liked)
  if (el.target.matches(".first1") || el.target.matches(".first3")) {
    let targetInnerText = (
      el.target.closest(".first1") || el.target.closest(".first3")
    ).innerText.toLowerCase();
    // Highlight selected sidebar item
    document.querySelector(".first3").classList.replace("first3", "first1");
    el.target.closest(".first1").classList.replace("first1", "first3");

    console.log("Sidebar clicked:", targetInnerText);

    // Load the correct section
    if (targetInnerText === "playlists") {
      console.log("Loading playlists section");
      httpPostRequster("api/library/playlist", targetInnerText).then(
        (data) => (writeMeInLibray.innerHTML = data)
      );
    } else if (targetInnerText === "artist") {
      console.log("Loading artist section");
      httpPostRequster("api/library/artist/", targetInnerText).then(
        (data) => (writeMeInLibray.innerHTML = data)
      );
    } else if (targetInnerText === "albums") {
      console.log("Loading albums section");
      httpPostRequster("api/library/album", targetInnerText).then(
        (data) => (writeMeInLibray.innerHTML = data)
      );
    }
    // If "Liked" playlist, set and load it
    if (targetInnerText.includes("liked")) {
      const targetBtn = el.target.closest("[data-playlist]");
      if (targetBtn) {
        let playlist = targetBtn.dataset.playlist;
        console.log("Loading liked playlist:", playlist);
        setPlaylist(playlist);
        setRoader(playlist);
      }
    }
  }

  // Playlist items (outside sidebar)
  if (el.target.matches(".first")) {
    const targetBtn = el.target.closest("[data-playlist]");
    if (targetBtn) {
      let playlist = targetBtn.dataset.playlist;
      console.log("Playlist item clicked:", playlist);
      setPlaylist(playlist);
      setRoader(playlist);
    }
  }

  // Album track links
  //   if (el.target.matches(".title_artist_a")) {
  //     const value = el.target.closest(".title_artist_a").innerText;
  //     if (value) {
  //       console.log("Album track clicked:", value);
  //       httpPostRequster("api/library/albums/tracks/", value).then(
  //         (data) => (writeMeInLibray.innerHTML = data)
  //       );
  //     }
  //   }

  // Artist profile links
  if (
    el.target.closest(".library-artist-span") ||
    el.target.matches(".title_artist_anchor")
  ) {
    console.log("Artist profile link clicked");

    const elArtist =
      el.target.closest(".library-artist-span") ||
      el.target.closest(".title_artist_anchor");
    const target = elArtist.innerText.replace(/\t/g, "").trim().toLowerCase();
    if (el.target.matches(".title_artist_anchor")) {
      const writeMeInLibray = document.querySelector(".write_me_in_libray");
      setRoader("mock");
      return setTimeout(() => {
        const writeMeInLibray = document.querySelector(".write_me_in_libray");
        httpPostRequster("api/library/artist/profile/", target).then((data) => {
          writeMeInLibray.innerHTML = data;
        });
      }, 100);
      // console.log("Artist profile link clicked:", target);
      // httpPostRequster(
      //   "api/buttonPress/setplaylist",
      //   { type: "globalArtist", artist: target },
      //   "rawData"
      // ).then((data) => {
      //   console.log("Artist profile data:", data);
      //   return httpPostRequster(data.urlRedirect, target).then((data) => {
      //     writeMeInLibray.innerHTML = data;
      //   });
      // });
    }
    if (target) {
      httpPostRequster("api/library/artist/profile", target).then((data) => {
        writeMeInLibray.innerHTML = data;
      });
    }
  }
  // album click handling
  if (
    el.target.matches(".album-link") ||
    el.target.matches(".title_artist_a")
  ) {
    let imageForAlbum =
      el.target.closest(".album-link") || el.target.closest(".title_artist_a");
    console.log(imageForAlbum.dataset.id);
    httpPostRequster(
      "api/library/albums/tracks/",
      { id: imageForAlbum.dataset.id },
      "rawData"
    ).then((data) => {
      writeMeInLibray.innerHTML = data;
    });
  }

  // Play track button (either from playlist or search)
  if (
    el.target.matches(".play_track") ||
    el.target.matches(".play_trackk") ||
    el.target.matches(".fa-play-selected")
  ) {
    let ell =
      el.target.closest(".play_track") || el.target.closest(".play_trackk");
    console.log("Play button clicked for track:", ell?.dataset?.title);
    playSelected(ell);
  }
});
