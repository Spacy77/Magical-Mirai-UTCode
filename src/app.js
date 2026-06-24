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
        "#FFFFFF", 
        "#7DD3FC", 
        "#A7F3D0", 
        "#FDE68A", 
        "#F9A8D4", 
        "#C4B5FD", 
        "#FDBA74", 
    ],

    // -- Fonts ----------------------------------------------------------------
    fonts: {
        main:   '"EnkaDotMincho24", "Yu Gothic", "Hiragino Sans", sans-serif',
        ui:     '"EnkaDotMincho24", "Yu Gothic", "Hiragino Sans", sans-serif',
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
        responsiveness: 25.0, // exponential-smoothing factor : higher = snappier tracking
        marginY: 80,         // minimum distance the catcher keeps from the top/bottom edges
        animTime: 100
    },

    // -- Lyric characters -----------------------------------------------------
    lyrics: {
        fallTimeMs: 1700,          // time (ms) for a character to travel from spawn to the catcher
        fallTimeMsMultiplier: 1,   // global speed multiplier applied on top of fallTimeMs (1 = default)
        startXOffset: 100,         // how many px past the right edge characters spawn off-screen
        marginY: 100,              // vertical safe zone : characters never spawn closer than this to the top/bottom
        fontSize: "130px",         // CSS font-size used for all lyric text objects

        // A character that has moved past the catcher by more than (destroyOverflowRatio Ã— fallDistance)
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
        leadingCharShift: 1.1,  // fraction of fontSize to shift leading punctuation left so the next char follows it naturally

        // Japanese closing punctuation : always attached directly to the right edge of the previous character
        trailingChars: [
            "ã€", "ã€‚", "ï¼", "ï¼Ÿ", "ã€", "ã€", "ï¼‰", "ï¼½", "ã€‘", "ã€‰", "ã€‹"
        ],

        // Japanese opening punctuation : shifted left so the body text starts after them
        leadingChars: [
            "ã€Œ", "ã€Ž", "ï¼ˆ", "ï¼»", "ã€", "ã€ˆ", "ã€Š"
        ],

        lyricsDelay: 250
    },

    // -- Background large-character flash effect -------------------------------
    // When a character is caught, a giant version of it briefly appears behind the scene.
    backgroundLyrics: {
        fontSize: "500px",          // size of the background character
        maxDurationBGEffect: 200,   // max time (ms) the effect stays fully visible
        maxDurationBGAnim: 100,     // max time (ms) of the scale-in animation
        sizeChangeCoeff: 5,         // how aggressively the size pulses during the animation
        colors: ["#D00000", "#FFB703", "#2A9D8F", "#3A86FF", "#8338EC"],  // palette cycled per catch
        startAlpha: 0.5             // initial opacity of the background character
    },

    // -- Combo counter HUD (top-right) ----------------------------------------
    combo: {
        xOffset: 100,          // distance from right edge for value texts
        mainYOffset: 125,      // Y of combo-points value
        scoreYOffset: 175,     // Y of total score value
        fontSize: 100,         // px (numeric so it's easier to do digit-width math)
        color: "#ffffff",
        ghostAlpha: 0.2,       // opacity of the ghost (echo) copy of the counter
        mainScaleBounce: 1.1,  // scale the main counter briefly grows to on increment
        ghostScaleBounce: 1.4, // scale the ghost briefly grows to on increment (more exaggerated)
        animDuration: 500,     // duration (ms) of the bounce-back tween
        displayXOffset: 230,   // distance from right edge for label texts
        displayMainYOffset: 90,   // Y of "Combo" label
        displayScoreYOffset: 170, // Y of "Score" label
        displayFontSize: 40
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
        bgColor: 0x434b55,        // main panel background
        topBarColor: 0x2f353c,    // darker strip along the top (ruler area)
        majorLineColor: 0x252a30, // beat / bar divider lines
        minorLineColor: 0x39414a, // subdivision lines between beats
        textColor: "#d4d8dc",     // measure-number label color
        topBarHeight: 36,         // height (px) of the ruler strip
        majorSpacing: 250,        // horizontal pixels between major (bar) lines
        subdivisions: 4,          // how many minor lines to draw between each major line
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
        radiusMultiplier: 0.50, // circle radius = max(charWidth, charHeight) Ã— this
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
    // Mirrored vertically around the screen center; always visible at low opacity.
    visualizer: {
        numBars: 45,
        barWidthRatio: 0.25,   // bar width as a fraction of per-bar cell (rest is gap)
        numSegments: 14,
        segmentGap: 3,
        xOffset: 200,          // px to shift the bar group right of center (positive = right)
        backgroundAlpha: 0.66,
        gain: 1.0,
        restLevel: 0.006,
        vocalWeight: 0.66,
        beatWeight: 0.36,
        arousalWeight: 0.04,
        chorusBoost: 0.055,
        shimmerAmount: 0.22,
        beatSharpness: 5.2,
        formantDrift: 0.32,
        peakSharpness: 1.9,
        noiseGate: 0.045,
        smoothingUp: 0.62,
        smoothingDown: 0.14,
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
let introVideoElement = null;
let introVideoFrame = null;

function getSongTitle() {
    const song = taPlayer?.data?.song;
    return song?.name || song?.songName || song?.title || "Loading Song ...";
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
        this.totalScore = 0;
        this.varXOffset = 0; // grows as the digit count increases to keep text right-aligned

        const cfg = gameSettings.combo;
        this.valueX   = scene.scale.width - cfg.xOffset;
        this.displayX = scene.scale.width - cfg.displayXOffset;

        const textStyle = (size, thickness) => ({
            fontFamily: gameSettings.fonts.ui,
            fontSize: `${size}px`,
            color: cfg.color,
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: thickness,
        });

        this.ghostText = scene.add.text(this.valueX, cfg.mainYOffset, "0", textStyle(cfg.fontSize, 4))
            .setOrigin(0, 1).setAlpha(cfg.ghostAlpha).setDepth(100);

        this.mainText = scene.add.text(this.valueX, cfg.mainYOffset, "0", textStyle(cfg.fontSize, 6))
            .setOrigin(0, 1).setDepth(101);

        this.totalScoreText = scene.add.text(this.valueX, cfg.scoreYOffset, "0", textStyle(cfg.fontSize / 2, 6))
            .setOrigin(0, 1).setDepth(102);

        this.displayComboText = scene.add.text(this.displayX, cfg.displayMainYOffset, "Combo", textStyle(cfg.displayFontSize, 6))
            .setOrigin(0, 1).setDepth(102);

        this.displayTotalScoreText = scene.add.text(this.displayX, cfg.displayScoreYOffset, "Score", textStyle(cfg.displayFontSize, 6))
            .setOrigin(0, 1).setDepth(102);
    }

    increment() {
        this.combo++;
        const prevLen = this.comboPoints.toString().length;
        this.comboPoints = this.calcPointsCurrentCombo(this.combo);

        // Each new digit widens the displayed number; shift all anchors left to keep right-edge aligned
        if (this.comboPoints.toString().length > prevLen) {
            this.varXOffset += gameSettings.combo.fontSize / 2;
            this.ghostText.x             = this.valueX   - this.varXOffset;
            this.mainText.x              = this.valueX   - this.varXOffset;
            this.totalScoreText.x        = this.valueX   - this.varXOffset;
            this.displayComboText.x      = this.displayX - this.varXOffset;
            this.displayTotalScoreText.x = Math.min(this.displayTotalScoreText.x, this.displayX - this.varXOffset);
        }

        this.updateText();
        this.playAnimation();
    }

    reset() {
        if (this.combo === 0) return;
        this.totalScore += this.comboPoints;
        this.combo = 0;
        this.comboPoints = 0;
        this.varXOffset = 0;

        this.ghostText.x           = this.valueX;
        this.mainText.x            = this.valueX;
        this.totalScoreText.x      = this.valueX;
        this.displayComboText.x    = this.displayX;
        this.displayTotalScoreText.x = this.displayX;

        this.updateText();
        this.scene.tweens.killTweensOf([this.mainText, this.ghostText]);
        this.mainText.setScale(1);
        this.ghostText.setScale(1);
    }

    updateText() {
        this.mainText.setText(this.comboPoints.toString());
        this.ghostText.setText(this.comboPoints.toString());
        this.totalScoreText.setText((this.comboPoints + this.totalScore).toString());
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

    // Returns true when a flip fires — the caller uses this to trigger the spawn-aura effect.
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
        const d = gameSettings.disintegration;

        // -- Phase 1: hold the character at the catcher while the strip drains --
        if (!this.dissolveStarted) {
            this.obj.x = catcherX + this.obj.width / 2;
            this.dissolveWait += delta;
            if (this.dissolveWait >= this.dissolveDelay) {
                this.dissolveStarted = true;
            }
            return false;
        }

        // -- Phase 2: squish the character into the wall, left edge first --
        // The right edge stays anchored at (catcherX + charWidth) while scaleX shrinks
        // to zero. This makes the left boundary recede rightward - the left side disappears
        // first. Alpha fades simultaneously. A slight scaleY bulge adds the squishy feel.
        this.dissolveElapsed += delta;
        const t = Math.min(this.dissolveElapsed / d.dissolveDuration, 1);

        const eased = t * t; // ease-in: clings briefly then snaps away
        const newScaleX = 1 - eased;
        const rightAnchor = catcherX + this.obj.width;

        this.obj.scaleX = newScaleX;
        this.obj.x = rightAnchor - (this.obj.width * newScaleX) / 2;
        this.obj.alpha = 1 - eased;
        this.obj.scaleY = 1 + 0.25 * Math.sin(Math.PI * t); // bulge peaks at t=0.5

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
        // Pool of measure-number text objects : reused every frame to avoid GC churn
        this._labelPool = [];

        this.add(this.graphics);

        scene.add.existing(this);

        this.redraw();
    }

    // Returns an existing pooled label or creates a new one if the pool is exhausted
    _getOrCreateLabel(index) {
        if (index >= this._labelPool.length) {
            const lbl = this.scene.add.text(0, 8, '', {
                fontFamily: gameSettings.fonts.ui,
                fontSize: "16px",
                color: gameSettings.FLBackground.textColor
            });
            this._labelPool.push(lbl);
            this.add(lbl);
        }
        return this._labelPool[index];
    }

    update(songTime, startX, catcherX, fallTime) {
        const pixelsPerMs = (startX - catcherX) / fallTime;
        this.scrollX = songTime * pixelsPerMs;
        this.redraw();
    }

    redraw() {
        const g = this.graphics;

        g.clear();

        // Main background
        g.fillStyle(gameSettings.FLBackground.bgColor);
        g.fillRect(0, 0, this.width, this.height);

        const majorSpacing = gameSettings.FLBackground.majorSpacing;
        const minorSpacing = majorSpacing / gameSettings.FLBackground.subdivisions;

        // Align grid so it loops infinitely
        const offset = this.scrollX % majorSpacing;

        // Minor grid lines
        g.lineStyle(1, gameSettings.FLBackground.minorLineColor, 1);
        for (let x = -offset; x < this.width + majorSpacing; x += minorSpacing) {
            g.beginPath();
            g.moveTo(x, this.topBarHeight);
            g.lineTo(x, this.height);
            g.strokePath();
        }

        // Major grid lines + measure labels
        g.lineStyle(2, gameSettings.FLBackground.majorLineColor, 1);

        const firstMeasure = Math.floor(this.scrollX / majorSpacing);
        let measure = firstMeasure + 1;
        let labelIndex = 0;

        for (let x = -offset; x < this.width + majorSpacing; x += majorSpacing) {
            g.beginPath();
            g.moveTo(x, 0);
            g.lineTo(x, this.height);
            g.strokePath();

            const lbl = this._getOrCreateLabel(labelIndex++);
            lbl.setPosition(x + 8, 8).setText(String(measure)).setVisible(true);
            measure++;
        }

        // Hide any pool labels that are not needed this frame
        for (let i = labelIndex; i < this._labelPool.length; i++) {
            this._labelPool[i].setVisible(false);
        }

        // Top ruler bar (drawn over the grid so labels sit on top of it)
        g.fillStyle(gameSettings.FLBackground.topBarColor);
        g.fillRect(0, 0, this.width, this.topBarHeight);

        // Bottom border of ruler bar
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

    constructor(scene) {
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
                color: gameSettings.backgroundLyrics.colors[0]
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

    show(charText, duration, currentTime) {
        this.startTime = currentTime;
        this.endTime = currentTime + duration;

        if (this.isHeart(charText)) {
            this.enterHeartMode();
            return;
        }

        this.exitHeartMode();

        this.text.setText(charText);
        this.text.setAlpha(gameSettings.backgroundLyrics.startAlpha);

        const color = gameSettings.backgroundLyrics.colors[
            Math.floor(Math.random() * gameSettings.backgroundLyrics.colors.length)
        ];
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
        this.levels = new Float32Array(gameSettings.visualizer.numBars).fill(0);
        this.bandPhase = new Float32Array(gameSettings.visualizer.numBars);
        this.segmentColors = this._buildGradient();
        this.graphics = scene.add.graphics().setDepth(-5).setAlpha(gameSettings.visualizer.backgroundAlpha);
        this._maxVocalAmplitude = 0;
        this._vocalPeak = 0.001;
        this._lastChordName = "";
        this._lastChordHash = 0.5;

        for (let b = 0; b < this.bandPhase.length; b++)
            this.bandPhase[b] = this._hashUnit(`bar-${b}`) * Math.PI * 2;
    }

    update(taPlayer) {
        const positionMs = taPlayer?.timer?.position ?? taPlayer?.mediaPosition ?? 0;
        this._readTextAliveSignals(taPlayer, positionMs);
        this._draw();
    }

    _readTextAliveSignals(taPlayer, positionMs) {
        const cfg = gameSettings.visualizer;
        const vocal = this._readVocalLevel(taPlayer, positionMs);
        const beat = this._readBeatPulse(taPlayer, positionMs);
        const chorus = this._readChorusLevel(taPlayer, positionMs);
        const va = this._readValenceArousal(taPlayer, positionMs);
        const arousal = va ? this._clamp((va.a + 1) * 0.5, 0, 1) : 0.5;
        const valence = va ? this._clamp((va.v + 1) * 0.5, 0, 1) : 0.5;
        const chordHash = this._readChordHash(taPlayer, positionMs);
        const timeSec = positionMs / 1000;
        const formantCenter = this._clamp(
            0.40 + (chordHash - 0.5) * 0.26 + Math.sin(timeSec * cfg.formantDrift) * 0.06,
            0.15, 0.82
        );
        const formantWidth = 0.055 + arousal * 0.075;
        const harmonicCenter = this._wrap01(formantCenter * (1.50 + valence * 0.34) + 0.10 + chordHash * 0.08);
        const beatEnergy = Math.min(1, beat * (0.75 + arousal * 0.35));
        const chorusEnergy = chorus * cfg.chorusBoost;
        const globalEnergy = this._clamp(
            cfg.restLevel
            + vocal * cfg.vocalWeight
            + beatEnergy * cfg.beatWeight
            + arousal * cfg.arousalWeight
            + chorusEnergy,
            0, 1
        );

        for (let b = 0; b < cfg.numBars; b++) {
            const normX = cfg.numBars === 1 ? 0.5 : b / (cfg.numBars - 1);
            const bassBias = Math.pow(1 - normX, 1.65);
            const trebleBias = Math.pow(normX, 1.15);
            const formantDistance = (normX - formantCenter) / formantWidth;
            const formant = Math.pow(Math.exp(-formantDistance * formantDistance), cfg.peakSharpness);
            const harmonicDistance = (normX - harmonicCenter) / (formantWidth * 0.72);
            const harmonic = Math.pow(Math.exp(-harmonicDistance * harmonicDistance), cfg.peakSharpness + 0.45) * (0.24 + arousal * 0.20);
            const bandShape = this._clamp(formant + harmonic, 0, 1);
            const shimmer = 0.5 + 0.5 * Math.sin(
                timeSec * (1.8 + normX * 2.4) + this.bandPhase[b] + chordHash * Math.PI * 2
            );
            const ripple = 0.5 + 0.5 * Math.sin(
                timeSec * (4.2 + arousal * 1.3) - normX * 9.5 + valence * Math.PI * 2
            );
            const bandMotion = 1 + cfg.shimmerAmount * (shimmer * 0.7 + ripple * 0.3 - 0.5);
            const shapedEnergy =
                globalEnergy * bandShape * bandMotion
                + beatEnergy * cfg.beatWeight * Math.pow(bassBias, 2.35)
                + vocal * bandShape * 0.24
                + arousal * Math.pow(trebleBias, 1.8) * bandShape * 0.08
                + Math.pow(shimmer, 3.0) * cfg.restLevel;
            const target = this._clamp(this._softGate(shapedEnergy * cfg.gain, cfg.noiseGate), 0, 1);
            const alpha  = target > this.levels[b] ? cfg.smoothingUp : cfg.smoothingDown;
            this.levels[b] += (target - this.levels[b]) * alpha;
        }
    }

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

        const peakAlpha = raw > this._vocalPeak ? 0.08 : 0.004;
        this._vocalPeak += (raw - this._vocalPeak) * peakAlpha;
        return this._clamp(raw / Math.max(this._vocalPeak, 0.001), 0, 1);
    }

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

            // Smoothstep pinch: edge bars are shorter, not dimmer — avoids the cropped look
            // when high-energy frequencies land on the sides.
            // edgeT must be clamped to [0,1] before the smoothstep — outside that range
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

        // Song title — large, shown during loading (may be empty until TextAlive resolves)
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

        // Loading label below spinner
        this.loadingLabel = this.add.text(cx, cy + 120, "Loading...", {
            fontFamily: gameSettings.fonts.ui,
            fontSize: "20px",
            color: "#777777",
        }).setOrigin(0.5);

        // Play button — invisible until loading finishes
        this.playButtonBg = this.add.rectangle(cx, cy + 50, gameSettings.button.width, gameSettings.button.height, gameSettings.colors.primary);
        this.playButtonBg.setAlpha(0);
        this.playButtonText = this.add.text(cx, cy + 50, "PLAY", {
            fontFamily: gameSettings.fonts.ui,
            fontSize: gameSettings.button.fontSize,
            color: gameSettings.colors.textLight,
            fontStyle: "bold"
        }).setOrigin(0.5).setAlpha(0);

        this.playButtonBg.on('pointerover', () => {
            if (!this.introStarted) this.playButtonBg.fillColor = gameSettings.colors.primaryHover;
        });
        this.playButtonBg.on('pointerout', () => {
            if (!this.introStarted) this.playButtonBg.fillColor = gameSettings.colors.primary;
        });
        this.playButtonBg.on('pointerdown', () => this.startIntro());

        // Low Power toggle (bottom-right, touch-friendly)
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

    _buildLowPowerToggle() {
        const padX = 14, padY = 14;
        const btnW = 152, btnH = 38;
        const descH = 28; // height reserved for the description line above the button
        const bx = this.scale.width - padX - btnW / 2;
        const by = this.scale.height - padY - btnH / 2;

        // Description label above the button
        this.add.text(bx, by - btnH / 2 - descH / 2 - 4, 'Disables all particle effects', {
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
        this.tweens.add({ targets: [this.spinner, this.loadingLabel], alpha: 0, duration: 500 });
        this.tweens.add({
            targets: [this.playButtonBg, this.playButtonText],
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

        this.backgroundChar = new BackgroundChar(this);
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

        if (!taPlayer || !taPlayer.isPlaying) return;
        const songTime = taPlayer.timer?.position ?? 0;
        const startX = w + gameSettings.lyrics.startXOffset;

        this.visualizer.update(taPlayer);

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
            if (!lowPowerMode) this.triggerBeatPinch();
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

            const effectiveStartTime = nextChar.startTime + this.lyricsDelay;

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
                    auraOnSpawn = true;
                }

                let textToRender = nextChar.text;

                let spawnX = startX;
                let spawnY = this.charSpawnYPointer.y;

                if (gameSettings.lyrics.trailingChars.includes(textToRender)) {
                    // Stay on the same row as the previous character regardless of activeChars state
                    spawnY = this.lastSpawnedY ?? spawnY;
                } else if (gameSettings.lyrics.leadingChars.includes(textToRender)) {
                    spawnX -= this.charSize * gameSettings.lyrics.leadingCharShift;
                }

                const charObj = this.add.text(
                    spawnX,
                    spawnY,
                    textToRender,
                    {
                        fontFamily: gameSettings.fonts.main,
                        fontSize: gameSettings.lyrics.fontSize,
                        color: this.getCharColor(nextChar)
                    }
                ).setOrigin(0.5);

                // For normal characters, shift vertically when they would overlap the previous one.
                if (
                    !gameSettings.lyrics.trailingChars.includes(textToRender) &&
                    !gameSettings.lyrics.leadingChars.includes(textToRender) &&
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
        // while the current note is still "playing" — long held notes naturally create pacing gaps.
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
                this.comboCounter.reset();
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
        this.backgroundChar.show(charObj.text, charDuration, taPlayer.timer?.position ?? 0);

        this.catcher.playKnockAnim();
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
    scene: [BootScene, TitleScene, GameScene],
    scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH }
};

const game = new Phaser.Game(config);

const taPlayer = new Player({ app: { token: gameSettings.api.token }, mediaElement: document.querySelector("#media"), valenceArousalEnabled: true, vocalAmplitudeEnabled: true });

taPlayer.addListener({
    onTimerReady() { isTextAliveReady = true; },
});
taPlayer.createFromSongUrl(gameSettings.api.songUrl);
