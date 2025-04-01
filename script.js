let session = null;
let mediaSession = null;
let currentVideoIndex = 0;
let volume = 0.1;
let isPlaying = false;

const videoList = [
  'https://transfertco.ca/video/DBillPrelude.mp4',
  'https://transfertco.ca/video/DBillSpotted.mp4',
  'https://transfertco.ca/video/usa23_7_02.mp4',
];

function sessionListener(newSession) {
  console.log("CurrentSession received");
  session = newSession;
  loadMedia(currentVideoIndex);
}

function receiverListener(availability) {
  console.log("Receveur disponible: ", availability);
}

function onInitSuccess() {
  console.log("Chromecast initialisé avec succès");
}

function onError(error) {
  console.log("Erreur: ", error);
}

function handlePower(onOUoff) {
  if (onOUoff) {
    console.log("allumer");
    const sessionRequest = new chrome.cast.SessionRequest(chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
    const apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);
    chrome.cast.initialize(apiConfig, onInitSuccess, onError);
  } else {
    console.log("off");
    if (session) session.stop();
  }
}

function loadMedia(index) {
  const mediaInfo = new chrome.cast.media.MediaInfo(videoList[index], 'video/mp4');
  const request = new chrome.cast.media.LoadRequest(mediaInfo);
  session.loadMedia(request, media => {
    console.log("Media chargé avec succès");
    mediaSession = media;
    isPlaying = true;
    updatePlayPauseButton();
  }, onError);
}

function prochaineVid() {
  currentVideoIndex = (currentVideoIndex + 1) % videoList.length;
  loadMedia(currentVideoIndex);
}

function precedenteVid() {
  currentVideoIndex = (currentVideoIndex - 1 + videoList.length) % videoList.length;
  loadMedia(currentVideoIndex);
}

function play() {
  if (mediaSession) {
    mediaSession.play();
    isPlaying = true;
    updatePlayPauseButton();
  } else {
    onError();
  }
}

function pause() {
  if (mediaSession) {
    mediaSession.pause();
    isPlaying = false;
    updatePlayPauseButton();
  } else {
    onError();
  }
}

function togglePlayPause() {
  if (isPlaying) {
    pause();
  } else {
    play();
  }
}

function mute() {
  if (mediaSession) {
    session.setReceiverMuted(true);
  } else {
    onError();
  }
}

function unmute() {
  if (mediaSession) {
    session.setReceiverMuted(false);
  } else {
    onError();
  }
}

function handleChangeVolume(newVolume) {
  session.setReceiverVolumeLevel(newVolume);
  volume = newVolume;
}

function augmenterVolume() {
  const newVol = Math.min(volume + 0.1, 1.0);
  handleChangeVolume(newVol);
}

function diminuerVolume() {
  const newVol = Math.max(volume - 0.1, 0.0);
  handleChangeVolume(newVol);
}

function updatePlayPauseButton() {
  const btn = document.getElementById("playPauseBtn");
  btn.textContent = isPlaying ? "⏸️ Pause" : "▶️ Play";
}
