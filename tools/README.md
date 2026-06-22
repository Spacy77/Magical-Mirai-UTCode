# FFT Pre-Computer

Generates `fft-data.json` for the Magical Mirai music visualizer.  
No Node.js, no server, no dependencies — just open in a browser.

## Why this exists

TextAlive streams audio from Songle.jp, which has no CORS headers.  
Every real-time Web Audio API path is blocked by the browser's security model.  
This tool analyzes the audio file **offline** and stores the FFT data as JSON.  
During gameplay the visualizer reads that data by playback position — zero CORS involved.

---

## Steps

### 1. Open the tool

Double-click `tools/generate-fft.html` or drag it into Chrome / Firefox.  
No internet connection required.

### 2. Get the audio file

1. Open the Piapro song page in a browser tab.
2. Download the audio file as .mp3

### 3. Configure settings

| Setting      | Default | Rule                                                   |
|--------------|---------|--------------------------------------------------------|
| `intervalMs` | `50`    | Frame stride in ms. 50 ms = 20 fps of bar data.       |
| `numBars`    | `15`    | **Must match** `gameSettings.visualizer.numBars` in `src/app.js`. |
| `fftSize`    | `2048`  | Power of 2 (512 / 1024 / 2048 / 4096). 2048 is fine.  |

### 4. Generate

1. Click **Choose File** and select the downloaded audio file.
2. Click **Generate fft-data.json**.
3. Watch the two-pass progress bar (pass 1 scans peak levels, pass 2 builds bar data).
4. Processing takes ~5–30 seconds depending on song length and your machine.
5. The browser downloads `fft-data.json` automatically when done.

### 5. Deploy

Move `fft-data.json` into `media/`:

```
Magical-Mirai-UTCode/
└── media/
    └── fft-data.json   ← place it here
```

### 6. Enable in the app

Open `src/app.js` and change `fftDataUrl` in `gameSettings.api`:

```javascript
fftDataUrl: "media/fft-data.json",
```

### 7. Run the game

Open `index.html` via a local server (e.g. VS Code Live Server, `npx serve .`).  
The console will print:

```
[Visualizer] Pre-computed FFT loaded: 5040 frames, 252.0s
```

The visualizer bars will now animate in sync with the actual audio frequencies.

---

## Notes

- **File size**: ~2–3 MB for a 4-minute song at 50 ms / 15 bars.
- **Regenerate** if you change `numBars` in `app.js` (settings must match exactly).
- **Frequency scale**: bars use logarithmic spacing (20 Hz – 20 kHz), matching human hearing.
- **Normalization**: the loudest moment in the song maps to 255; all other levels are proportional.
- The tool loads `fft.js` from jsDelivr on first open (requires internet). Subsequent runs use the browser cache.
