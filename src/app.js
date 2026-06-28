const gameSettings = {
    // -- TextAlive API --------------------------------------------------------
    api: {
        token: "1O5BTRwWsXT6TfAP",
        songUrl: "https://piapro.jp/t/B3yJ/20251215061727", // go to textAlive website to find the link, it is not directly on piapro
    },
    // Volume sent to the TextAlive player (0-100)
    songVolume: 70,

    introVideo: {
        url: "media/miku.webm",
        fadeBeforeEndMs: 500,
        objectFit: "cover",
        objectPosition: "center center",
    },

    endScreen: {
        fadeOutDurationMs: 1200,
        fadeInDurationMs: 1000,
        starCount: 70,
    },

    // -- Global palette -------------------------------------------------------
    colors: {
        background: "#111111",   // scene background fill
        primary: 0x8A2BE2,       // accent color used for UI elements (purple)
        primaryHover: 0x6A1B9A,  // darker shade for button hover state
        textMain: "#E0E0E0",     // default fallback color for characters without phrase context
        textLight: "#FFFFFF",    // pure-white text (titles, labels)
        textPrimary: "#8A2BE2",  // purple text used in the UI
        pointer: 0x00FFFF        // spawn-Y pointer dot color (cyan)
    },

    // -- Character color system -----------------------------------------------
    // Each phrase gets a base color from phraseColors; within a phrase each word
    // is multiplied by a factor from tintCycle to create brightness variety.

    // Brightness multipliers applied per-word within a phrase (cycled).
    // Values below 1 darken, above 1 brighten the phrase base color.
    tintCycle: [
        1.00,  
        0.80,  
        1.20,  
        0.90,  
        0.65,  
    ],

    // Base colors assigned to successive phrases (cycled if there are more phrases than entries)
    phraseColors: [
        "#7DD3FC",
        "#A7F3D0",
        "#81fdaa",
        "#4ff1fa",
        "#ff67b3",
        "#f5f7f8",
    ],

    // -- Fonts ----------------------------------------------------------------
    fonts: {
        main:   '"zpix", "Yu Gothic", "Hiragino Sans", sans-serif',
        ui:     '"zpix", "Yu Gothic", "Hiragino Sans", sans-serif',
        bgChar: '"Yu Gothic", "Hiragino Sans", "Noto Sans JP", sans-serif',
    },

    // -- Loading screen spinner -----------------------------------------------
    spinner: {
        radius: 50,          // outer radius in px
        thickness: 8,        // ring stroke width in px
        rotationSpeed: 0.1   // radians per frame
    },

    // -- Menu buttons ---------------------------------------------------------
    button: { width: 250, height: 80, fontSize: "40px" },

    // -- Catcher (the vertical bar the player controls) -----------------------
    catcher: {
        xPos: 600,          // fixed X position from the left edge
        width: 250,          // collision / visual width in px
        height: 250,        // collision / visual height in px
        maxSpeed: 0.8,        // maximum normalized speed (fraction of scene height per second)
        slowedSpeed: 0.01,  // reduced speed while a strip is draining
        responsiveness: 7.0, // exponential-smoothing factor : higher = snappier tracking
        marginY: 80,         // minimum distance the catcher keeps from the top/bottom edges
        animTime: 100,
        beatBobScaleY: 0.85,      // scaleY at peak vertical squeeze on each beat
        beatBobDuration: 80,      // ms to reach peak (same back, yoyo)
        beatBobEase: 'Quad.easeOut',
    },

    // -- Lyric characters -----------------------------------------------------
    lyrics: {
        fallTimeMs: 1700,          // time (ms) for a character to travel from spawn to the catcher
        fallTimeMsMultiplier: 1,   // global speed multiplier applied on top of fallTimeMs (1 = default)
        startXOffset: 100,         // how many px past the right edge characters spawn off-screen
        marginY: 100,              // vertical safe zone : characters never spawn closer than this to the top/bottom
        fontSize: "130px",         // CSS font-size used for all lyric text objects

        // A character that has moved past the catcher by more than (destroyOverflowRatio Ã: fallDistance)
        // is removed even if it was never caught, preventing off-screen accumulation
        destroyOverflowRatio: 0.2,

        // Minimum time gap (ms) between successive characters before a new Y position is allowed.
        // Prevents the spawn pointer from jumping too often on rapid note sequences.
        minDelayNewYPos: 500,

        // Characters whose on-screen duration (endTime - startTime) is shorter than this (ms)
        // do not get a trailing strip, because the strip would be too small to be meaningful.
        minDelayLongChar: 400,

        // Spacing : overlap prevention
        minCharSpacing: 20,      // min horizontal pixel gap before triggering a vertical shift
        overlapYShift: 80,       // vertical pixel offset applied to a character that would overlap the previous one

        // Japanese closing punctuation : always attached directly to the right edge of the previous character
        trailingChars: [
            "、", "。", "！", "？", "」", "』", "）", "］", "】", "〉", "》"
        ],

        // Japanese opening punctuation : shifted left so the body text starts after them
        leadingChars: [
            "「", "『", "（", "［", "【", "〈", "《"
        ],

        lyricsDelay: 250
    },

    // -- Background large-character flash effect -------------------------------
    // When a character is caught, a giant version of it briefly appears behind the scene.
    backgroundLyrics: {
        fontSize: "700px",          // size of the background character
        maxDurationBGEffect: 200,   // max time (ms) the effect stays fully visible
        maxDurationBGAnim: 100,     // max time (ms) of the scale-in animation
        sizeChangeCoeff: 5,         // how aggressively the size pulses during the animation
        boringColors: ["#59a6cc", "#4fb4af", "#7ec4b2", "#d9efe7", "#fdfaf4"],
        mildColors: ["#8f57d8", "#b485f1", "#44bd89", "#7ecf9a", "#ec2c8c", "#137a7f"],
        excitingColors: ["#ff9835", "#faa668", "#f52019", "#ff533a", "#ff7254"],
        startAlpha: 0.5,             // initial opacity of the background character
        arousalThresholds: [0.335, 0.37],
    },

    // -- Combo counter HUD (bottom-left) --------------------------------------
    combo: {
        xOffset: 45,           // distance from the left edge
        mainYOffset: 45,       // distance from bottom for the lowest element
        captionFontSize: 18,   // px for the small labels above each number
        fontSize: 100,         // px for the combo number
        color: "#ffffff",
        ghostAlpha: 0.2,       // opacity of the ghost (echo) copy of the counter
        mainScaleBounce: 1.1,  // scale the main counter briefly grows to on increment
        ghostScaleBounce: 1.4, // scale the ghost briefly grows to on increment (more exaggerated)
        animDuration: 500,     // duration (ms) of the bounce-back tween
    },

    // -- Spawn-Y pointer ------------------------------------------------------
    // A moving point that drifts up and down; each new character spawns at its current Y.
    charSpawnYPointer: {
        speed: 1  // fraction of scene height traveled per second at full velocity
    },

    // -- Wave / flip pattern --------------------------------------------------
    // The spawn pointer periodically reverses direction to create a wave motion.
    // `patterns` is a list of beat-durations (in beats) the pointer travels in one direction
    // before flipping; the list is cycled indefinitely.
    wave: {
        beatDuration: 500,       // ms per beat (used to convert beat counts to wall-clock time)
        patterns: [0.75, 1, 1, 0.5, 0.5, 1, 2, 2]  // beat durations per direction segment
    },

    // -- FL Studio-style timeline background ----------------------------------
    FLBackground: {
        bgColor: 0x111111,        // main panel background
        topBarColor: 0x2f353c,    // darker strip along the top (ruler area)
        majorLineColor: 0x252a30, // beat / bar divider lines
        minorLineColor: 0x39414a, // subdivision lines between beats
        textColor: "#d4d8dc",     // measure-number label color
        fontSize: "26px",
        topBarHeight: 50,         // height (px) of the ruler strip
        majorSpacing: 400,        // horizontal pixels between major (bar) lines
        subdivisions: 4,          // how many minor lines to draw between each major line
        cellPalette: ["#da7eec", "#7ba9ff", "#47e6a9", "#f3e2c9"],
    },

    

    // -- Heart mode -----------------------------------------------------------
    // Spawns floating hearts as a visual flourish (triggered externally).
    heartMode: {
        heartAmount: 6,  // number of hearts spawned per trigger
        minSize: 30,     // minimum heart diameter (px)
        maxSize: 60,     // maximum heart diameter (px)
    },

    // Master switch : set to false to disable all particle effects globally
    globalParticleToggle: true,

    // -- Catch particle emitter (active config) --------------------------------
    // Tint is not set here; it is overridden per-character in spawnCatchParticles()
    // so each burst matches the caught character's color.
    // Angle 0Â° = right; the burst fires rightward (away from the catcher wall) like debris.
    particles: {
        count: 22,

        speedMin: 200,
        speedMax: 550,

        lifespan: 650,

        scaleStart: 2.5,
        scaleEnd: 0,

        angleMin: -20,   // cone pointing right
        angleMax: 20,
    },

    // -- Aura circle ----------------------------------------------------------
    // A soft glowing circle drawn behind characters spawned at wave direction changes.
    backgroundCircle: {
        radiusMultiplier: 0.70, // circle radius = max(charWidth, charHeight) Ã: this
        alpha: 0.18,            // opacity of the circle (kept low so it doesn't overpower the character)
        fadeDuration: 300,      // ms over which the circle fades out when the character despawns
    },

    // -- Disintegration (caught-character dissolve) ----------------------------
    // When a character is caught it freezes at the catcher while its strip drains, then
    // its right edge stays anchored at the catcher while scaleX shrinks to 0. Combined
    // with an alpha fade this makes the left side vanish first - a squishy wall-absorption.
    disintegration: {
        dissolveDuration: 700,  // ms for the squish-fade after the strip depletes
    },

    // -- Music visualizer -----------------------------------------------------
    // Permanent background bar EQ driven directly by TextAlive song-map data.
    // No FFT or audio capture required : bar heights are synthesised from vocal
    // amplitude, beat pulses, chorus sections, valence/arousal, and chord changes.
    // Mirrored vertically around the screen center; always visible at low opacity.
    visualizer: {
        numBars: 45,
        barWidthRatio: 0.12,   // bar width as a fraction of per-bar cell (rest is gap)
        numSegments: 14,
        segmentGap: 3,
        xOffset: 0,          // px to shift the bar group right of center (positive = right)
        backgroundAlpha: 0.60,
        gain: 1.0,             // master output multiplier applied after all signals are mixed

        // Minimum bar activity when the song is otherwise silent : keeps the EQ subtly alive
        restLevel: 0.006,

        // Weights control how much each TextAlive signal contributes to the global energy level
        vocalWeight: 0.66,     // vocal amplitude : dominant driver during sung phrases
        beatWeight: 0.36,      // beat pulse : adds sharp transient peaks on each hit
        arousalWeight: 0.04,   // valence/arousal "a" axis : lifts energy during intense moments
        chorusBoost: 0.055,    // sustained lift applied while inside a chorus section

        // Spectral shape parameters (control where energy concentrates across bars)
        shimmerAmount: 0.22,   // amplitude of the slow per-band shimmer oscillation
        beatSharpness: 5.2,    // exponent of the beat-pulse decay curve; higher = snappier transient
        formantDrift: 0.32,    // rad/s rate at which the formant peak slowly drifts left/right
        peakSharpness: 2.5,    // Gaussian sharpness of the spectral peaks; higher = narrower peaks, deeper valleys

        noiseGate: 0.045,      // signals below this threshold are gated to zero (hides idle noise)
        smoothingUp: 0.62,     // per-frame lerp factor when a bar is rising  (high = fast attack)
        smoothingDown: 0.14,   // per-frame lerp factor when a bar is falling (low  = slow decay)

        // Fraction of bars on each side that pinch to zero height (prevents hard-crop look at edges)
        edgeFadeWidth: 0.06,
        gradientStops: [
            { r: 134, g: 206, b: 203 }, // low  (teal)
            { r: 34,  g: 16,  b: 79  }, // mid  (dark purple)
            { r: 225, g: 40,  b: 133 }  // high (pink)
        ],
    },

    // -- Beat pinch effect ----------------------------------------------------
    // On every TextAlive beat, a barrel/pincushion distortion briefly squeezes
    // all on-screen lyric characters and the catcher, then springs back.
    beatPinch: {
        amount: 0.7,      // barrel FX amount at peak pinch (< 1 = pincushion, > 1 = barrel bulge)
        duration: 70,     // ms to reach peak pinch (same duration back, yoyo)
        ease: 'Quad.easeOut',
    },
};

const { Player, PlayerOptions } = TextAliveApp;
let isTextAliveReady = false;
let isIntroVideoReady = false;
let lowPowerMode = false;
let hardMode = false;
let introVideoElement = null;
let introVideoFrame = null;
let endScreenVideoElement = null;

function getSongTitle() {
    const song = taPlayer?.data?.song;
    return song?.name || song?.songName || song?.title || "Loading Song ...  読み込み中...";
}

function createIntroVideoElement() {
    const cfg = gameSettings.introVideo;
    if (!cfg.url) {
        return null;
    }

    const video = document.createElement("video");
    video.preload = "auto";
    video.playsInline = true;
    video.controls = false;
    video.style.position = "fixed";
    video.style.inset = "0";
    video.style.width = "100vw";
    video.style.height = "100vh";
    video.style.objectFit = cfg.objectFit;
    video.style.objectPosition = cfg.objectPosition;
    video.style.pointerEvents = "none";
    video.style.opacity = "0";
    video.style.display = "none";
    video.style.zIndex = "10";
    video.style.background = "transparent";

    const markReady = () => {
        if (isIntroVideoReady) return;
        isIntroVideoReady = true;
        video.removeEventListener("loadeddata", markReady);
        video.removeEventListener("canplay", markReady);
    };

    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplay", markReady);
    video.addEventListener("error", () => {
        window.setTimeout(() => video.load(), 1000);
    });
    video.src = cfg.url;
    document.body.appendChild(video);
    video.load();

    return video;
}

function resetIntroVideo(video) {
    if (introVideoFrame) {
        cancelAnimationFrame(introVideoFrame);
        introVideoFrame = null;
    }

    video.pause();
    video.style.opacity = "0";
    video.style.display = "none";

    try {
        video.currentTime = 0;
    } catch (err) {
        void err;
    }
}

function playIntroVideo(onComplete, onPlaybackBlocked, onFadeStart) {
    const video = introVideoElement;
    if (!video || !isIntroVideoReady) {
        onPlaybackBlocked();
        return;
    }

    let finished = false;
    let fadeStarted = false;
    const fadeSeconds = gameSettings.introVideo.fadeBeforeEndMs / 1000;

    const finish = () => {
        if (finished) return;
        finished = true;
        video.removeEventListener("ended", finish);
        video.removeEventListener("error", abort);
        resetIntroVideo(video);
        onComplete();
    };

    const abort = () => {
        if (finished) return;
        finished = true;
        video.removeEventListener("ended", finish);
        video.removeEventListener("error", abort);
        resetIntroVideo(video);
        video.load();
        onPlaybackBlocked();
    };

    const updateOpacity = () => {
        const duration = video.duration;
        if (Number.isFinite(duration) && duration > 0 && fadeSeconds > 0) {
            const remaining = duration - video.currentTime;
            if (!fadeStarted && remaining <= fadeSeconds) {
                fadeStarted = true;
                onFadeStart?.();
            }
            const opacity = remaining <= fadeSeconds
                ? Phaser.Math.Clamp(remaining / fadeSeconds, 0, 1)
                : 1;
            video.style.opacity = String(opacity);
        } else {
            video.style.opacity = "1";
        }

        if (!finished) {
            introVideoFrame = requestAnimationFrame(updateOpacity);
        }
    };

    video.removeEventListener("ended", finish);
    video.removeEventListener("error", abort);
    resetIntroVideo(video);
    video.style.display = "block";
    video.style.opacity = "1";
    video.addEventListener("ended", finish);
    video.addEventListener("error", abort);

    const playPromise = video.play();
    introVideoFrame = requestAnimationFrame(updateOpacity);

    if (playPromise?.catch) {
        playPromise.catch(abort);
    }
}

// Font glyph detection
// Canvas renders nothing (or a tofu box identical to the fallback) when a font lacks a glyph.
// We detect this by comparing pixel output of "fontName, monospace" vs "monospace" alone.
// If identical, the font had no glyph and we skip it.
const _glyphCache = new Map();

function fontHasGlyph(fontName, char) {
    const key = `${fontName}\x00${char}`;
    if (_glyphCache.has(key)) return _glyphCache.get(key);

    const size = 24;
    const canvas = document.createElement('canvas');
    canvas.width = size * 2;
    canvas.height = size * 2;
    const ctx = canvas.getContext('2d');

    const sample = (font) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = `${size}px ${font}`;
        ctx.fillText(char, 4, size + 4);
        return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    };

    const withFont    = sample(`"${fontName}", monospace`);
    const withoutFont = sample('monospace');

    let hasGlyph = false;
    for (let i = 0; i < withFont.length; i++) {
        if (withFont[i] !== withoutFont[i]) { hasGlyph = true; break; }
    }

    _glyphCache.set(key, hasGlyph);
    return hasGlyph;
}

function getLyricFont(char) {
    const primaryFont = 'zpix';
    if (fontHasGlyph(primaryFont, char)) return gameSettings.fonts.main;
    return '"Yu Gothic", "Hiragino Sans", "Noto Sans JP", sans-serif';
}

// Color utilities
function hexToRgb(hex) {
    hex = hex.replace("#", "");
    return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
    };
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b]
        .map(v => Math.max(0, Math.min(255, Math.round(v))))
        .map(v => v.toString(16).padStart(2, "0"))
        .join("");
}

// Multiplies each channel by factor: <1 darkens, >1 brightens
function tintColor(hex, factor) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(r * factor, g * factor, b * factor);
}

class ComboCounter {
    constructor(scene) {
        this.scene = scene;
        this.combo = 0;
        this.comboPoints = 0;
        this.hits = 0;
        this.misses = 0;

        const cfg = gameSettings.combo;
        const x        = cfg.xOffset;
        const accSize  = Math.round(cfg.fontSize / 2);
        const capSize  = cfg.captionFontSize;
        const baseY    = scene.scale.height - cfg.mainYOffset;

        // Layout (bottom to top): accuracy number → accuracy caption → gap → combo number → combo caption
        const accNumY   = baseY;
        const accCapY   = accNumY   - accSize      - 3;
        const comboNumY = accCapY   - capSize      - 10;
        const comboCapY = comboNumY - cfg.fontSize - 3;

        const numStyle = (size, thickness) => ({
            fontFamily: gameSettings.fonts.ui,
            fontSize: `${size}px`,
            color: cfg.color,
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: thickness,
        });

        const capStyle = {
            fontFamily: gameSettings.fonts.ui,
            fontSize: `${capSize}px`,
            color: "#aaaaaa",
            stroke: "#000000",
            strokeThickness: 3,
        };

        this.comboCaption = scene.add.text(x, comboCapY, "COMBO", capStyle)
            .setOrigin(0, 1).setDepth(100);

        this.ghostText = scene.add.text(x, comboNumY, "0", numStyle(cfg.fontSize, 4))
            .setOrigin(0, 1).setAlpha(cfg.ghostAlpha).setDepth(100);

        this.mainText = scene.add.text(x, comboNumY, "0", numStyle(cfg.fontSize, 6))
            .setOrigin(0, 1).setDepth(101);

        this.accCaption = scene.add.text(x, accCapY, "ACCURACY", capStyle)
            .setOrigin(0, 1).setDepth(102);

        this.precisionText = scene.add.text(x, accNumY, this.formatPrecision(), numStyle(accSize, 4))
            .setOrigin(0, 1).setDepth(102);
    }

    increment() {
        this.combo++;
        this.hits++;
        this.comboPoints = this.calcPointsCurrentCombo(this.combo);
        this.updateText();
        this.playAnimation();
    }

    miss() {
        this.misses++;
        this.combo = 0;
        this.comboPoints = 0;

        this.updateText();
        this.scene.tweens.killTweensOf([this.mainText, this.ghostText]);
        this.mainText.setScale(1);
        this.ghostText.setScale(1);
    }

    updateText() {
        this.mainText.setText(this.comboPoints.toString());
        this.ghostText.setText(this.comboPoints.toString());
        this.precisionText.setText(this.formatPrecision());
    }

    formatPrecision() {
        const totalJudged = this.hits + this.misses;
        const percent = totalJudged > 0 ? (this.hits / totalJudged) * 100 : 100;
        return `${percent.toFixed(2)}%`;
    }

    playAnimation() {
        const cfg = gameSettings.combo;
        this.scene.tweens.killTweensOf([this.mainText, this.ghostText]);

        this.scene.tweens.add({ targets: this.mainText,  scale: cfg.mainScaleBounce,  duration: 40, ease: 'Quad.easeOut' });
        this.scene.tweens.add({ targets: this.ghostText, scale: cfg.ghostScaleBounce, duration: 40, ease: 'Quad.easeOut' });
        this.scene.tweens.add({ targets: [this.mainText, this.ghostText], scale: 1, duration: cfg.animDuration, delay: 40, ease: 'Back.easeOut' });
    }

    calcPointsCurrentCombo(combo) {
        if (combo < 1)  return 0;
        if (combo < 20) return Math.floor(0.16 * combo ** 2 - 0.33 * combo + 1.16);
        return 3 * combo;
    }
}

class WaveState {
    constructor() {
        this.beatDuration = gameSettings.wave.beatDuration;
        this.nextFlipTime = 0;
        this.currentTravelBeats = 0;
        this.patterns = gameSettings.wave.patterns;
    }

    // Returns true when a flip fires : the caller uses this to trigger the spawn-aura effect.
    advance(songTime) {
        if (songTime < this.nextFlipTime) return false;
        this.currentTravelBeats = Phaser.Utils.Array.GetRandom(this.patterns);
        this.nextFlipTime = songTime + this.currentTravelBeats * this.beatDuration;
        return true;
    }
}

class Catcher {
    constructor(scene, y) {
        this.scene = scene;
        this.direction = 1;
        this.velocity = 0;
        this.catcherMaxSpeed = gameSettings.catcher.maxSpeed;
        this.sprite = scene.add.image(
            gameSettings.catcher.xPos - gameSettings.catcher.width,
            y,
            "miku_standing"
        );
        this.sprite.setDisplaySize(gameSettings.catcher.width, gameSettings.catcher.height);
        this._baseScaleY = this.sprite.scaleY;

        scene.physics.add.existing(this.sprite);
        this.sprite.body.setImmovable(true);
        this.sprite.body.setSize(gameSettings.catcher.width, gameSettings.catcher.height);

        this.isKnocking = false;
    }

    toggleDirection() {
        this.direction *= -1;
    }

    changeMaxSpeed(speed) {
        this.catcherMaxSpeed = speed;
    }

    update(delta, sceneHeight) {
        const targetSpeed = this.direction * sceneHeight * this.catcherMaxSpeed;
        const t = 1.0 - Math.exp(-gameSettings.catcher.responsiveness * delta);

        this.velocity = Phaser.Math.Linear(this.velocity, targetSpeed, t);
        this.sprite.y += this.velocity * delta;

        const minY = gameSettings.catcher.marginY;
        const maxY = sceneHeight - gameSettings.catcher.marginY;

        if (this.sprite.y < minY) {
            this.sprite.y = minY;
            this.velocity = Math.max(0, this.velocity);
        }

        if (this.sprite.y > maxY) {
            this.sprite.y = maxY;
            this.velocity = Math.min(0, this.velocity);
        }
    }

    get x() {
        return this.sprite.x;
    }

    get y() {
        return this.sprite.y;
    }

    triggerBeatBob() {
        const cfg = gameSettings.catcher;
        this.scene.tweens.killTweensOf(this.sprite);
        this.scene.tweens.add({
            targets: this.sprite,
            scaleY: this._baseScaleY * cfg.beatBobScaleY,
            duration: cfg.beatBobDuration,
            yoyo: true,
            ease: cfg.beatBobEase,
        });
    }

    playKnockAnim() {
        this.sprite.setTexture("miku_knocking");
        this.isKnocking = true;

        if (this._catchResetTimer) this._catchResetTimer.remove();
        this._catchResetTimer = this.scene.time.delayedCall(
            gameSettings.catcher.animTime,
            () => { this.sprite.setTexture("miku_standing"); }
        );

        this.isKnocking = false;
    }
}

class CharSpawnYPointer {
    constructor(initialY) {
        this.y = initialY;
        this.direction = Math.random() < 0.5 ? 1 : -1;
        this.velocity = 0;
        this.responsiveness = 5.0;
        this.charSpawnYPointerSpeed = gameSettings.charSpawnYPointer.speed;
    }

    flipDirection() {
        this.direction *= -1;
    }

    changeSpeed(speed) {
        this.charSpawnYPointerSpeed = speed;
    }

    update(delta, sceneHeight) {
        const targetSpeed = this.direction * sceneHeight * this.charSpawnYPointerSpeed;
        // Exponential smoothing: t approaches 1 as delta grows, making the pointer snap faster
        const t = 1.0 - Math.exp(-this.responsiveness * delta);

        this.velocity = Phaser.Math.Linear(this.velocity, targetSpeed, t);
        this.y += this.velocity * delta;

        const minY = gameSettings.lyrics.marginY;
        const maxY = sceneHeight - gameSettings.lyrics.marginY;

        if (this.y < minY) {
            this.y = minY;
            this.velocity = Math.max(0, this.velocity);
        }

        if (this.y > maxY) {
            this.y = maxY;
            this.velocity = Math.min(0, this.velocity);
        }
    }
}

class ActiveChar {
    constructor(scene, char, obj, startX, yPos, stripLength, stripHeight, auraOnSpawn, effectiveStartTime) {
        this.scene = scene;
        this.char = char;
        this.obj = obj;
        this.startX = startX;
        this.yPos = yPos;

        // Numeric color derived once and reused for the strip, aura, and catch particles
        this.color = Phaser.Display.Color.HexStringToColor(this.obj.style.color).color;

        this.strip = this.createStrip(stripLength, stripHeight);
        this.auraOnSpawn = auraOnSpawn;

        this.backgroundCircle = this.createBackgroundCircle();
        this.caught = false;

        this.effectiveStartTime = effectiveStartTime;
    }

    createStrip(stripLength, stripHeight) {
        if (stripLength < gameSettings.lyrics.minDelayLongChar) {
            return null;
        }

        const strip = this.scene.add.rectangle(
            this.startX + this.obj.width / 2,
            this.yPos,
            stripLength,
            stripHeight,
            this.color,
            1
        );

        strip.setOrigin(0, 0.5);
        strip.setDepth(-1);

        return strip;
    }

    updateStripPosition(startX, catcherX, progress, charSize) {
        if (this.strip) {
            this.strip.x =
                startX - (startX - catcherX) * progress + charSize / 2;
        }
    }

    createBackgroundCircle() {
        if (!this.auraOnSpawn) {
            return null;
        }

        const radius =
            Math.max(this.obj.width, this.obj.height) *
            gameSettings.backgroundCircle.radiusMultiplier;

        const circle = this.scene.add.circle(
            this.obj.x,
            this.obj.y,
            radius,
            this.color,
            gameSettings.backgroundCircle.alpha
        );

        circle.setDepth(this.obj.depth - 1);

        return circle;
    }

    update(time, catcherX, fallTime, delta, destroyThreshold, fallDistance, charSize, dyingStrips) {
        const progress = (time - (this.effectiveStartTime - fallTime)) / fallTime;

        this.obj.x = this.startX - (this.startX - catcherX) * progress;
        this.obj.y = this.yPos;

        // Keep the physics body in sync with the manually-driven position so
        // Arcade overlap detection always checks the current visual location.
        this.obj.body?.reset(this.obj.x, this.obj.y);

        if (this.backgroundCircle) {
            this.backgroundCircle.x = this.obj.x;
            this.backgroundCircle.y = this.obj.y;
        }
        this.updateStripPosition(this.startX, catcherX, progress, charSize);

        if (progress > 1 + destroyThreshold) {
            this.retire(dyingStrips, fallDistance, fallTime);
            return true;
        }

        return false;
    }

    spawnCatchParticles() {
        if (this.caught) return;
        this.caught = true;
        if (!gameSettings.globalParticleToggle) return;

        const pc = gameSettings.particles;
        const scene = this.scene;
        const originX = scene.catcher.x + gameSettings.catcher.width / 2;
        const originY = this.obj.y;
        const color = this.color;

        const dots = [];
        for (let i = 0; i < pc.count; i++) {
            const angleRad = (Phaser.Math.FloatBetween(pc.angleMin, pc.angleMax) * Math.PI) / 180;
            const speed = Phaser.Math.FloatBetween(pc.speedMin, pc.speedMax);
            dots.push({ vx: Math.cos(angleRad) * speed, vy: Math.sin(angleRad) * speed });
        }

        const gfx = scene.add.graphics();
        let elapsed = 0;

        const timer = scene.time.addEvent({
            delay: 16,
            loop: true,
            callback: () => {
                elapsed += 16;
                if (elapsed >= pc.lifespan) {
                    timer.remove(false);
                    gfx.destroy();
                    return;
                }
                const progress = elapsed / pc.lifespan;
                const t = elapsed / 1000;
                const radius = (pc.scaleStart + (pc.scaleEnd - pc.scaleStart) * progress) * 4;
                gfx.clear();
                gfx.fillStyle(color, 1 - progress);
                for (const d of dots) {
                    gfx.fillCircle(originX + d.vx * t, originY + d.vy * t, radius);
                }
            },
        });
    }

    // RETIRE (MISS / OFFSCREEN)
    retire(dyingStrips, fallDistance, fallTime) {
        this.destroyVisuals();

        if (!this.strip) {
            this.obj.destroy();
            return;
        }

        const stripDuration =
            (this.strip.width / fallDistance) * fallTime;

        dyingStrips.push({
            strip: this.strip,
            maxWidth: this.strip.width,
            progress: 0,
            obj: this.obj,
            stripDuration
        });
    }

    destroyVisuals() {
        if (this.backgroundCircle) {
            const circle = this.backgroundCircle;
            // Null before the tween so in-flight update() calls skip repositioning the fading circle
            this.backgroundCircle = null;
            this.scene.tweens.add({
                targets: circle,
                alpha: 0,
                duration: gameSettings.backgroundCircle.fadeDuration,
                onComplete: () => circle.destroy()
            });
        }
    }

    // DISINTEGRATION - called once when the player catches this character
    startDisintegration(dyingStrips, fallDistance, fallTime) {
        this.destroyVisuals();

        // Duration matches fall velocity: time for the character to travel its own width
        this.squishDuration = (this.obj.width / fallDistance) * fallTime;

        this.dissolveDelay = 0;
        if (this.strip) {
            const stripDuration = (this.strip.width / fallDistance) * fallTime;
            this.dissolveDelay = stripDuration;
            dyingStrips.push({
                strip: this.strip,
                maxWidth: this.strip.width,
                progress: 0,
                obj: null,
                stripDuration,
            });
        }

        this.dissolveWait = 0;
        this.dissolveStarted = false;
        this.dissolveElapsed = 0;
    }

    // Called each frame by GameScene.updateDisintegratingChars() while this character dissolves.
    updateDisintegration(catcherX, delta) {
        // -- Phase 1: hold the character at the catcher while the strip drains --
        if (!this.dissolveStarted) {
            this.obj.x = catcherX + this.obj.width / 2;
            this.dissolveWait += delta;
            if (this.dissolveWait >= this.dissolveDelay) {
                this.dissolveStarted = true;
            }
            return false;
        }

        // -- Phase 2: left edge stays at catcherX, right edge squishes leftward --
        // Linear (no easing) so the squish speed matches the character's fall momentum.
        this.dissolveElapsed += delta;
        const t = Math.min(this.dissolveElapsed / this.squishDuration, 1);

        const newScaleX = 1 - t;
        this.obj.scaleX = newScaleX;
        this.obj.x = catcherX + (this.obj.width * newScaleX) / 2;
        this.obj.scaleY = 1 + 0.25 * Math.sin(Math.PI * t);

        if (t >= 1) {
            this.obj.destroy();
            return true;
        }
        return false;
    }
}

class FLTimelineBackground extends Phaser.GameObjects.Container {

    constructor(scene, width, height) {
        super(scene, 0, 0);

        this.width = width;
        this.height = height;

        this.topBarHeight = gameSettings.FLBackground.topBarHeight;

        this.scrollX = 0;

        this.graphics = scene.add.graphics();

        this._labelPool = [];

        this.add(this.graphics);

        scene.add.existing(this);

        this.redraw();
    }

    _getOrCreateLabel(index) {

        if (index >= this._labelPool.length) {

            const lbl = this.scene.add.text(0, 8, "", {
                fontFamily: gameSettings.fonts.ui,
                fontSize: gameSettings.FLBackground.fontSize,
                color: gameSettings.FLBackground.textColor
            });

            this._labelPool.push(lbl);
            this.add(lbl);
        }

        return this._labelPool[index];
    }

    update(songTime, startX, catcherX, fallTime) {

        const pixelsPerMs =
            (startX - catcherX) / fallTime;

        this.scrollX = songTime * pixelsPerMs;

        this.redraw();
    }

    redraw() {

        const g = this.graphics;
        const cfg = gameSettings.FLBackground;

        g.clear();

        // Background
        g.fillStyle(cfg.bgColor);
        g.fillRect(0, 0, this.width, this.height);

        //-------------------------------------------------
        // Horizontal lanes
        //-------------------------------------------------

        const laneHeight = cfg.laneHeight ?? 48;

        g.lineStyle(1, 0x707780, 0.15);

        for (
            let y = this.topBarHeight;
            y < this.height;
            y += laneHeight
        ) {
            g.beginPath();
            g.moveTo(0, y);
            g.lineTo(this.width, y);
            g.strokePath();
        }

        //-------------------------------------------------
        // Minor vertical grid
        //-------------------------------------------------

        const majorSpacing = cfg.majorSpacing;
        const minorSpacing = majorSpacing / cfg.subdivisions;

        const offset = this.scrollX % majorSpacing;

        g.lineStyle(1, cfg.minorLineColor, 0.15);

        for (
            let x = -offset;
            x < this.width + majorSpacing;
            x += minorSpacing
        ) {
            g.beginPath();
            g.moveTo(x, this.topBarHeight);
            g.lineTo(x, this.height);
            g.strokePath();
        }

        //-------------------------------------------------
        // Major measures
        //-------------------------------------------------

        const palette = cfg.cellPalette;

        const accentWidth = cfg.accentWidth ?? 8;
        const accentAlpha = cfg.accentAlpha ?? 0.6;

        const firstMeasure =
            Math.floor(this.scrollX / majorSpacing);

        let measure = firstMeasure + 1;
        let labelIndex = 0;

        const totalMeasures =
            Math.ceil((this.width + majorSpacing) / majorSpacing) + 2;

        for (let i = 0; i < totalMeasures; i++) {

            const x =
                -offset + i * majorSpacing;

            const color =
                parseInt(
                    palette[(measure - 1) % palette.length]
                        .replace("#", ""),
                    16
                );

            // Colored accent
            g.fillStyle(color, accentAlpha);

            g.fillRect(
                x - accentWidth / 2,
                this.topBarHeight,
                accentWidth,
                this.height - this.topBarHeight
            );

            // Strong line every 4 measures
            const strong =
                (measure - 1) % 4 === 0;

            g.lineStyle(
                strong ? 3 : 2,
                cfg.majorLineColor,
                strong ? 0.95 : 0.6
            );

            g.beginPath();
            g.moveTo(x, 0);
            g.lineTo(x, this.height);
            g.strokePath();

            const lbl =
                this._getOrCreateLabel(labelIndex++);

            lbl
                .setPosition(x + 8, 8)
                .setText(measure)
                .setVisible(true);

            measure++;
        }

        // Hide unused pooled labels
        for (
            let i = labelIndex;
            i < this._labelPool.length;
            i++
        ) {
            this._labelPool[i].setVisible(false);
        }

        //-------------------------------------------------
        // Top ruler
        //-------------------------------------------------

        g.fillStyle(cfg.topBarColor);
        g.fillRect(
            0,
            0,
            this.width,
            this.topBarHeight
        );

        g.lineStyle(2, 0x1f2328, 1);

        g.beginPath();
        g.moveTo(0, this.topBarHeight);
        g.lineTo(this.width, this.topBarHeight);
        g.strokePath();
    }

    destroy(fromScene) {

        for (const lbl of this._labelPool) {
            lbl.destroy();
        }

        this.graphics.destroy();

        super.destroy(fromScene);
    }

}

class BackgroundChar {
    constructor(scene, taPlayer) {
        this.scene = scene;

        this.startTime = 0;
        this.endTime = 0;
        this.colorIndex = 0;

        this.text = scene.add.text(
            scene.scale.width / 2,
            scene.scale.height / 2,
            "",
            {
                fontFamily: gameSettings.fonts.bgChar,
                fontSize: gameSettings.backgroundLyrics.fontSize,
                color: 0x000000,
                fontStyle: "bold"
            }
        )
            .setOrigin(0.5)
            .setAlpha(0)
            .setDepth(-1);

        this.heartMode = false;

        this.bigHeart = scene.add.text(
            scene.scale.width / 2,
            scene.scale.height / 2,
            "❤",
            {
                fontSize: "250px",
                color: "#ff4040",
                padding: { top: 40 }
            }
        )
            .setOrigin(0.5)
            .setAlpha(0)
            .setDepth(-1);

        this.hearts = [];

        this.taPlayer = taPlayer;
    }

    isHeart(text) {
        return [
            "❤",
            "♥",
            "♡",
            "♡"
        ].includes(text);
    }

    enterHeartMode() {
        this.heartMode = true;

        this.text.setAlpha(0);
        this.bigHeart.setAlpha(1);
        this.bigHeart.setScale(1);

        const w = this.scene.scale.width;
        const h = this.scene.scale.height;

        for (const heart of this.hearts) {
            heart.destroy();
        }

        this.hearts.length = 0;

        for (let i = 0; i < gameSettings.heartMode.heartAmount; i++) {

            const size = Phaser.Math.Between(gameSettings.heartMode.minSize, gameSettings.heartMode.maxSize);

            const heart = this.scene.add.text(
                Phaser.Math.Between(0, w),
                Phaser.Math.Between(0, h),
                "❤",
                {
                    fontSize: `${size}px`,
                    color: "#ff6b8a",
                    padding: { top: Math.ceil(size * 0.15) }
                }
            )
                .setOrigin(0.5)
                .setDepth(-2)
                .setAlpha(0.2 + Math.random() * 0.4);

            heart.baseScale = 0.6 + Math.random() * 0.8;
            heart.phase = Math.random() * Math.PI * 2;
            heart.floatSpeed = 10 + Math.random() * 20;

            this.hearts.push(heart);
        }
    }

    exitHeartMode() {
        this.heartMode = false;

        this.bigHeart.setAlpha(0);

        for (const heart of this.hearts) {
            heart.destroy();
        }

        this.hearts.length = 0;
    }

    show(charText, color,duration, currentTime) {
        this.startTime = currentTime;
        this.endTime = currentTime + duration;

        if (this.isHeart(charText)) {
            this.enterHeartMode();
            return;
        }

        this.exitHeartMode();

        this.text.setText(charText);
        this.text.setAlpha(gameSettings.backgroundLyrics.startAlpha);

        this.text.setColor(color);

        // Track font size as a number so we never need to parse the style string
        this._fontSize = parseInt(gameSettings.backgroundLyrics.fontSize);
        this.text.setFontSize(this._fontSize);
    }

    updateHeartMode(currentTime, deltaMs) {
        const t = currentTime / 1000;

        const beat =
            1 +
            Math.sin(t * 12) * 0.12 +
            Math.max(0, Math.sin(t * 6)) * 0.2;

        this.bigHeart.setScale(beat);

        const deltaSec = deltaMs / 1000;

        for (const heart of this.hearts) {
            heart.y -= heart.floatSpeed * deltaSec;

            if (heart.y < -100) {
                heart.y = this.scene.scale.height + 100;
            }

            const scale =
                heart.baseScale +
                Math.sin(t * 2 + heart.phase) * 0.1;

            heart.setScale(scale);
        }

        // Fade out after the character's duration ends
        if (currentTime >= this.endTime) {
            const fadePerMs = 1 / gameSettings.backgroundLyrics.maxDurationBGEffect;
            const alpha = Math.max(0, this.bigHeart.alpha - fadePerMs * deltaMs);

            this.bigHeart.setAlpha(alpha);
            for (const heart of this.hearts) {
                heart.setAlpha(alpha * 0.5);
            }

            if (alpha <= 0) {
                this.exitHeartMode();
            }
        }
    }

    update(currentTime, deltaMs) {
        const animTime = gameSettings.backgroundLyrics.maxDurationBGAnim;

        if (this.heartMode) {
            this.updateHeartMode(currentTime, deltaMs);
            return;
        }

        if (currentTime >= this.endTime) {
            if (this.text.alpha > 0) {
                const fadePerMs = 1 / gameSettings.backgroundLyrics.maxDurationBGEffect;
                this.text.setAlpha(Math.max(0, this.text.alpha - fadePerMs * deltaMs));
            } else {
                this.text.setText("");
            }
            return;
        }

        if (currentTime <= this.startTime + animTime) {
            this._fontSize += gameSettings.backgroundLyrics.sizeChangeCoeff;
            this.text.setFontSize(this._fontSize);
        }
    }

    clear() {
        this.exitHeartMode();
        this.text.setAlpha(0);
        this.text.setText("");
        this.startTime = 0;
        this.endTime = 0;
    }

    destroy() {
        this.text.destroy();
    }
}

class MusicVisualizer {
    constructor(scene, y) {
        this.scene = scene;
        this.y = y;
        this.levels  = new Float32Array(gameSettings.visualizer.numBars).fill(0);
        this._scratch = new Float32Array(gameSettings.visualizer.numBars); // reused by the blur pass
        // Per-bar random phase offsets so the shimmer oscillations are never in sync
        this.bandPhase = new Float32Array(gameSettings.visualizer.numBars);
        this.segmentColors = this._buildGradient();
        this.graphics = scene.add.graphics().setDepth(-9999).setAlpha(gameSettings.visualizer.backgroundAlpha);
        this._currentAlpha = gameSettings.visualizer.backgroundAlpha; // tracked separately for lerping
        this._maxVocalAmplitude = 0; // cached from getMaxVocalAmplitude; 0 = not yet fetched
        this._vocalPeak = 0.001;     // fallback running peak when the max is unavailable
        this._lastChordName = "";
        this._lastChordHash = 0.5;   // chord name hashed to [0,1]; drives formant/harmonic position

        for (let b = 0; b < this.bandPhase.length; b++)
            this.bandPhase[b] = this._hashUnit(`bar-${b}`) * Math.PI * 2;
    }

    update(taPlayer, hasChars) {
        const positionMs = taPlayer?.timer?.position ?? taPlayer?.mediaPosition ?? 0;
        this._readTextAliveSignals(taPlayer, positionMs);

        // Fade to full opacity when the screen is empty so the EQ takes focus,
        // then fade back to backgroundAlpha once characters appear.
        const cfg = gameSettings.visualizer;
        const targetAlpha = hasChars ? cfg.backgroundAlpha : 1.0;
        this._currentAlpha += (targetAlpha - this._currentAlpha) * 0.04;
        this.graphics.setAlpha(this._currentAlpha);

        this._draw();
    }

    // Synthesises a convincing EQ shape from TextAlive song-map signals.
    // The key design rule: each spectral region has its OWN peak driven by its OWN signal.
    // Additive global floors (the old approach) raise ALL bars uniformly, killing valleys.
    // Here, bars between peaks stay near restLevel because only nearby peaks contribute.
    // Shimmer is multiplicative so it animates peaks without lifting the troughs.
    _readTextAliveSignals(taPlayer, positionMs) {
        const cfg = gameSettings.visualizer;
        const vocal     = this._readVocalLevel(taPlayer, positionMs);
        const beat      = this._readBeatPulse(taPlayer, positionMs);
        const chorus    = this._readChorusLevel(taPlayer, positionMs);
        const va        = this._readValenceArousal(taPlayer, positionMs);
        const arousal   = va ? this._clamp((va.a + 1) * 0.5, 0, 1) : 0.5;
        const valence   = va ? this._clamp((va.v + 1) * 0.5, 0, 1) : 0.5;
        const chordHash = this._readChordHash(taPlayer, positionMs);
        const timeSec   = positionMs / 1000;
        // Chorus boosts all peak amplitudes slightly during the hook
        const chorusMult = 1 + chorus * cfg.chorusBoost;

        // Six spectral peaks, each anchored to a frequency band and driven by its own signal.
        // Centers drift slowly so the EQ stays alive on held notes and reacts to chord changes.
        const peaks = [
            // Sub-bass: sharp beat impulse at the far left
            {
                center: 0.06 + chordHash * 0.03,
                width:  0.055,
                amp:    beat * 0.90 * chorusMult,
            },
            // Bass: beat body + vocal low-end; slides left/right with chord
            {
                center: this._clamp(0.17 + (chordHash - 0.5) * 0.09 + Math.sin(timeSec * 0.28) * 0.025, 0.08, 0.28),
                width:  0.070,
                amp:    (beat * 0.65 + vocal * 0.38) * chorusMult,
            },
            // Vocal formant: dominant mid-low peak; chord shifts its position like a vowel resonance
            {
                center: this._clamp(0.35 + (chordHash - 0.5) * 0.22 + Math.sin(timeSec * cfg.formantDrift) * 0.055, 0.18, 0.58),
                width:  0.075 + arousal * 0.030,
                amp:    vocal * 0.90 * chorusMult,
            },
            // Mid: arousal-driven; counter-drifts so it stays separated from the formant
            {
                center: this._clamp(0.54 + (0.5 - chordHash) * 0.14 + Math.sin(timeSec * cfg.formantDrift * 1.4 + 1.1) * 0.04, 0.36, 0.70),
                width:  0.065,
                amp:    (vocal * 0.50 + arousal * 0.55) * chorusMult,
            },
            // Upper harmonic: chord-derived interval above the formant; valence tints the position
            {
                center: this._clamp(0.62 + chordHash * 0.18 + valence * 0.09, 0.55, 0.88),
                width:  0.060,
                amp:    (arousal * 0.65 + vocal * 0.28) * 0.85 * chorusMult,
            },
            // Air / presence: high-frequency shimmer; always somewhat active when arousal is high
            {
                center: this._clamp(0.83 + Math.sin(timeSec * 0.65) * 0.04, 0.74, 0.92),
                width:  0.065,
                amp:    (arousal * 0.50 + vocal * 0.15) * 0.70 * chorusMult,
            },
        ];

        for (let b = 0; b < cfg.numBars; b++) {
            const normX = cfg.numBars === 1 ? 0.5 : b / (cfg.numBars - 1);

            // Sum all peaks — because each is narrow, bars between peaks stay near restLevel
            let energy = cfg.restLevel;
            for (const p of peaks) {
                const dist = (normX - p.center) / p.width;
                energy += p.amp * Math.exp(-dist * dist * cfg.peakSharpness);
            }

            // Shimmer multiplies existing energy — animates peaks without raising valleys
            const shimmer    = 0.5 + 0.5 * Math.sin(timeSec * (1.8 + normX * 2.4) + this.bandPhase[b] + chordHash * Math.PI * 2);
            const ripple     = 0.5 + 0.5 * Math.sin(timeSec * (4.2 + arousal * 1.3) - normX * 9.5 + valence * Math.PI * 2);
            energy *= 1 + cfg.shimmerAmount * (shimmer * 0.7 + ripple * 0.3 - 0.5);

            const target = this._clamp(this._softGate(energy * cfg.gain, cfg.noiseGate), 0, 1);
            const alpha  = target > this.levels[b] ? cfg.smoothingUp : cfg.smoothingDown;
            this.levels[b] += (target - this.levels[b]) * alpha;
        }

        // 5-tap spatial blur: rounds off sharp valley edges between peaks.
        // Peaks are self-reinforcing (neighbors are also elevated), so they stay tall;
        // valleys get lifted by the spill from adjacent peaks, making transitions gradual.
        const raw = this._scratch;
        raw.set(this.levels);
        for (let b = 0; b < cfg.numBars; b++) {
            const c  = raw[b];
            const l1 = b > 0               ? raw[b - 1] : c;
            const l2 = b > 1               ? raw[b - 2] : l1;
            const r1 = b < cfg.numBars - 1 ? raw[b + 1] : c;
            const r2 = b < cfg.numBars - 2 ? raw[b + 2] : r1;
            this.levels[b] = c * 0.40 + (l1 + r1) * 0.20 + (l2 + r2) * 0.10;
        }
    }

    // Returns vocal amplitude normalised to [0,1].
    // Prefers getMaxVocalAmplitude() for exact normalisation; falls back to a slow
    // peak-follower so the signal stays well-scaled even if the API doesn't expose the max.
    _readVocalLevel(taPlayer, positionMs) {
        if (!taPlayer || typeof taPlayer.getVocalAmplitude !== "function") return 0;

        let raw = 0;
        try {
            raw = taPlayer.getVocalAmplitude(positionMs) || 0;
        } catch (_) {
            return 0;
        }

        if (!this._maxVocalAmplitude && typeof taPlayer.getMaxVocalAmplitude === "function") {
            try {
                this._maxVocalAmplitude = taPlayer.getMaxVocalAmplitude() || 0;
            } catch (_) {
                this._maxVocalAmplitude = 0;
            }
        }

        if (this._maxVocalAmplitude > 0)
            return this._clamp(raw / this._maxVocalAmplitude, 0, 1);

        // Fast attack (0.08), slow release (0.004) keeps the peak just above the signal
        const peakAlpha = raw > this._vocalPeak ? 0.08 : 0.004;
        this._vocalPeak += (raw - this._vocalPeak) * peakAlpha;
        return this._clamp(raw / Math.max(this._vocalPeak, 0.001), 0, 1);
    }

    // Sharp pulse [0,1] that decays from 1 at each beat onset to 0 by the next beat.
    // beatSharpness controls the decay curve — higher = more percussive transient spike.
    // Downbeats (position 0 or 1 within the bar) get a slight amplitude boost.
    _readBeatPulse(taPlayer, positionMs) {
        if (!taPlayer || typeof taPlayer.findBeat !== "function") return 0;

        try {
            const beat = taPlayer.findBeat(positionMs);
            if (!beat) return 0;

            const progress = typeof beat.progress === "function"
                ? beat.progress(positionMs)
                : (positionMs - beat.startTime) / Math.max(beat.duration || 1, 1);
            const downbeatBoost = beat.position <= 1 ? 1.15 : 0.9;
            const pulse = Math.pow(1 - this._clamp(progress, 0, 1), gameSettings.visualizer.beatSharpness);
            return this._clamp(pulse * downbeatBoost, 0, 1);
        } catch (_) {
            return 0;
        }
    }

    // Returns a sustained level [0.5,1] inside a chorus section, 0 otherwise.
    // A sine envelope on the chorus progress gives a smooth fade-in and fade-out
    // so the energy boost doesn't snap on/off at the section boundary.
    _readChorusLevel(taPlayer, positionMs) {
        if (!taPlayer || typeof taPlayer.findChorus !== "function") return 0;

        try {
            const chorus = taPlayer.findChorus(positionMs);
            if (!chorus) return 0;

            const progress = typeof chorus.progress === "function"
                ? this._clamp(chorus.progress(positionMs), 0, 1)
                : 0.5;
            return 0.75 + Math.sin(progress * Math.PI) * 0.25;
        } catch (_) {
            return 0;
        }
    }

    // Valence (v): −1 = negative/sad → +1 = positive/joyful
    // Arousal (a): −1 = calm/sleepy  → +1 = energetic/tense
    // Both axes are remapped from [-1,1] to [0,1] by the caller before use.
    _readValenceArousal(taPlayer, positionMs) {
        if (!taPlayer || typeof taPlayer.getValenceArousal !== "function") return null;

        try {
            const va = taPlayer.getValenceArousal(positionMs);
            if (!va || !Number.isFinite(va.a) || !Number.isFinite(va.v)) return null;
            return va;
        } catch (_) {
            return null;
        }
    }

    // Hashes the current chord name to a stable [0,1] value so the same chord always
    // produces the same formant/harmonic positions — giving the EQ a consistent spectral
    // "colour" per chord. Keeps the previous hash when no new chord is detected to avoid jumps.
    _readChordHash(taPlayer, positionMs) {
        if (!taPlayer || typeof taPlayer.findChord !== "function") return this._lastChordHash;

        try {
            const chord = taPlayer.findChord(positionMs);
            const name = chord?.name || "";
            if (name && name !== this._lastChordName) {
                this._lastChordName = name;
                this._lastChordHash = this._hashUnit(name);
            }
        } catch (_) {
            // Keep the previous chord color so the visualizer does not jump.
        }

        return this._lastChordHash;
    }

    // FNV-1a 32-bit hash normalised to [0,1]. Good bit-avalanche for short strings
    // means chord names that differ by one character map to very different positions.
    _hashUnit(text) {
        let hash = 2166136261;
        for (let i = 0; i < text.length; i++) {
            hash ^= text.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return ((hash >>> 0) % 10000) / 10000;
    }

    _clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    // Noise gate with a smooth linear ramp: below threshold → 0, above → rescaled to [0,1].
    // Avoids the hard click of a traditional gate while still hiding idle-state noise.
    _softGate(value, threshold) {
        if (value <= threshold) return 0;
        return (value - threshold) / (1 - threshold);
    }

    _wrap01(value) {
        return value - Math.floor(value);
    }

    _draw() {
        const cfg = gameSettings.visualizer;
        this.graphics.clear();

        const sceneW = this.scene.scale.width;
        const sceneH = this.scene.scale.height;

        // Bars fill 90% of screen width, centered
        const totalW = sceneW * 0.90;
        const stepX  = totalW / cfg.numBars;
        const barW   = Math.max(2, stepX * cfg.barWidthRatio);
        const startX = (sceneW - totalW) / 2 + cfg.xOffset;

        // Each half uses at most 44% of screen height so bars never clip off-screen
        const maxHalfH = sceneH * 0.44;
        const segH = Math.max(2, Math.floor((maxHalfH - cfg.segmentGap * cfg.numSegments) / cfg.numSegments));

        for (let b = 0; b < cfg.numBars; b++) {
            const barX = startX + b * stepX;

            // Smoothstep pinch: edge bars are shorter, not dimmer : avoids the cropped look
            // when high-energy frequencies land on the sides.
            // edgeT must be clamped to [0,1] before the smoothstep : outside that range
            // t*(t*(3-2*t)) goes negative, making activeSegs negative and all bars invisible.
            const normX      = b / (cfg.numBars - 1);
            const edgeT      = Math.min(1, Math.min(normX, 1 - normX) / cfg.edgeFadeWidth);
            const heightMult = edgeT * edgeT * (3 - 2 * edgeT); // smoothstep, safe on [0,1]
            const activeSegs = Math.round(this.levels[b] * cfg.numSegments * heightMult);

            // Bars growing upward from center
            for (let s = 0; s < activeSegs; s++) {
                const segY = this.y - (s + 1) * (segH + cfg.segmentGap);
                this.graphics.fillStyle(this.segmentColors[s], 1);
                this.graphics.fillRect(barX, segY, barW, segH);
            }

            // Mirror grows downward with one fewer bar so the axis sits at the midpoint
            // of the first upward segment rather than doubling it.
            const mirrorSegs = Math.max(0, activeSegs - 1);
            for (let s = 0; s < mirrorSegs; s++) {
                const segY = this.y + s * (segH + cfg.segmentGap);
                this.graphics.fillStyle(this.segmentColors[s], 1);
                this.graphics.fillRect(barX, segY, barW, segH);
            }
        }
    }

    _buildGradient() {
        const stops = gameSettings.visualizer.gradientStops;
        const n = gameSettings.visualizer.numSegments;
        return Array.from({ length: n }, (_, i) => {
            const t = (i / (n - 1)) * (stops.length - 1);
            const idx = Math.min(Math.floor(t), stops.length - 2);
            const f = t - idx;
            const a = stops[idx], b = stops[idx + 1];
            return (Math.round(a.r + (b.r - a.r) * f) << 16)
                 | (Math.round(a.g + (b.g - a.g) * f) << 8)
                 |  Math.round(a.b + (b.b - a.b) * f);
        });
    }

}

class BootScene extends Phaser.Scene {
    constructor() { super("BootScene"); }

    preload() {
        this.load.image("miku_standing", "media/Miku_standing.png");
        this.load.image("miku_knocking", "media/Miku_knocking.png");
    }

    create() {
        this.scene.start("TitleScene");
    }
}

class TitleScene extends Phaser.Scene {
    constructor() { super("TitleScene"); }

    create() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;
        this.introStarted = false;
        this.loaded = false;
        this.spinnerActive = true;

        // Solid dark background
        this.add.rectangle(cx, cy, this.scale.width, this.scale.height, 0x111111);

        // Star field (drawn each frame via update)
        this._buildStars(50);

        // Soft purple glow behind title area
        const glow = this.add.graphics();
        glow.fillStyle(0x999999, 0.07);
        glow.fillCircle(cx, cy - 120, 220);

        // Song title : large, shown during loading (may be empty until TextAlive resolves)
        this.titleText = this.add.text(cx, cy - 120, getSongTitle(), {
            fontFamily: gameSettings.fonts.main,
            fontSize: "72px",
            color: gameSettings.colors.textLight,
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 8,
            align: "center",
            wordWrap: { width: Math.min(this.scale.width * 0.85, 900), useAdvancedWrap: true }
        }).setOrigin(0.5);

        // Loading spinner
        this.spinner = this.add.graphics({ x: cx, y: cy + 50 });
        this.spinner.lineStyle(gameSettings.spinner.thickness, gameSettings.colors.primary, 1);
        this.spinner.beginPath();
        this.spinner.arc(0, 0, gameSettings.spinner.radius, 0, Math.PI * 1.5, false);
        this.spinner.strokePath();

        // Play button : invisible until loading finishes
        this.playButtonBg = this.add.rectangle(cx, cy + 50, gameSettings.button.width, gameSettings.button.height, gameSettings.colors.primary);
        this.playButtonBg.setAlpha(0);
        this.playButtonText = this.add.text(cx, cy + 50, "PLAY", {
            fontFamily: gameSettings.fonts.ui,
            fontSize: gameSettings.button.fontSize,
            color: gameSettings.colors.textLight,
            fontStyle: "bold"
        }).setOrigin(0.5).setAlpha(0);
        this.playButtonCaption = this.add.text(cx, cy + 50 + gameSettings.button.height / 2 + 12, 'スタート', {
            fontFamily: gameSettings.fonts.ui,
            fontSize: "16px",
            color: "#AAAAAA",
        }).setOrigin(0.5).setAlpha(0);

        this.playButtonBg.on('pointerover', () => {
            if (!this.introStarted) this.playButtonBg.fillColor = gameSettings.colors.primaryHover;
        });
        this.playButtonBg.on('pointerout', () => {
            if (!this.introStarted) this.playButtonBg.fillColor = gameSettings.colors.primary;
        });
        this.playButtonBg.on('pointerdown', () => this.startIntro());

        // Hard Mode toggle 
        this._buildHardModeToggle();
        // Low Power toggle
        this._buildLowPowerToggle();
    }

    _buildStars(count) {
        this.starData = [];
        for (let i = 0; i < count; i++) {
            this.starData.push({
                x: Math.random() * this.scale.width,
                y: Math.random() * this.scale.height,
                r: 1 + Math.random() * 2,
                phase: Math.random() * Math.PI * 2,
                speed: 0.0008 + Math.random() * 0.0015,
            });
        }
        this.starGraphics = this.add.graphics();
    }

    _buildHardModeToggle() {
        const padX = 14, padY = 14;
        const btnW = 152, btnH = 38;
        const descH = 28;
        const bx = this.scale.width - padX - btnW / 2;
        // Sit above the low-power widget (which occupies descH + 4 + btnH above the bottom padding)
        const lpWidgetH = descH + 4 + btnH;
        const by = this.scale.height - padY - btnH / 2 - lpWidgetH - 8;

        this.add.text(bx, by - btnH / 2 - descH / 2 - 4, 'ハードモード  Disables click helper', {
            fontFamily: gameSettings.fonts.ui,
            fontSize: "12px",
            color: "#555555",
        }).setOrigin(0.5);

        this.hmBg = this.add.rectangle(bx, by, btnW, btnH, 0x1e1e1e).setAlpha(0.9);
        this.hmBg.setStrokeStyle(1, 0x444444);
        this.hmText = this.add.text(bx, by, 'Hard Mode', {
            fontFamily: gameSettings.fonts.ui,
            fontSize: "16px",
            color: "#777777",
        }).setOrigin(0.5);
        this.hmBg.setInteractive({ useHandCursor: true });
        this.hmBg.on('pointerdown', () => this._toggleHardMode());
    }

    _toggleHardMode() {
        hardMode = !hardMode;
        this.hmText.setText(hardMode ? 'Hard Mode: ON' : 'Hard Mode');
        this.hmText.setColor(hardMode ? '#8A2BE2' : '#777777');
        this.hmBg.fillColor = hardMode ? 0x2a1060 : 0x1e1e1e;
    }

    _buildLowPowerToggle() {
        const padX = 14, padY = 14;
        const btnW = 152, btnH = 38;
        const descH = 28; // height reserved for the description line above the button
        const bx = this.scale.width - padX - btnW / 2;
        const by = this.scale.height - padY - btnH / 2;

        // Description label above the button
        this.add.text(bx, by - btnH / 2 - descH / 2 - 4, '省電力モード  Disables all particle effects', {
            fontFamily: gameSettings.fonts.ui,
            fontSize: "12px",
            color: "#555555",
        }).setOrigin(0.5);

        this.lpBg = this.add.rectangle(bx, by, btnW, btnH, 0x1e1e1e).setAlpha(0.9);
        this.lpBg.setStrokeStyle(1, 0x444444);
        this.lpText = this.add.text(bx, by, 'Low Power', {
            fontFamily: gameSettings.fonts.ui,
            fontSize: "16px",
            color: "#777777",
        }).setOrigin(0.5);
        this.lpBg.setInteractive({ useHandCursor: true });
        this.lpBg.on('pointerdown', () => this._toggleLowPower());
    }

    _toggleLowPower() {
        lowPowerMode = !lowPowerMode;
        gameSettings.globalParticleToggle = !lowPowerMode;
        this.lpText.setText(lowPowerMode ? 'Low Power: ON' : 'Low Power');
        this.lpText.setColor(lowPowerMode ? '#8A2BE2' : '#777777');
        this.lpBg.fillColor = lowPowerMode ? 0x2a1060 : 0x1e1e1e;
        if (lowPowerMode) this.starGraphics.clear();
    }

    update(time) {
        if (this.spinnerActive) {
            this.spinner.rotation += gameSettings.spinner.rotationSpeed;
        }
        if (!lowPowerMode && this.starGraphics) {
            this.starGraphics.clear();
            for (const s of this.starData) {
                const alpha = 0.15 + 0.75 * (0.5 + 0.5 * Math.sin(s.phase + time * s.speed));
                this.starGraphics.fillStyle(0xffffff, alpha);
                this.starGraphics.fillCircle(s.x, s.y, s.r);
            }
        }
        if (!this.loaded && isTextAliveReady && isIntroVideoReady) {
            this.loaded = true;
            this._onLoadComplete();
        }
    }

    _onLoadComplete() {
        this.titleText.setText(getSongTitle());
        this.tweens.add({ targets: [this.spinner], alpha: 0, duration: 500 });
        this.tweens.add({
            targets: [this.playButtonBg, this.playButtonText, this.playButtonCaption],
            alpha: 1,
            duration: 600,
            delay: 200,
            onComplete: () => {
                this.spinnerActive = false;
                this.playButtonBg.setInteractive({ useHandCursor: true });
            }
        });
    }

    startIntro() {
        if (this.introStarted) return;
        this.introStarted = true;
        this.gameStarted = false;
        this.playButtonBg.disableInteractive();
        this.playButtonBg.fillColor = gameSettings.colors.primaryHover;
        this.playButtonBg.setAlpha(0.65);
        this.playButtonText.setAlpha(0.65);
        playIntroVideo(
            () => this.scene.stop("TitleScene"),   // video ended: clean up this scene
            () => this.resetPlayButton(),            // playback blocked: reset UI
            () => {                                  // fade begins: launch game behind video
                this.gameStarted = true;
                taPlayer.requestPlay();
                this.scene.launch("GameScene");
            }
        );
    }

    resetPlayButton() {
        if (this.gameStarted) {
            this.scene.stop("GameScene");
            this.gameStarted = false;
        }
        this.introStarted = false;
        this.playButtonBg.setInteractive({ useHandCursor: true });
        this.playButtonBg.fillColor = gameSettings.colors.primary;
        this.playButtonBg.setAlpha(1);
        this.playButtonText.setAlpha(1);
    }
}

class GameScene extends Phaser.Scene {
    constructor() { super("GameScene"); }
    create() {
        this.fallTimeMultiplier = gameSettings.lyrics.fallTimeMsMultiplier;
        this.fallTime = gameSettings.lyrics.fallTimeMs * this.fallTimeMultiplier;
        this.destroyThreshold = gameSettings.lyrics.destroyOverflowRatio;
        this.songStarted = false;
        this.songEndTriggered = false;

        this.catcher = new Catcher(this, this.scale.height / 2);
        this.waveState = new WaveState();

        this.comboCounter = new ComboCounter(this);

        this.charGroup = this.physics.add.group();
        this.physics.add.overlap(this.catcher.sprite, this.charGroup, this.catchChar, null, this);

        this.input.keyboard.on('keydown-SPACE', () => {
            this.catcher.toggleDirection();
        }, this);
        this.input.on('pointerdown', () => {
            this.catcher.toggleDirection();
        }, this);
        this.activeChars = [];
        this.pendingChars = [];
        this.disintegratingChars = []; // characters currently dissolving through the catcher mask
        this.dyingStrips = [];
        this.lastBeatIndex = -1;
        this.fallDistance = (this.scale.width + gameSettings.lyrics.startXOffset) - this.catcher.x;
        this.charSize = parseInt(gameSettings.lyrics.fontSize);
        this.lastSpawnedY = null;

        this.backgroundChar = new BackgroundChar(this, taPlayer);
        this.time.addEvent({ delay: 500, callback: () => this.backgroundChar.clear() });

        this.charSpawnYPointer = new CharSpawnYPointer(
            this.scale.height / 2
        );

        if (taPlayer && taPlayer.video) {
            this.loadLyrics(taPlayer.video.firstChar);
            taPlayer.volume = gameSettings.songVolume;
        }

        this.fpsText = this.add.text(10, 10, "FPS: 0", {
            fontFamily: gameSettings.fonts.ui,
            fontSize: "24px",
            color: gameSettings.colors.textMain,
            stroke: "#000000",
            strokeThickness: 3
        }).setOrigin(0, 0).setDepth(1000);

        this.FLBackground = new FLTimelineBackground(this, this.scale.width, this.scale.height);
        this.FLBackground.setDepth(-10000);

        this.visualizer = new MusicVisualizer(this, this.scale.height / 2);

        this.lyricsDelay = gameSettings.lyrics.lyricsDelay;
    }

    update(time, delta) {
        this.fpsText.setText("FPS: " + Math.round(this.game.loop.actualFps));

        // Cap delta to 100 ms (â‰ˆ 10 fps minimum) so a tab-unfocus spike can't throw the
        // spawn pointer or catcher to an extreme position on the first resumed frame.
        const deltaMs = Math.min(delta, 100);
        const deltaSec = deltaMs / 1000;
        const w = this.scale.width;
        const h = this.scale.height;

        if (!taPlayer) return;

        if (taPlayer.isPlaying) {
            this.songStarted = true;
        } else {
            // Song stopped after it had been playing → natural end
            if (this.songStarted && !this.songEndTriggered) {
                this.songEndTriggered = true;
                this.startSongEndSequence();
            }
            return;
        }

        const songTime = taPlayer.timer?.position ?? 0;
        const startX = w + gameSettings.lyrics.startXOffset;

        this.visualizer.update(taPlayer, this.activeChars.length > 0);

        this.FLBackground.update(songTime, startX, this.catcher.x, this.fallTime);
        this.catcher.update(deltaSec, h);
        this.charSpawnYPointer.update(deltaSec, h);
        this.spawnPendingChars(songTime, startX, w, h);
        this.updateActiveChars(songTime, startX, deltaSec);
        this.updateDisintegratingChars(deltaMs);
        this.destroyStrips(deltaMs);
        this.backgroundChar.update(songTime, deltaMs);

        const beat = taPlayer.findBeat?.(songTime);
        if (beat && beat.index !== this.lastBeatIndex) {
            this.lastBeatIndex = beat.index;
            if (!lowPowerMode) {
                this.triggerBeatPinch();
                this.catcher.triggerBeatBob();
            }
        }
    }

    triggerBeatPinch() {
        const targets = [];
        for (const ac of this.activeChars) {
            if (ac.barrelFX) targets.push(ac.barrelFX);
        }
        if (targets.length === 0) return;
        const cfg = gameSettings.beatPinch;
        this.tweens.add({
            targets,
            amount: cfg.amount,
            duration: cfg.duration,
            yoyo: true,
            ease: cfg.ease,
        });
    }

    // Advances each caught character through its dissolve animation each frame
    updateDisintegratingChars(delta) {
        for (let i = this.disintegratingChars.length - 1; i >= 0; i--) {
            const char = this.disintegratingChars[i];
            if (char.updateDisintegration(this.catcher.x, delta)) {
                this.disintegratingChars.splice(i, 1);
            }
        }
    }

    getCharColor(char) {
        // Phrase sets the base color; word index within the phrase picks a brightness tint,
        // so characters within the same phrase stay recognizably similar but are still distinguishable.
        const word = char.parent;
        const phrase = word?.parent;

        if (!phrase) {
            return gameSettings.colors.textMain;
        }

        const phraseIndex = taPlayer.video.phrases.indexOf(phrase);

        const phraseColor =
            gameSettings.phraseColors[phraseIndex % gameSettings.phraseColors.length];

        const wordIndex = phrase.children.indexOf(word);


        const tint =
            gameSettings.tintCycle[wordIndex % gameSettings.tintCycle.length];

        return tintColor(phraseColor, tint);
    }

    spawnPendingChars(time, startX, sceneWidth, sceneHeight) {
        while (this.pendingChars.length > 0) {
            const nextChar = this.pendingChars[0];
            const yPos = this.charSpawnYPointer.y;
            let auraOnSpawn = false;

            let effectiveStartTime = nextChar.startTime + this.lyricsDelay;

            if (time >= effectiveStartTime - this.fallTime) {

                // If songTime jumped ahead (tab unfocus, TextAlive timer drift, etc.) a character
                // might be so late that it would already be at or past the catcher the moment it
                // spawns. Spawning it would trigger the overlap-offset chain for every queued
                // character and scatter them across the screen. Drop it silently instead. (was a weird bug encountered time to time)
                const progress = (time - (nextChar.startTime - this.fallTime)) / this.fallTime;
                if (progress >= 1 + this.destroyThreshold) {
                    this.pendingChars.shift();
                    continue;
                }

                // check if wavestate changed direction
                if (this.waveState.advance(time)) {
                    this.charSpawnYPointer.flipDirection();
                    auraOnSpawn = !hardMode;
                }

                let textToRender = nextChar.text;

                let spawnX = startX;
                let spawnY = this.charSpawnYPointer.y;

                if (gameSettings.lyrics.trailingChars.includes(textToRender)) {
                    spawnY = this.lastSpawnedY ?? spawnY;
                    // Override effectiveStartTime so the char travels at normal speed (same startX,
                    // same fallDistance) but arrives one preceding-char-width later than its host,
                    // keeping a constant spatial gap regardless of unreliable TextAlive timestamps.
                    const prevAc = this.activeChars[this.activeChars.length - 1];
                    if (prevAc) {
                        effectiveStartTime = prevAc.effectiveStartTime
                            + Math.round(prevAc.obj.width * this.fallTime / this.fallDistance);
                    }
                } else if (gameSettings.lyrics.leadingChars.includes(textToRender)) {
                    const nextPending = this.pendingChars[1];
                    if (nextPending) {
                        effectiveStartTime = (nextPending.startTime + this.lyricsDelay)
                            - Math.round(this.charSize * this.fallTime / this.fallDistance);
                    }
                }

                const charObj = this.add.text(
                    spawnX,
                    spawnY,
                    textToRender,
                    {
                        fontFamily: getLyricFont(textToRender),
                        fontSize: gameSettings.lyrics.fontSize,
                        color: this.getCharColor(nextChar)
                    }
                ).setOrigin(0.5);

                // For normal characters, shift vertically when they would overlap the previous one.
                if (
                    !gameSettings.lyrics.trailingChars.includes(textToRender) &&
                    this.activeChars.length > 0
                ) {
                    const prev = this.activeChars[this.activeChars.length - 1];
                    const prevProgress = (time - (prev.effectiveStartTime - this.fallTime)) / this.fallTime;
                    const prevX = prev.startX - (prev.startX - this.catcher.x) * prevProgress;
                    const gap = (startX - charObj.width * 0.5) - (prevX + prev.obj.width * 0.5);
                    if (gap < gameSettings.lyrics.minCharSpacing) {
                        spawnY = Phaser.Math.Clamp(
                            spawnY + this.charSpawnYPointer.direction * gameSettings.lyrics.overlapYShift,
                            gameSettings.lyrics.marginY,
                            sceneHeight - gameSettings.lyrics.marginY
                        );
                        charObj.y = spawnY;
                    }
                }

                this.lastSpawnedY = spawnY;

                const stripLength = nextChar.endTime - nextChar.startTime - this.charSize;

                this.charGroup.add(charObj);
                charObj.body.setAllowGravity(false);
                charObj.body.setSize(this.charSize, this.charSize, true);

                const ac = new ActiveChar(
                    this,
                    nextChar,
                    charObj,
                    spawnX,
                    spawnY,
                    stripLength,
                    this.charSize / 5,
                    auraOnSpawn,
                    effectiveStartTime
                );
                charObj.enableFilters();
                ac.barrelFX = charObj.filters.internal.addBarrel(1.0);
                this.activeChars.push(ac);

                // Slow the spawn pointer while a long strip is live, then restore
                if (stripLength >= gameSettings.lyrics.minDelayLongChar) {
                    this.charSpawnYPointer.changeSpeed(gameSettings.catcher.slowedSpeed);
                    this.time.delayedCall(stripLength, () => {
                        this.charSpawnYPointer.changeSpeed(gameSettings.charSpawnYPointer.speed);
                    });
                }

                this.pendingChars.shift();
            } else {
                break;
            }
        }
    }

    destroyStrips(deltaMs) {
        for (let i = this.dyingStrips.length - 1; i >= 0; i--) {
            const item = this.dyingStrips[i];

            item.progress += deltaMs / item.stripDuration;

            const remainingWidth = item.maxWidth * (1 - item.progress);
            item.strip.setSize(Math.max(0, remainingWidth), item.strip.height);

            if (item.progress >= 1) {
                item.strip.destroy();
                // obj is null when the character was caught (disintegration owns its lifecycle)
                if (item.obj) item.obj.destroy();
                this.dyingStrips.splice(i, 1);
            }
        }

        // Slow the catcher while strips drain so the player can't rush to the next character
        // while the current note is still "playing" : long held notes naturally create pacing gaps.
        this.catcher.changeMaxSpeed(
            this.dyingStrips.length > 0
                ? gameSettings.catcher.slowedSpeed
                : gameSettings.catcher.maxSpeed
        );
    }

    updateActiveChars(time, startX, delta) {
        for (let i = this.activeChars.length - 1; i >= 0; i--) {
            const item = this.activeChars[i];
            const shouldRemove = item.update(time, this.catcher.x, this.fallTime, delta, this.destroyThreshold, this.fallDistance, this.charSize, this.dyingStrips);
            if (shouldRemove) {
                this.activeChars.splice(i, 1);
                this.comboCounter.miss();
            }
        }
    }

    catchChar(catcher, charObj) {
        const idx = this.activeChars.findIndex(l => l.obj === charObj);
        if (idx === -1) return;

        const char = this.activeChars[idx];
        this.activeChars.splice(idx, 1);

        char.spawnCatchParticles();

        // Hand the character off to the disintegration path:
        // strip retires normally, aura fades, and the text object dissolves through the mask
        char.startDisintegration(this.dyingStrips, this.fallDistance, this.fallTime);
        this.disintegratingChars.push(char);

        this.comboCounter.increment();

        const charDuration = char.char.endTime - char.char.startTime;
        this.backgroundChar.show(charObj.text, char.color, charDuration, taPlayer.timer?.position ?? 0);

        this.catcher.playKnockAnim();
    }

    startSongEndSequence() {
        // Disable player input during fade-out
        this.input.keyboard.enabled = false;
        this.input.enabled = false;

        const w = this.scale.width;
        const h = this.scale.height;
        const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000)
            .setAlpha(0).setDepth(99999);

        this.tweens.add({
            targets: overlay,
            alpha: 1,
            duration: gameSettings.endScreen.fadeOutDurationMs,
            ease: 'Quad.easeIn',
            onComplete: () => {
                this.scene.launch('EndScene');
                this.scene.stop();
            },
        });
    }

    loadLyrics(firstChar) {
        this.pendingChars = [];
        let char = firstChar;
        while (char) {
            if (char.text.trim().length > 0) this.pendingChars.push(char);
            char = char.next;
        }
        this.pendingChars.sort((a, b) => a.startTime - b.startTime);
    }


}

class EndScene extends Phaser.Scene {
    constructor() { super("EndScene"); }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;

        // Solid black background
        this.add.rectangle(w / 2, h / 2, w, h, 0x000000);

        // Twinkling star field
        this._buildStars(gameSettings.endScreen.starCount, w, h);

        // Credits panel (left half)
        this._buildCredits(w, h);

        // Fade in from black
        const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000)
            .setAlpha(1).setDepth(99999);
        this.tweens.add({
            targets: overlay,
            alpha: 0,
            duration: gameSettings.endScreen.fadeInDurationMs,
            ease: 'Quad.easeOut',
            onComplete: () => overlay.destroy(),
        });
    }

    _buildStars(count, w, h) {
        this.starData = [];
        for (let i = 0; i < count; i++) {
            this.starData.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: 1 + Math.random() * 2,
                phase: Math.random() * Math.PI * 2,
                speed: 0.0008 + Math.random() * 0.0015,
            });
        }
        this.starGraphics = this.add.graphics();
    }

    _buildCredits(w, h) {
        const cx = w / 2;

        this.add.text(cx, h * 0.12, 'Credits', {
            fontFamily: gameSettings.fonts.main,
            fontSize: "52px",
            color: gameSettings.colors.textLight,
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 6,
        }).setOrigin(0.5);

        const lines = [
            'アニメーション / Animations',
            '─────────────────',
            'LeLad (intro animation)',
            'Galaxy77 (pixel art)',
            'プログラム / Programming',
            '─────────────────',
            'PouchyCorp',
            'Alixz',
            'Spacy',
            '─────────────────',
            'Thank you for playing !',
        ];

        this.add.text(cx, h * 0.25, lines.join('\n'), {
            fontFamily: gameSettings.fonts.main,
            fontSize: "20px",
            color: "#BBBBBB",
            align: "center",
            lineSpacing: 8,
            stroke: "#000000",
            strokeThickness: 3,
        }).setOrigin(0.5, 0);
    }

    update(time) {
        if (!lowPowerMode && this.starGraphics && this.starData) {
            this.starGraphics.clear();
            for (const s of this.starData) {
                const alpha = 0.15 + 0.75 * (0.5 + 0.5 * Math.sin(s.phase + time * s.speed));
                this.starGraphics.fillStyle(0xffffff, alpha);
                this.starGraphics.fillCircle(s.x, s.y, s.r);
            }
        }
    }
}

document.body.style.backgroundColor = gameSettings.colors.background;
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
introVideoElement = createIntroVideoElement();

const config = {
    type: Phaser.AUTO,
    parent: "game-container",
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: true,
    physics: { default: "arcade" },
    scene: [BootScene, TitleScene, GameScene, EndScene],
    scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH }
};

const game = new Phaser.Game(config);

const taPlayer = new Player({ app: { token: gameSettings.api.token }, mediaElement: document.querySelector("#media"), valenceArousalEnabled: true, vocalAmplitudeEnabled: true });

taPlayer.addListener({
    onTimerReady() { isTextAliveReady = true; },
});
taPlayer.createFromSongUrl(gameSettings.api.songUrl);



