const { Player } = TextAliveApp;

const lyricEl = document.querySelector("#lyric");
const playBtn = document.querySelector("#play");
const pauseBtn = document.querySelector("#pause");
const stopBtn = document.querySelector("#stop");

const lyricX = 150;
var lyricY = 50;
var lastChar = null;
const delay = 1400; // Pour faire apparaitre les caracteres avant la musique

var charObjects = [];
const charSpeed = 4;

// Place le caractere au depart
lyricEl.style.position = "fixed";
lyricEl.style.left = `${window.innerWidth - lyricX}px`;

playBtn.disabled = true;
pauseBtn.disabled = true;
stopBtn.disabled = true;

const player = new Player({
    app: { token: "1O5BTRwWsXT6TfAP" },
    mediaElement: document.querySelector("#media"),
});

function createCharObject(char, x, y) {
    const div = document.createElement("div");
    div.textContent = char.text;
    div.style.position = "fixed";
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.style.fontSize = "7rem";
    div.style.color = "black";
    div.style.zIndex = "10";
    document.body.appendChild(div);

    const obj = { el: div, x: x, char: char.text };
    charObjects.push(obj);
    return obj;
}

function moveChars() {
    for (let i = 0 ; i < charObjects.length ; i++) {
        const obj = charObjects[i];
        obj.x -= charSpeed;
        obj.el.style.left = `${obj.x}px`;

        // On supprime le caractere quand il sort de l'écran
        if (obj.x < -100) {
            obj.el.remove();
            charObjects.splice(i, 1);
        }
    }

    requestAnimationFrame(moveChars);
}

requestAnimationFrame(moveChars);

player.addListener({
    onVideoReady(v) {
        console.log("Video ready —", v.charCount, "characters");
    },

    onTimerReady(timer) {
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
        const char = player.video.findChar(position + delay);

        if (char !== lastChar) {
            lastChar = char;
            if (char) {
                lyricY = Math.random() * (window.innerHeight - 100);
                createCharObject(char, window.innerWidth - lyricX, lyricY);
            }
        }
    },
});

// On charge la musique
player.createFromSongUrl("https://piapro.jp/t/PNpQ/20251209170719");

playBtn.addEventListener("click", () => player.requestPlay());
pauseBtn.addEventListener("click", () => player.requestPause());
stopBtn.addEventListener("click", () => player.requestStop());
