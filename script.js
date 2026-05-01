const { Player } = TextAliveApp;

const lyricEl = document.querySelector("#lyric");
const playBtn = document.querySelector("#play");
const pauseBtn = document.querySelector("#pause");
const stopBtn = document.querySelector("#stop");

// On désactive avant 
playBtn.disabled = true;
pauseBtn.disabled = true;
stopBtn.disabled = true;

const player = new Player({
    app: { token: "1O5BTRwWsXT6TfAP" },
    mediaElement: document.querySelector("#media"),
});

player.addListener({
    onVideoReady(v) {
        console.log("Video ready —", v.charCount, "characters");
    },

    onTimerReady(timer) {
        // On active les boutons
        playBtn.disabled = false;
        pauseBtn.disabled = false;
        stopBtn.disabled = false;
    },

    onPlay() {
        playBtn.disabled = true;
        pauseBtn.disabled = false;
    },

    onPause() {
        playBtn.disabled = false;
        pauseBtn.disabled = true;
    },

    onStop() {
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        lyricEl.textContent = "";
    },

    onTimeUpdate(position) {
        // position est en millisecondes
        const char = player.video.findChar(position);
        lyricEl.textContent = char ? char.text : "";
    },
});

// On charge la musique
player.createFromSongUrl("https://piapro.jp/t/PNpQ/20251209170719");

playBtn.addEventListener("click", () => player.requestPlay());
pauseBtn.addEventListener("click", () => player.requestPause());
stopBtn.addEventListener("click", () => player.requestStop());