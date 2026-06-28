# Magical Mirai 2026 Programming Contest : UTCode 2026

Submission for the **Magical Mirai 2026 Programming Contest** using the [TextAlive App API](https://developer.textalive.jp/).  
Lyrics fall from the right side of the screen in time with the music. The player controls a catcher bar to intercept each character as it arrives. 

---

## How to launch

No backend server, Python script, or generated FFT JSON is required. The music visualizer is driven directly by TextAlive song-map signals in the browser.

Opening `index.html` directly can work in permissive browser setups. If your browser blocks TextAlive/CDN/local media from `file://`, serve the folder with any tiny static HTTP server.

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


## Browser compatibility

Chrome 115+ - Fully supported (recommended)
Firefox 115+ - Fully supported
Safari - Not tested !
Mobile browsers - Supported

**Internet connection is required** : the TextAlive API, Phaser, and font assets are loaded from CDN at runtime.

## Controls

Space bar : changes the paddle's direction
Time it on incoming characters with a halo around them

## Known bugs

For some TextAlive songs, there seem to exist a big offset between the timemarks from TextAlive API and the actual time the word is sung.
We are sadly powerless against this issue. If you encounter it, please switch songs.

## Credits
This submission is by UTCode, a computer science association of the Université Technologique de Compiègne (French university)
LeLad (intro animation)
Galaxy77 (pixel art)
PouchyCorp (programming)
Alixz (programming)
Spacy (programming)