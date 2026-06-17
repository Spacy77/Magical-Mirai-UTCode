const gameSettings = {
    api: {
        token: "1O5BTRwWsXT6TfAP",
        songUrl: "https://piapro.jp/t/B3yJ/20251215061727"
    },
    songVolume: 0,
    colors: {
        background: "#111111",
        primary: 0x8A2BE2,
        primaryHover: 0x6A1B9A,
        textMain: "#E0E0E0",
        textLight: "#FFFFFF",
        textPrimary: "#8A2BE2",
        glow: 0x00FFFF,
        strip: 0xCCCCCC,
        pointer: 0x00FFFF
    },

    tintCycle: [
        1.00,
        0.90,
        1.10,
        0.95,
        1.05,
    ],

    phraseColors: [
        "#FFFFFF",
        "#7DD3FC",
        "#A7F3D0",
        "#FDE68A",
        "#F9A8D4",
        "#C4B5FD",
        "#FDBA74",
        //0xFFFFFF,
        //0x7DD3FC,
        //0xA7F3D0,
        //0xFDE68A,
        //0xF9A8D4,
        //0xC4B5FD,
        //0xFDBA74,
    ],
    fonts: {
        main: '"Noto Sans JP", sans-serif',
        ui: 'sans-serif'
    },
    spinner: { radius: 50, thickness: 8, rotationSpeed: 0.1 },
    button: { width: 250, height: 80, fontSize: "40px" },
    catcher: { xPos: 120, width: 40, height: 300, maxSpeed: 1, responsiveness: 5.0, marginY: 80 },
    lyrics: {
        fallTimeMs: 1500,
        fallTimeMsMultiplier: 1,
        startXOffset: 100,
        marginY: 100,
        fontSize: "120px",
        destroyOverflowRatio: 0.2,
        minDelayNewYPos: 500,
        minDelayLongChar: 500,
        trailingChars: [
            "、", "。", "！", "？", "」", "』", "）", "］", "】", "〉", "》"
        ],

        leadingChars: [
            "「", "『", "（", "［", "【", "〈", "《"
        ],
    },
    backgroundLyrics: {
        fontSize: "500px",
        maxDurationBGEffect: 200,
        maxDurationBGAnim: 100,
        sizeChangeCoeff: 5,
        colors: ["#D00000", "#FFB703", "#2A9D8F", "#3A86FF", "#8338EC"],
        startAlpha: 0.5
    },
    catchParticles: {
        speed: { min: 200, max: 400 },
        lifespan: { min: 300, max: 600 },
        quantity: 10,
        scale: { start: 0.2, end: 2 },
        colors: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff],
        alpha: { min: 0.1, max: 0.6 }
    },
    combo: {
        xPos: 30,
        yOffset: 20,
        fontSize: "100px",
        color: "#ffffff",
        ghostAlpha: 0.2,
        mainScaleBounce: 1.1,
        ghostScaleBounce: 1.4,
        animDuration: 500
    },
    charSpawnYPointer: { speed: 1 },

    minDelayLongChar: 400,

    spawnGlowDuration: 50,

    glow: { outerStrength: 10, innerStrength: 5, knockout: false },

    wave: {
        beatDuration: 500,
        nextFlipTime: 0,
        currentTravelBeats: 0,
        patterns: [0.75, 1, 1, 0.5, 0.5, 1, 2, 2]
    },

    FLBackground: {
        bgColor: 0x434b55, // "#434b55"
        topBarColor: 0x2f353c, // "#2f353c"
        majorLineColor: 0x252a30,
        minorLineColor: 0x39414a,
        textColor: "#d4d8dc",
        topBarHeight: 36,
        majorSpacing: 160,
        subdivisions: 4,
    },

    heartMode: {
        heartAmount: 6,
        minSize: 30,
        maxSize: 60,
    }
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
            gameSettings.catcher.xPos,
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
    constructor(scene, char, obj, startX, yPos, stripLength, stripHeight, glowOnSpawn, glowDuration) {
        this.scene = scene;
        this.char = char;
        this.obj = obj;
        this.startX = startX;
        this.yPos = yPos;
        this.strip = this.createStrip(stripLength, stripHeight);
        this.glowDuration = glowDuration;
        this.glowRemaining = glowOnSpawn ? glowDuration : 0;
        this.glowEffect = glowOnSpawn ? this.createGlowEffect() : null;
    }

    createStrip(stripLength, stripHeight) {
        if (stripLength < gameSettings.minDelayLongChar) {
            return null;
        }

        const strip = this.scene.add.rectangle(
            this.startX + this.obj.width / 2,
            this.yPos,
            stripLength,
            stripHeight,
            gameSettings.colors.strip,
            1
        );

        strip.setOrigin(0, 0.5);
        strip.setDepth(-1);
        return strip;
    }

    createGlowEffect() {
        this.glowEffect = this.obj.preFX.addGlow(gameSettings.colors.glow, gameSettings.glow.outerStrength, gameSettings.glow.innerStrength, gameSettings.glow.knockout);
        return this.glowEffect;
    }

    update(time, startX, catcherX, fallTime, delta, destroyThreshold, fallDistance, charSize, dyingStrips) {
        const progress = (time - (this.char.startTime - fallTime)) / fallTime;

        this.obj.x = startX - (startX - catcherX) * progress;
        this.updateGlow(delta);
        this.updateStripPosition(startX, catcherX, progress, charSize);

        if (progress > 1 + destroyThreshold) {
            this.retire(dyingStrips, fallDistance, fallTime);
            return true;
        }

        return false;
    }

    updateGlow(delta) {
        if (this.glowEffect == null) {
            return;
        }

        if (this.glowRemaining > 0) {
            this.glowRemaining = Math.max(0, this.glowRemaining - delta);
            const glowStrength = this.glowRemaining / this.glowDuration;
            this.glowEffect.outerStrength = gameSettings.glow.outerStrength * glowStrength;
            this.glowEffect.innerStrength = gameSettings.glow.innerStrength * glowStrength;
            return;
        }

        this.destroyGlow();
    }

    updateStripPosition(startX, catcherX, progress, charSize) {
        if (this.strip != null) {
            this.strip.x = startX - (startX - catcherX) * progress + charSize / 2;
        }
    }

    retire(dyingStrips, fallDistance, fallTime) {
        this.destroyGlow();

        if (this.strip == null) {
            this.obj.destroy();
            return;
        }

        const stripDuration = (this.strip.width / fallDistance) * fallTime;
        dyingStrips.push({ strip: this.strip, maxWidth: this.strip.width, progress: 0, obj: this.obj, stripDuration: stripDuration });
    }

    destroyGlow() {
        if (this.glowEffect != null) {
            this.glowEffect.setActive(false);
            this.glowEffect = null;
        }
    }
}

class FLTimelineBackground extends Phaser.GameObjects.Container {

    constructor(scene, width, height) {
        super(scene, 0, 0);

        this.width = width;
        this.height = height;

        this.scrollX = 0;

        this.graphics = scene.add.graphics();
        this.labels = [];

        this.add(this.graphics);

        scene.add.existing(this);

        this.redraw();
    }

    update(songTime, startX, catcherX, fallTime) {
        // copied from the ActiveChar logic

        const pixelsPerMs = (startX - catcherX) / (fallTime);

        this.scrollX = songTime * pixelsPerMs;
        this.redraw();
    }

    redraw() {
        const g = this.graphics;

        g.clear();

        // Main background
        g.fillStyle(gameSettings.FLBackground.bgColor);
        g.fillRect(0, 0, this.width, this.height);

        // Remove old labels
        for (const label of this.labels) {
            label.destroy();
        }
        this.labels.length = 0;

        const minorSpacing = gameSettings.FLBackground.majorSpacing / gameSettings.FLBackground.subdivisions;

        // Align grid so it loops infinitely
        const offset = this.scrollX % gameSettings.FLBackground.majorSpacing;

        // Minor grid lines
        g.lineStyle(1, gameSettings.FLBackground.minorLineColor, 1);



        for (
            let x = -offset;
            x < this.width + gameSettings.FLBackground.majorSpacing;
            x += minorSpacing
        ) {
            g.beginPath();
            g.moveTo(x, this.topBarHeight);
            g.lineTo(x, this.height);
            g.strokePath();
        }

        // Major grid lines + labels
        g.lineStyle(2, gameSettings.FLBackground.majorLineColor, 1);

        const firstMeasure =
            Math.floor(this.scrollX / gameSettings.FLBackground.majorSpacing);

        let measure = firstMeasure + 1;


        for (
            let x = -offset;
            x < this.width + gameSettings.FLBackground.majorSpacing;
            x += gameSettings.FLBackground.majorSpacing
        ) {
            g.beginPath();
            g.moveTo(x, 0);
            g.lineTo(x, this.height);
            g.strokePath();

            const label = this.scene.add.text(
                x + 8,
                8,
                String(measure),
                {
                    fontFamily: "Arial",
                    fontSize: "16px",
                    color: gameSettings.FLBackground.textColor
                }
            );

            this.labels.push(label);
            this.add(label);

            measure++;
        }

        // Top ruler bar
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
        for (const label of this.labels) {
            label.destroy();
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
        this.text.setAlpha(
            gameSettings.backgroundLyrics.startAlpha
        );

        this.colorIndex =
            (this.colorIndex + 1) % gameSettings.backgroundLyrics.colors.length;

        const color = gameSettings.backgroundLyrics.colors[Math.floor(Math.random() * gameSettings.backgroundLyrics.colors.length)];

        this.text.setColor(color);

        this.text.setFontSize(
            gameSettings.backgroundLyrics.fontSize
        );
    }

    updateHeartMode(currentTime) {
        const t = currentTime / 1000;

        const beat =
            1 +
            Math.sin(t * 12) * 0.12 +
            Math.max(0, Math.sin(t * 6)) * 0.2;

        this.bigHeart.setScale(beat);

        for (const heart of this.hearts) {

            heart.y -= heart.floatSpeed * 0.016;

            if (heart.y < -100) {
                heart.y =
                    this.scene.scale.height + 100;
            }

            const scale =
                heart.baseScale +
                Math.sin(
                    t * 2 +
                    heart.phase
                ) * 0.1;

            heart.setScale(scale);
        }

        // start fading down
        if (currentTime >= this.endTime) {
            const alpha =
                Math.max(
                    0,
                    this.bigHeart.alpha - 0.01
                );

            this.bigHeart.setAlpha(alpha);

            for (const heart of this.hearts) {
                heart.setAlpha(alpha * 0.5);
            }

            if (alpha <= 0) {
                this.exitHeartMode();
            }
        }
    }

    update(currentTime) {

        const animTime =
            gameSettings.backgroundLyrics.maxDurationBGAnim;

        if (this.heartMode) {
            this.updateHeartMode(currentTime)
            return;
        }


        if (currentTime >= this.endTime) {

            if (this.text.alpha > 0) {
                this.text.setAlpha(
                    this.text.alpha -
                    1 / gameSettings.backgroundLyrics.maxDurationBGEffect
                );
            }
            else {
                this.text.setText("");
            }

            return;
        }

        if (currentTime <= this.startTime + animTime) {

            const currentSize =
                parseInt(this.text.style.fontSize);

            this.text.setFontSize(
                currentSize +
                gameSettings.backgroundLyrics.sizeChangeCoeff
            );
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
        this.minDelayLongChar = gameSettings.minDelayLongChar;
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

        this.activeBGChar = this.add.text(this.scale.width / 2, this.scale.height / 2, "", {
            fontFamily: gameSettings.fonts.main,
            fontSize: gameSettings.backgroundLyrics.fontSize,
            color: gameSettings.backgroundLyrics.colors[this.bgCharColorIndex]
        }).setOrigin(0.5).setAlpha(0).setDepth(-1);

        const particleGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        particleGraphics.fillStyle(0xffffff, 1);
        particleGraphics.fillRect(0, 0, 8, 8);
        particleGraphics.generateTexture("particle", 8, 8);
        particleGraphics.destroy();

        this.catchParticles = this.add.particles(0, 0, "particle", {
            speed: gameSettings.catchParticles.speed,
            angle: { min: -30, max: 30 },
            scale: gameSettings.catchParticles.scale,
            lifespan: gameSettings.catchParticles.lifespan,
            quantity: gameSettings.catchParticles.quantity,
            emitting: false,
            tint: gameSettings.catchParticles.colors,
            alpha: gameSettings.catchParticles.alpha
        });

        this.scale.on('resize', (gameSize) => {
            this.comboCounter.resize(gameSize.height);
        });

        this.FLBackground = new FLTimelineBackground(this, this.scale.width, this.scale.height);
        this.FLBackground.setDepth(-10000);
    }

    update(time, delta) {
        this.fpsText.setText("FPS: " + Math.round(this.game.loop.actualFps));

        delta = delta / 1000;
        const w = this.scale.width;
        const h = this.scale.height;

        if (!taPlayer || !taPlayer.isPlaying) return;
        const songTime = taPlayer.timer.position;
        const startX = w + gameSettings.lyrics.startXOffset;

        this.FLBackground.update(songTime, startX, this.catcher.x, this.fallTime);
        this.catcher.update(delta, h);
        this.spawnPointerGraphics.y = this.charSpawnYPointer.y;
        this.charSpawnYPointer.update(delta, h);
        this.spawnPendingChars(songTime, startX, w, h);
        this.updateActiveChars(songTime, startX, delta);
        this.destroyStrips(delta);
        this.backgroundChar.update(taPlayer.timer.position);
    }

    getCharColor(char) {
        // gives color variation depending on parent phrase and parent word to destinguish them from each others
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
        let lastSpawnedObj = null;

        while (this.pendingChars.length > 0) {
            const nextChar = this.pendingChars[0];
            const yPos = this.charSpawnYPointer.y;
            let glowOnSpawn = false;

            if (time >= nextChar.startTime - this.fallTime) {

                if (this.waveState.advance(time)) {
                    this.charSpawnYPointer.flipDirection();
                    glowOnSpawn = true;
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
                    spawnX -= gameSettings.lyrics.fontSize * 0.35;
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
                        glowOnSpawn,
                        gameSettings.spawnGlowDuration
                    )
                );

                lastSpawnedObj = charObj;
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
        const rgb = this.hexToRgb(hex);

        return this.rgbToHex(
            rgb.r * factor,
            rgb.g * factor,
            rgb.b * factor
        );
    }

    destroyStrips(delta) {
        delta = delta * 1000;
        for (let i = this.dyingStrips.length - 1; i >= 0; i--) {
            const item = this.dyingStrips[i];

            item.progress += delta / item.stripDuration;

            const remainingWidth = item.maxWidth * (1 - item.progress);
            item.strip.setSize(Math.max(0, remainingWidth), item.strip.height);

            if (item.progress >= 1) {
                item.strip.destroy();
                item.obj.destroy();
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
        this.catchParticles.emitParticleAt(this.catcher.x, this.catcher.y, 20);

        const idx = this.activeChars.findIndex(l => l.obj === charObj);
        if (idx > -1) {
            const char = this.activeChars[idx];
            this.activeChars.splice(idx, 1);
            char.retire(this.dyingStrips, this.fallDistance, this.fallTime);

            this.comboCounter.increment();

            const charDuration =
                char.char.endTime -
                char.char.startTime;

            this.backgroundChar.show(
                charObj.text,
                charDuration,
                taPlayer.timer.position
            );
        }
    }

    updateBGChar() {
        if (!this.activeBGChar) {
            return;
        }

        const animTime = gameSettings.backgroundLyrics.maxDurationBGAnim;
        const position = taPlayer.timer.position;

        if (position >= this.bgCharEndTime) {
            if (this.activeBGChar.alpha > 0) {
                this.activeBGChar.setAlpha(this.activeBGChar.alpha - 1 / this.maxDurationBGEffect);
            }
            else {
                this.activeBGChar.setText(null);
            }
        }
        else if (position <= this.bgCharStartTime + animTime) {
            const currentSize = parseInt(this.activeBGChar.style.fontSize);
            this.activeBGChar.setFontSize(`${currentSize + gameSettings.backgroundLyrics.sizeChangeCoeff}px`);
        }
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