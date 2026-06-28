# Magical Mirai 2026 Programming Contest : UTCode 2026

Submission for the **Magical Mirai 2026 Programming Contest** using the [TextAlive App API](https://developer.textalive.jp/).  

---

## How to launch

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

## Controls

Space bar / Mouse button / Touch: changes the paddle's direction
**Time it on incoming characters with a halo around them**

## Browser compatibility

- Chrome 115+ - Fully supported (recommended) 
- Firefox 115+ - Fully supported 
- Safari - Not tested ! 
- Mobile browsers - Supported 

## Song Compatibility
This app has been mostly tested for the song *The Last March on Earth* (https://piapro.jp/t/B3yJ, by Natsuyama Yotsugi × Dopam!ne). 
However, it is easy to change the played song by simply changing the link on top of the settings in app.js (api/songUrl). 
To get a link to a song, you must go on TextAlive's website https://textalive.jp/songs. 

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

Contact : pichou.l.acarien@gmail.com