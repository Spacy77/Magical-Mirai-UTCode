const gameSettings = {
    // ── TextAlive API ────────────────────────────────────────────────────────
    api: {
        token: "1O5BTRwWsXT6TfAP",
        songUrl: "https://piapro.jp/t/B3yJ/20251215061727" // go to textAlive website to find the link, it is not directly on piapro
    },
    // Volume sent to the TextAlive player (0–100)
    songVolume: 10,

    // ── Global palette ───────────────────────────────────────────────────────
    colors: {
        background: "#111111",   // scene background fill
        primary: 0x8A2BE2,       // accent color used for UI elements (purple)
        primaryHover: 0x6A1B9A,  // darker shade for button hover state
        textMain: "#E0E0E0",     // default fallback color for characters without phrase context
        textLight: "#FFFFFF",    // pure-white text (titles, labels)
        textPrimary: "#8A2BE2",  // purple text used in the UI
        pointer: 0x00FFFF        // spawn-Y pointer dot color (cyan)
    },

    // ── Character color system ───────────────────────────────────────────────
    // Each phrase gets a base color from phraseColors; within a phrase each word
    // is multiplied by a factor from tintCycle to create brightness variety.

    // Brightness multipliers applied per-word within a phrase (cycled).
    // Values below 1 darken, above 1 brighten the phrase base color.
    tintCycle: [
        1.00,  // neutral
        0.80,  // slightly darker
        1.20,  // slightly brighter
        0.90,  // mild dark
        0.65,  // noticeably darker
    ],

    // Base colors assigned to successive phrases (cycled if there are more phrases than entries)
    phraseColors: [
        "#FFFFFF",  // white
        "#7DD3FC",  // sky blue
        "#A7F3D0",  // mint green
        "#FDE68A",  // warm yellow
        "#F9A8D4",  // pink
        "#C4B5FD",  // lavender
        "#FDBA74",  // peach
    ],

    // ── Fonts ────────────────────────────────────────────────────────────────
    fonts: {
        main: '"Noto Sans JP", sans-serif',  // lyric characters (supports Japanese glyphs)
        ui: 'sans-serif'                      // combo counter and other HUD text
    },

    // ── Loading screen spinner ───────────────────────────────────────────────
    spinner: {
        radius: 50,          // outer radius in px
        thickness: 8,        // ring stroke width in px
        rotationSpeed: 0.1   // radians per frame
    },

    // ── Menu buttons ─────────────────────────────────────────────────────────
    button: { width: 250, height: 80, fontSize: "40px" },

    // ── Catcher (the vertical bar the player controls) ───────────────────────
    catcher: {
        xPos: 300,          // fixed X position from the left edge
        width: 40,          // collision / visual width in px
        height: 300,        // collision / visual height in px
        maxSpeed: 1,        // maximum normalized speed (fraction of scene height per second)
        responsiveness: 5.0, // exponential-smoothing factor : higher = snappier tracking
        marginY: 80         // minimum distance the catcher keeps from the top/bottom edges
    },

    // ── Lyric characters ─────────────────────────────────────────────────────
    lyrics: {
        fallTimeMs: 1700,          // time (ms) for a character to travel from spawn to the catcher
        fallTimeMsMultiplier: 1,   // global speed multiplier applied on top of fallTimeMs (1 = default)
        startXOffset: 100,         // how many px past the right edge characters spawn off-screen
        marginY: 100,              // vertical safe zone : characters never spawn closer than this to the top/bottom
        fontSize: "120px",         // CSS font-size used for all lyric text objects

        // A character that has moved past the catcher by more than (destroyOverflowRatio × fallDistance)
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
        leadingCharShift: 0.35,  // fraction of fontSize to shift leading punctuation left so the next char follows it naturally

        // Japanese closing punctuation : always attached directly to the right edge of the previous character
        trailingChars: [
            "、", "。", "！", "？", "」", "』", "）", "］", "】", "〉", "》"
        ],

        // Japanese opening punctuation : shifted left so the body text starts after them
        leadingChars: [
            "「", "『", "（", "［", "【", "〈", "《"
        ],
    },

    // ── Background large-character flash effect ───────────────────────────────
    // When a character is caught, a giant version of it briefly appears behind the scene.
    backgroundLyrics: {
        fontSize: "500px",          // size of the background character
        maxDurationBGEffect: 200,   // max time (ms) the effect stays fully visible
        maxDurationBGAnim: 100,     // max time (ms) of the scale-in animation
        sizeChangeCoeff: 5,         // how aggressively the size pulses during the animation
        colors: ["#D00000", "#FFB703", "#2A9D8F", "#3A86FF", "#8338EC"],  // palette cycled per catch
        startAlpha: 0.5             // initial opacity of the background character
    },

    // ── Catch particle emitter (legacy / unused config : kept for reference) ─
    // Actual catch particles use the `particles` block below; tint is set per-character at runtime.
    catchParticles: {
        speed: { min: 200, max: 400 },
        lifespan: { min: 300, max: 600 },
        quantity: 10,
        scale: { start: 0.2, end: 2 },
        alpha: { min: 0.1, max: 0.6 }
    },

    // ── Combo counter HUD ────────────────────────────────────────────────────
    combo: {
        xPos: 30,              // X position of the combo text (from the left)
        yOffset: 20,           // distance from the bottom edge
        fontSize: "100px",
        color: "#ffffff",
        ghostAlpha: 0.2,       // opacity of the ghost (echo) copy of the counter
        mainScaleBounce: 1.1,  // scale the main counter briefly grows to on increment
        ghostScaleBounce: 1.4, // scale the ghost briefly grows to on increment (more exaggerated)
        animDuration: 500      // duration (ms) of the bounce-back tween
    },

    // ── Spawn-Y pointer ──────────────────────────────────────────────────────
    // A moving point that drifts up and down; each new character spawns at its current Y.
    charSpawnYPointer: {
        speed: 1  // fraction of scene height traveled per second at full velocity
    },

    // ── Wave / flip pattern ──────────────────────────────────────────────────
    // The spawn pointer periodically reverses direction to create a wave motion.
    // `patterns` is a list of beat-durations (in beats) the pointer travels in one direction
    // before flipping; the list is cycled indefinitely.
    wave: {
        beatDuration: 500,       // ms per beat (used to convert beat counts to wall-clock time)
        nextFlipTime: 0,         // runtime state : time of the next scheduled flip (ms)
        currentTravelBeats: 0,   // runtime state : how many beats the current segment lasts
        patterns: [0.75, 1, 1, 0.5, 0.5, 1, 2, 2]  // beat durations per direction segment
    },

    // ── FL Studio-style timeline background ──────────────────────────────────
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

    // ── Heart mode ───────────────────────────────────────────────────────────
    // Spawns floating hearts as a visual flourish (triggered externally).
    heartMode: {
        heartAmount: 6,  // number of hearts spawned per trigger
        minSize: 30,     // minimum heart diameter (px)
        maxSize: 60,     // maximum heart diameter (px)
    },

    // Master switch : set to false to disable all particle effects globally
    globalParticleToggle: true,

    // ── Catch particle emitter (active config) ────────────────────────────────
    // Tint is not set here; it is overridden per-character in spawnCatchParticles()
    // so each burst matches the caught character's color.
    // Angle 0° = right; the burst fires rightward (away from the catcher wall) like debris.
    particles: {
        count: 22,

        speedMin: 200,
        speedMax: 550,

        lifespan: 650,

        scaleStart: 2.5,
        scaleEnd: 0,

        angleMin: -65,   // cone pointing right: 0° ± 65°
        angleMax: 65,

        gravityY: 600,   // debris arcs downward after impact
    },

    // ── Aura circle ──────────────────────────────────────────────────────────
    // A soft glowing circle drawn behind characters spawned at wave direction changes.
    backgroundCircle: {
        radiusMultiplier: 0.50, // circle radius = max(charWidth, charHeight) × this
        alpha: 0.18,            // opacity of the circle (kept low so it doesn't overpower the character)
        fadeDuration: 300,      // ms over which the circle fades out when the character despawns
    },

    // ── Disintegration (caught-character dissolve) ────────────────────────────
    // When a character is caught it freezes at the catcher while its strip drains, then
    // its right edge stays anchored at the catcher while scaleX shrinks to 0. Combined
    // with an alpha fade this makes the left side vanish first — a squishy wall-absorption.
    disintegration: {
        dissolveDuration: 700,  // ms for the squish-fade after the strip depletes
        dustCount: 2,           // particles emitted per frame during dissolution
        dustSpeedMin: 600,
        dustSpeedMax: 800,
        dustLifespan: 250,
        dustScaleStart: 3,
        dustScaleEnd: 0,
    },
};

const { Player, PlayerOptions } = TextAliveApp;
let isTextAliveReady = false;

class ComboCounter {
    constructor(scene) {
        this.scene = scene;
        this.combo = 0;

        const x = gameSettings.combo.xPos;
        const y = scene.scale.height - gameSettings.combo.yOffset;

        this.ghostText = scene.add.text(x, y, "0", {
            fontFamily: gameSettings.fonts.ui,
            fontSize: gameSettings.combo.fontSize,
            color: gameSettings.combo.color,
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 4
        }).setOrigin(0, 1).setAlpha(gameSettings.combo.ghostAlpha).setDepth(100);

        this.mainText = scene.add.text(x, y, "0", {
            fontFamily: gameSettings.fonts.ui,
            fontSize: gameSettings.combo.fontSize,
            color: gameSettings.combo.color,
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 6
        }).setOrigin(0, 1).setDepth(101);
    }

    increment() {
        this.combo++;
        this.updateText();
        this.playAnimation();
    }

    reset() {
        if (this.combo > 0) {
            this.combo = 0;
            this.updateText();
            this.scene.tweens.killTweensOf([this.mainText, this.ghostText]);
            this.mainText.setScale(1);
            this.ghostText.setScale(1);
        }
    }

    updateText() {
        const text = this.combo.toString();
        this.mainText.setText(text);
        this.ghostText.setText(text);
    }

    playAnimation() {
        this.scene.tweens.killTweensOf([this.mainText, this.ghostText]);

        this.scene.tweens.add({
            targets: this.mainText,
            scale: gameSettings.combo.mainScaleBounce,
            duration: 40,
            ease: 'Quad.easeOut'
        });

        this.scene.tweens.add({
            targets: this.ghostText,
            scale: gameSettings.combo.ghostScaleBounce,
            duration: 40,
            ease: 'Quad.easeOut'
        });

        this.scene.tweens.add({
            targets: [this.mainText, this.ghostText],
            scale: 1,
            duration: gameSettings.combo.animDuration,
            delay: 40,
            ease: 'Back.easeOut'
        });
    }

    resize(sceneHeight) {
        const y = sceneHeight - gameSettings.combo.yOffset;
        this.mainText.y = y;
        this.ghostText.y = y;
    }
}

class WaveState {
    constructor() {
        this.beatDuration = gameSettings.wave.beatDuration;
        this.nextFlipTime = gameSettings.wave.nextFlipTime;
        this.currentTravelBeats = gameSettings.wave.currentTravelBeats;
        this.patterns = gameSettings.wave.patterns;
    }

    advance(songTime) {
        if (songTime < this.nextFlipTime) {
            return false;
        }

        const nextTravelBeats = Phaser.Utils.Array.GetRandom(this.patterns);
        this.currentTravelBeats = nextTravelBeats;
        this.nextFlipTime = songTime + nextTravelBeats * this.beatDuration;
        return true;
    }
}

class Catcher {
    constructor(scene, y) {
        this.scene = scene;
        this.direction = 1;
        this.velocity = 0;
        this.sprite = scene.add.rectangle(
            gameSettings.catcher.xPos - gameSettings.catcher.width,
            y,
            gameSettings.catcher.width,
            gameSettings.catcher.height,
            gameSettings.colors.primary
        );

        scene.physics.add.existing(this.sprite);
        this.sprite.body.setImmovable(true);
    }

    toggleDirection() {
        this.direction *= -1;
    }

    update(delta, sceneHeight) {
        const targetSpeed = this.direction * sceneHeight * gameSettings.catcher.maxSpeed;
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
}

class CharSpawnYPointer {
    constructor(initialY) {
        this.y = initialY;
        this.direction = Math.random() < 0.5 ? 1 : -1;
        this.velocity = 0;
        this.responsiveness = 5.0;
    }

    flipDirection() {
        this.direction *= -1;
    }

    update(delta, sceneHeight) {
        const targetSpeed = this.direction * sceneHeight * gameSettings.charSpawnYPointer.speed;
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
    constructor(scene, char, obj, startX, yPos, stripLength, stripHeight, auraOnSpawn) {
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
    }

    // STRIP
    createStrip(stripLength, stripHeight) {
        if (stripLength < gameSettings.lyrics.minDelayLongChar) {
            return null;
        }

        // Use the character's own color so the strip visually belongs to it

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

    // AURA CIRCLE
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

    updateBackgroundCircle(delta) {
        if (!this.backgroundCircle) {
            return;
        }

        this.backgroundCircle.x = this.obj.x;
        this.backgroundCircle.y = this.obj.y;
    }

    // UPDATE
    update(time, startX, catcherX, fallTime, delta, destroyThreshold, fallDistance, charSize, dyingStrips) {
        const progress =
            (time - (this.char.startTime - fallTime)) / fallTime;

        this.obj.x =
            startX - (startX - catcherX) * progress;

        this.obj.y = this.yPos;

        this.updateBackgroundCircle(delta);
        this.updateStripPosition(startX, catcherX, progress, charSize);

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

        const emitter = this.scene.catchEmitter;
        if (!emitter) return;

        emitter.setParticleTint(this.color);
        emitter.explode(gameSettings.particles.count, this.obj.x, this.obj.y);
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

    // CLEANUP
    destroyVisuals() {
        if (this.backgroundCircle) {
            const circle = this.backgroundCircle;
            // Null immediately so updateBackgroundCircle stops tracking it during the fade
            this.backgroundCircle = null;
            this.scene.tweens.add({
                targets: circle,
                alpha: 0,
                duration: gameSettings.backgroundCircle.fadeDuration,
                onComplete: () => circle.destroy()
            });
        }
    }

    // DISINTEGRATION — called once when the player catches this character
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

        // ── Phase 1: hold the character at the catcher while the strip drains ──
        if (!this.dissolveStarted) {
            this.obj.x = catcherX + this.obj.width / 2;
            this.dissolveWait += delta;
            if (this.dissolveWait >= this.dissolveDelay) {
                this.dissolveStarted = true;
            }
            return false;
        }

        // ── Phase 2: squish the character into the wall, left edge first ──
        // The right edge stays anchored at (catcherX + charWidth) while scaleX shrinks
        // to zero. This makes the left boundary recede rightward — the left side disappears
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

        if (gameSettings.globalParticleToggle) {
            const halfH = this.obj.height / 2;
            const emitter = this.scene.dustEmitter;
            emitter.setParticleTint(this.color);
            for (let i = 0; i < d.dustCount; i++) {
                const randomY = this.obj.y + (Math.random() * 2 - 1) * halfH;
                emitter.explode(1, catcherX, randomY);
            }
        }

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
                fontFamily: "Arial",
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
                fontFamily: gameSettings.fonts.main,
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
                color: "#ff4040"
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
                    color: "#ff6b8a"
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

    destroy() {
        this.text.destroy();
    }
}

class LoadScene extends Phaser.Scene {
    constructor() { super("LoadScene"); }
    create() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;
        this.spinner = this.add.graphics({ x: cx, y: cy });
        this.spinner.lineStyle(gameSettings.spinner.thickness, gameSettings.colors.primary, 1);
        this.spinner.beginPath();
        this.spinner.arc(0, 0, gameSettings.spinner.radius, 0, Math.PI * 1.5, false);
        this.spinner.strokePath();
    }
    update() {
        this.spinner.rotation += gameSettings.spinner.rotationSpeed;
        if (isTextAliveReady) this.scene.start("TitleScene");
    }
}

class TitleScene extends Phaser.Scene {
    constructor() { super("TitleScene"); }
    create() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;
        const playButtonBg = this.add.rectangle(cx, cy, gameSettings.button.width, gameSettings.button.height, gameSettings.colors.primary);
        playButtonBg.setInteractive({ useHandCursor: true });
        this.add.text(cx, cy, "PLAY", {
            fontFamily: gameSettings.fonts.ui,
            fontSize: gameSettings.button.fontSize,
            color: gameSettings.colors.textLight,
            fontStyle: "bold"
        }).setOrigin(0.5);
        playButtonBg.on('pointerover', () => { playButtonBg.fillColor = gameSettings.colors.primaryHover; });
        playButtonBg.on('pointerout', () => { playButtonBg.fillColor = gameSettings.colors.primary; });
        playButtonBg.on('pointerdown', () => { taPlayer.requestPlay(); this.scene.start("GameScene"); });
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

        this.cursors = this.input.keyboard.on('keydown-SPACE', () => {
            this.catcher.toggleDirection();
        }, this);
        this.activeChars = [];
        this.pendingChars = [];
        this.disintegratingChars = []; // characters currently dissolving through the catcher mask
        this.dyingStrips = [];
        this.fallDistance = (this.scale.width + gameSettings.lyrics.startXOffset) - this.catcher.x;
        this.charSize = parseInt(gameSettings.lyrics.fontSize);

        this.backgroundChar = new BackgroundChar(this);

        this.charSpawnYPointer = new CharSpawnYPointer(
            this.scale.height / 2
        );

        this.spawnPointerGraphics = this.add.graphics();
        this.spawnPointerGraphics.fillStyle(gameSettings.colors.pointer, 1);
        this.spawnPointerGraphics.fillCircle(0, 0, 10);
        this.spawnPointerGraphics.setDepth(1);
        this.spawnPointerGraphics.x = this.scale.width - 50;
        this.spawnPointerGraphics.y = this.charSpawnYPointer.y;

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

        this.scale.on('resize', (gameSize) => {
            this.comboCounter.resize(gameSize.height);
        });

        this.FLBackground = new FLTimelineBackground(this, this.scale.width, this.scale.height);
        this.FLBackground.setDepth(-10000);

        this.createCatchParticleEmitter();
        this.createDustEmitter();
    }

    // Creates the dust particle emitter used by disintegrating characters.
    // Tint is set per-character at emit time (same pattern as catchEmitter).
    createDustEmitter() {
        // Reuses the "__particle" texture created by createCatchParticleEmitter()
        const d = gameSettings.disintegration;

        this.dustEmitter = this.add.particles(0, 0, "__particle", {
            emitting: false,
            lifespan: d.dustLifespan,
            speed: { min: d.dustSpeedMin, max: d.dustSpeedMax },
            angle: { min: -30, max: 30 },
            scale: { start: d.dustScaleStart, end: d.dustScaleEnd, ease: "quad.out" },
            alpha: { start: 0.8, end: 0, ease: "linear" },
        });
    }

    createCatchParticleEmitter() {
        if (!this.textures.exists("__particle")) {
            const g = this.add.graphics();
            g.fillStyle(0xffffff, 1);
            g.fillCircle(4, 4, 4);
            g.generateTexture("__particle", 8, 8);
            g.destroy();
        }

        const pc = gameSettings.particles;

        this.catchEmitter = this.add.particles(0, 0, "__particle", {
            emitting: false,
            lifespan: pc.lifespan,
            quantity: pc.count,
            speed: { min: pc.speedMin, max: pc.speedMax },
            angle: { min: pc.angleMin, max: pc.angleMax },
            scale: { start: pc.scaleStart, end: pc.scaleEnd, ease: "quad.out" },
            alpha: { start: 1, end: 0, ease: "linear" },
            gravityY: pc.gravityY,
        });
    }

    update(time, delta) {
        this.fpsText.setText("FPS: " + Math.round(this.game.loop.actualFps));

        // Cap delta to 100 ms (≈ 10 fps minimum) so a tab-unfocus spike can't throw the
        // spawn pointer or catcher to an extreme position on the first resumed frame.
        const deltaMs = Math.min(delta, 100);
        const deltaSec = deltaMs / 1000;
        const w = this.scale.width;
        const h = this.scale.height;

        if (!taPlayer || !taPlayer.isPlaying) return;
        const songTime = taPlayer.timer?.position ?? 0;
        const startX = w + gameSettings.lyrics.startXOffset;

        this.FLBackground.update(songTime, startX, this.catcher.x, this.fallTime);
        this.catcher.update(deltaSec, h);
        this.spawnPointerGraphics.y = this.charSpawnYPointer.y;
        this.charSpawnYPointer.update(deltaSec, h);
        this.spawnPendingChars(songTime, startX, w, h);
        this.updateActiveChars(songTime, startX, deltaSec);
        this.updateDisintegratingChars(deltaMs);
        this.destroyStrips(deltaMs);
        this.backgroundChar.update(songTime, deltaMs);
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

        return this.tintColor(phraseColor, tint);
    }

    spawnPendingChars(time, startX, sceneWidth, sceneHeight) {
        while (this.pendingChars.length > 0) {
            const nextChar = this.pendingChars[0];
            const yPos = this.charSpawnYPointer.y;
            let auraOnSpawn = false;

            if (time >= nextChar.startTime - this.fallTime) {

                // If songTime jumped ahead (tab unfocus, TextAlive timer drift, etc.) a character
                // might be so late that it would already be at or past the catcher the moment it
                // spawns. Spawning it would trigger the overlap-offset chain for every queued
                // character and scatter them across the screen. Drop it silently instead.
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

                // Prevent punctuation from spawning directly on top of the next character.
                let spawnX = startX;
                let spawnY = this.charSpawnYPointer.y;

                // Closing punctuation: attach to previous character.
                if (
                    gameSettings.lyrics.trailingChars.includes(textToRender) &&
                    this.activeChars.length > 0
                ) {
                    const previousObj =
                        this.activeChars[this.activeChars.length - 1].obj;

                    spawnX = previousObj.x + previousObj.width;
                    spawnY = previousObj.y;
                }

                // Opening punctuation: shift slightly left so that the
                // next character visually follows it.
                else if (gameSettings.lyrics.leadingChars.includes(textToRender)) {
                    spawnX -= gameSettings.lyrics.fontSize * gameSettings.lyrics.leadingCharShift;
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
                // X position is tied to song timing, so we offset Y instead of X.
                if (
                    this.activeChars.length > 0 &&
                    !gameSettings.lyrics.trailingChars.includes(textToRender) &&
                    !gameSettings.lyrics.leadingChars.includes(textToRender)
                ) {
                    const prev = this.activeChars[this.activeChars.length - 1];
                    const prevProgress = (time - (prev.char.startTime - this.fallTime)) / this.fallTime;
                    const prevX = prev.startX - (prev.startX - this.catcher.x) * prevProgress;
                    const gap = (startX - charObj.width * 0.5) - (prevX + prev.obj.width * 0.5);
                    if (gap < gameSettings.lyrics.minCharSpacing) {
                        spawnY += this.charSpawnYPointer.direction * gameSettings.lyrics.overlapYShift;
                        spawnY = Phaser.Math.Clamp(
                            spawnY,
                            gameSettings.lyrics.marginY,
                            sceneHeight - gameSettings.lyrics.marginY
                        );
                        charObj.y = spawnY;
                    }
                }

                const stripLength =
                    nextChar.endTime - nextChar.startTime - this.charSize;

                this.charGroup.add(charObj);

                this.activeChars.push(
                    new ActiveChar(
                        this,
                        nextChar,
                        charObj,
                        spawnX,
                        spawnY,
                        stripLength,
                        this.charSize / 5,
                        auraOnSpawn
                    )
                );

                this.pendingChars.shift();
            } else {
                break;
            }
        }
    }

    hexToRgb(hex) {
        hex = hex.replace("#", "");

        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16),
        };
    }

    rgbToHex(r, g, b) {
        return "#" +
            [r, g, b]
                .map(v => Math.max(0, Math.min(255, Math.round(v))))
                .map(v => v.toString(16).padStart(2, "0"))
                .join("");
    }

    tintColor(hex, factor) {
        // Multiplies each RGB channel by factor: <1 darkens, >1 brightens
        const rgb = this.hexToRgb(hex);

        return this.rgbToHex(
            rgb.r * factor,
            rgb.g * factor,
            rgb.b * factor
        );
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
    }

    updateActiveChars(time, startX, delta) {
        for (let i = this.activeChars.length - 1; i >= 0; i--) {
            const item = this.activeChars[i];
            const shouldRemove = item.update(time, startX, this.catcher.x, this.fallTime, delta, this.destroyThreshold, this.fallDistance, this.charSize, this.dyingStrips);
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

const config = {
    type: Phaser.AUTO,
    parent: "game-container",
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: true,
    physics: { default: "arcade" },
    scene: [LoadScene, TitleScene, GameScene],
    scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH }
};

const game = new Phaser.Game(config);
const taPlayer = new Player({ app: { token: gameSettings.api.token }, mediaElement: document.querySelector("#media"), valenceArousalEnabled: true, vocalAmplitudeEnabled: true });

taPlayer.addListener({ onTimerReady() { isTextAliveReady = true; } });
taPlayer.createFromSongUrl(gameSettings.api.songUrl);