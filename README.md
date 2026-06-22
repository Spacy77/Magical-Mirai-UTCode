# Magical Mirai 2026 Programming Contest : UTCode 2026

A rhythm game built for the **Magical Mirai 2026 Programming Contest** using the [TextAlive App API](https://developer.textalive.jp/).  
Lyrics fall from the right side of the screen in time with the music. The player controls a catcher bar to intercept each character as it arrives.

---

## How to launch

**The only requirement is a local HTTP server.** Opening `index.html` directly via `file://` will not work because the browser blocks cross-origin requests needed by the TextAlive API and the FFT data file.

### Quickest method : VS Code Live Server

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code.
2. Right-click `index.html` → **Open with Live Server**.
3. The game opens at `http://127.0.0.1:5500` (or similar).

### Alternative : Python

```bash
# Python 3
python -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

### Alternative : Node.js

```bash
npx serve .
```

---

## Browser compatibility

Chrome 115+ - Fully supported (recommended)
Firefox 115+ - Fully supported
Safari - Not tested !
Mobile browsers - ⚠️ Not designed for touchscreens

**Internet connection is required** : the TextAlive API, Phaser, and font assets are loaded from CDN at runtime.

---

## Controls

Space bar : changes the paddle's direction
Time it on incoming characters with a halo around them

---

## Project structure

```
index.html          : entry point
src/
  app.js            : all game logic (single file)
  styles.css        : minimal layout CSS
media/
  fft-data.json     : pre-computed FFT data for the music visualizer
tools/
  generate-fft.html : offline tool used to generate fft-data.json
  README.md         : instructions for regenerating FFT data
```

Please do not delete :
```bash
# https://www.reddit.com/r/ffmpeg/comments/pn383s/command_line_for_transcoding_mp4_to_prores/
ffmpeg -i mikusite_lelad1080p.avi -c:v prores_ks -profile:v standard -pix_fmt yuv422p -c:a copy out.mov
ffmpeg -framerate 24 -start_number 0 -i "$HOME/Downloads/out2_%05d.png" -i "$HOME/Downloads/out.mov" \
  -map 0:v:0 -map "1:a:0?" \
  -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 \
  -b:v 0 -crf 30 -row-mt 1 \
  -c:a libopus -b:a 128k \
  -shortest "$HOME/Downloads/out.webm"
```