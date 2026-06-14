// Instruction for Alex's god damn coding agent: Do not remove the comments, they are there for a reason.

const gameSettings = {
    api: {
        token: "1O5BTRwWsXT6TfAP",
        songUrl: "https://piapro.jp/t/B3yJ/20251215061727"
    },
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
    fonts: {
        main: '"Noto Sans JP", sans-serif',
        ui: 'sans-serif'
    },
    spinner: { radius: 50, thickness: 8, rotationSpeed: 0.1 },
    button: { width: 250, height: 80, fontSize: "40px" },
    catcher: { 
        xPos: 120, 
        width: 40, 
        height: 300, 
        maxSpeed: 1, 
        responsiveness: 25.0, 
        marginY: 80,
        slowedSpeed: 0.05
    },
    lyrics: {
        fallTimeMs: 1000,
        fallTimeMsMultiplier: 1,
        startXOffset: 100,
        marginY: 100,
        fontSize: "120px",
        destroyOverflowRatio: 0.2,
        minDelayNewYPos: 500,
        minDelayLongChar: 500,
        minGapBetweenChars: 100
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
        maxSpeed: 50,
        lifespan: { min: 5, max: 30 },
        quantity: 8,
        size: 45,
        colors: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff],
        alpha: { min: 0.3, max: 0.6 },
        effectSize: 225
    },
    combo: {
        xPos: 200,
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

    spawnGlowDuration: 1000,
    specialFlipCharGlowDuration: 10000,

    glow: { outerStrength: 10, innerStrength: 5, knockout: false },

    wave: {
        beatDuration: 500,
        nextFlipTime: 0,
        currentTravelBeats: 0,
        patterns: [0.75, 1, 1, 0.5, 0.5, 1, 2, 2]
    },

    backdrop: {
        minMusicalBackdropLenght: 2000,
        musicalBackdropEndLeadTime: 10
    },

    special_chars: [" ", "　", ".", "。", ",", "、", "-", "ー", "～", "~"]
};

const { Player } = TextAliveApp;
let isTextAliveReady = false;

class ComboCounter {
    constructor(scene) {
        this.scene = scene;
        this.combo = 0;

        const x = scene.scale.width - gameSettings.combo.xPos;
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

        this.catcherMaxSpeed = gameSettings.catcher.maxSpeed;
    }

    toggleDirection() {
        this.direction *= -1;
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

    changeMaxSpeed(speed){
        this.catcherMaxSpeed = speed;
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

    update(delta, sceneHeight) {
        const targetSpeed = this.direction * sceneHeight * this.charSpawnYPointerSpeed;
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

    changeSpeed(speed){
        console.log("Change pointer speed");
        this.charSpawnYPointerSpeed = speed;
    }
}

class ActiveChar {
    constructor(scene, char, obj, startX, yPos, stripLength, stripHeight, glowDuration, charSpawnYPointerRef) {
        this.scene = scene;
        this.char = char;
        this.obj = obj;
        this.startX = startX;
        this.yPos = yPos;
        this.charSpawnYPointer = charSpawnYPointerRef;
        this.strip = this.createStrip(stripLength, stripHeight);
        this.glowDuration = glowDuration;
        this.glowRemaining = glowDuration;
        this.glowEffect = this.createGlowEffect();
        this.glowRemaining = glowDuration;
        this.glowEffect = this.createGlowEffect();
    }

    createStrip(stripLength, stripHeight) {
        if (stripLength < gameSettings.minDelayLongChar) {
            return null;
        }

        this.charSpawnYPointer.changeSpeed(gameSettings.catcher.slowedSpeed);
        setTimeout(this.charSpawnYPointer.changeSpeed(gameSettings.charSpawnYPointer.speed), stripLength);

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

class MusicalBackdrop {
    constructor(scene) {
        // defaults to disabled, call enable() to show
        this.scene = scene;
        this.scroll = 0;
        this.pulse = 0;
        this.backdropGraphics = scene.add.graphics().setDepth(-10);
        this.gridGraphics = scene.add.graphics().setDepth(-9);
        this.clipGraphics = scene.add.graphics().setDepth(-8);
        this.playheadGraphics = scene.add.graphics().setDepth(-7);
        this.opacity = 0;
        this.enabled = false;
        this.state_change_time = 0;
        this.trackSeed = [0.32, 0.68, 0.45, 0.82, 0.54, 0.74, 0.38, 0.62];
        this.clipColors = [0x8a2be2, 0x9d4edd, 0x7b2cbf, 0xc77dff, 0x5a189a, 0xb5179e];
    }

    enable(time) {
        this.enabled = true;
        this.state_change_time = time;
    }

    disable(time) {
        this.enabled = false;
        this.state_change_time = time;
    }

    update(time, delta, sceneWidth, sceneHeight) {
        const baseOpacity = 0.45;
        const targetOpacity = this.enabled ? 1 : baseOpacity;
        const fadeDuration = this.enabled ? 1000 : gameSettings.backdrop.musicalBackdropEndLeadTime;
        const fadeProgress = Phaser.Math.Clamp((time - this.state_change_time) / fadeDuration, 0, 1);

        if (this.enabled) {
            this.opacity = Phaser.Math.Easing.Quartic.Out(fadeProgress);
        } else {
            this.opacity = Phaser.Math.Linear(this.opacity || baseOpacity, targetOpacity, Phaser.Math.Easing.Quartic.Out(fadeProgress));
        }

        const layerAlpha = Phaser.Math.Clamp(this.opacity, baseOpacity, 1);
        this.backdropGraphics.setAlpha(layerAlpha);
        this.gridGraphics.setAlpha(layerAlpha);
        this.clipGraphics.setAlpha(layerAlpha);
        this.playheadGraphics.setAlpha(layerAlpha);

        this.scroll += delta * (this.enabled ? 72 : 42);
        this.pulse = 0.5 + Math.sin(time * 0.006) * 0.5;

        const accentNumeric = gameSettings.colors.pointer;
        const leftGutter = Math.max(110, sceneWidth * 0.11);
        const rightEdge = sceneWidth + 40;
        const top = Math.max(44, sceneHeight * 0.08);
        const bottom = sceneHeight - Math.max(58, sceneHeight * 0.08);
        const usableHeight = Math.max(180, bottom - top);
        const trackCount = Phaser.Math.Clamp(Math.floor(usableHeight / 72), 4, 8);
        const trackGap = 8;
        const trackHeight = (usableHeight - trackGap * (trackCount - 1)) / trackCount;
        const barWidth = Math.max(120, sceneWidth / 8);
        const minorWidth = barWidth / 4;
        const clipSpacing = barWidth * 1.42;
        const clipCycleWidth = clipSpacing * 8;

        this.backdropGraphics.clear();
        this.backdropGraphics.fillStyle(0x0b0d12, 0.86);
        this.backdropGraphics.fillRect(0, 0, sceneWidth, sceneHeight);
        this.backdropGraphics.fillStyle(0x151824, 0.72);
        this.backdropGraphics.fillRect(leftGutter, top - 22, sceneWidth - leftGutter, usableHeight + 44);
        this.backdropGraphics.fillStyle(0x10131b, 0.9);
        this.backdropGraphics.fillRect(0, top - 22, leftGutter, usableHeight + 44);

        this.gridGraphics.clear();
        this.gridGraphics.lineStyle(1, 0xffffff, 0.05);
        for (let i = 0; i <= trackCount; i++) {
            const y = top + i * (trackHeight + trackGap) - trackGap / 2;
            this.gridGraphics.lineBetween(0, y, rightEdge, y);
        }

        const firstMinor = leftGutter - (this.scroll % minorWidth);
        for (let x = firstMinor; x < rightEdge; x += minorWidth) {
            const isBar = Math.round((x - firstMinor) / minorWidth) % 4 === 0;
            this.gridGraphics.lineStyle(isBar ? 2 : 1, isBar ? accentNumeric : 0xffffff, isBar ? 0.17 : 0.055);
            this.gridGraphics.lineBetween(x, top - 22, x, bottom + 22);
        }

        this.clipGraphics.clear();
        for (let i = 0; i < trackCount; i++) {
            const trackY = top + i * (trackHeight + trackGap);
            const laneColor = this.clipColors[i % this.clipColors.length];
            const trackNameWidth = leftGutter - 28;

            this.clipGraphics.fillStyle(laneColor, 0.12);
            this.clipGraphics.fillRect(16, trackY, trackNameWidth, trackHeight);
            this.clipGraphics.lineStyle(1, laneColor, 0.18);
            this.clipGraphics.strokeRect(16, trackY, trackNameWidth, trackHeight);
            this.clipGraphics.fillStyle(laneColor, 0.18 + this.pulse * 0.06);
            this.clipGraphics.fillRect(26, trackY + 10, 8, trackHeight - 20);

            for (let c = 0; c < 8; c++) {
                const seed = this.trackSeed[(i + c + this.trackSeed.length) % this.trackSeed.length];
                const clipWidth = barWidth * (0.72 + seed * 0.9);
                const travel = this.scroll * (0.55 + i * 0.04);
                const cycleOffset = travel % clipCycleWidth;
                let clipX = leftGutter + c * clipSpacing - cycleOffset;
                const clipY = trackY + 8 + (i % 2) * 3;
                const clipHeight = trackHeight - 16 - (i % 3) * 4;

                if (clipX + clipWidth < -80) {
                    clipX += clipCycleWidth;
                }

                if (clipX > rightEdge + 80 || clipX + clipWidth < -80) {
                    continue;
                }

                this.clipGraphics.fillStyle(laneColor, 0.16 + (this.enabled ? 0.1 : 0));
                this.clipGraphics.fillRoundedRect(clipX, clipY, clipWidth, clipHeight, 6);
                this.clipGraphics.lineStyle(1, laneColor, 0.34);
                this.clipGraphics.strokeRoundedRect(clipX, clipY, clipWidth, clipHeight, 6);

                if (i % 3 === 1) {
                    this.drawMidiNotes(this.clipGraphics, clipX, clipY, clipWidth, clipHeight, laneColor, time, i, c);
                } else if (i % 3 === 2) {
                    this.drawAutomation(this.clipGraphics, clipX, clipY, clipWidth, clipHeight, laneColor, time, i);
                } else {
                    this.drawWaveform(this.clipGraphics, clipX, clipY, clipWidth, clipHeight, laneColor, time, i);
                }
            }
        }

        this.drawPlayhead(leftGutter, top - 28, bottom + 28, sceneWidth, accentNumeric);
    }

    drawWaveform(graphics, x, y, width, height, color, time, trackIndex) {
        const centerY = y + height / 2;
        const steps = 18;

        graphics.lineStyle(2, color, 0.33);
        for (let i = 0; i < steps; i++) {
            const px = x + (i / steps) * width;
            const amp = Math.sin(time * 0.004 + i * 0.9 + trackIndex) * height * 0.22;
            graphics.lineBetween(px, centerY - amp, px + width / steps * 0.46, centerY + amp * 0.55);
        }
    }

    drawMidiNotes(graphics, x, y, width, height, color, time, trackIndex, clipIndex) {
        const rows = 5;
        const noteHeight = Math.max(3, height / 9);

        graphics.fillStyle(color, 0.3);
        for (let i = 0; i < 10; i++) {
            const rowIndex = i * 2 + trackIndex + clipIndex;
            const row = ((rowIndex % rows) + rows) % rows;
            const noteX = x + 12 + i * (width - 24) / 10;
            const noteY = y + 10 + row * (height - 20) / rows;
            const noteWidth = width * (0.06 + ((i + trackIndex) % 3) * 0.025);
            const shimmer = Math.sin(time * 0.007 + i) > 0.75 ? 0.12 : 0;
            graphics.fillStyle(color, 0.25 + shimmer);
            graphics.fillRoundedRect(noteX, noteY, noteWidth, noteHeight, 3);
        }
    }

    drawAutomation(graphics, x, y, width, height, color, time, trackIndex) {
        const points = 7;
        let prevX = x + 10;
        let prevY = y + height * (0.48 + Math.sin(time * 0.002 + trackIndex) * 0.18);

        graphics.lineStyle(2, color, 0.32);
        for (let i = 1; i <= points; i++) {
            const nextX = x + 10 + (i / points) * (width - 20);
            const nextY = y + height * (0.5 + Math.sin(time * 0.002 + i * 1.2 + trackIndex) * 0.26);
            graphics.lineBetween(prevX, prevY, nextX, nextY);
            graphics.fillStyle(color, 0.38);
            graphics.fillCircle(nextX, nextY, 3);
            prevX = nextX;
            prevY = nextY;
        }
    }

    drawPlayhead(leftGutter, top, bottom, sceneWidth, color) {
        const playheadX = leftGutter + Math.max(72, (sceneWidth - leftGutter) * 0.16);

        this.playheadGraphics.clear();
        this.playheadGraphics.lineStyle(3, color, 0.56 + this.pulse * 0.22);
        this.playheadGraphics.lineBetween(playheadX, top, playheadX, bottom);
        this.playheadGraphics.fillStyle(color, 0.16 + this.pulse * 0.1);
        this.playheadGraphics.fillTriangle(playheadX - 9, top, playheadX + 9, top, playheadX, top + 14);
        this.playheadGraphics.fillStyle(color, 0.05);
        this.playheadGraphics.fillRect(playheadX, top, sceneWidth - playheadX, bottom - top);
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

        this.musicalBackdrop = new MusicalBackdrop(this);

        this.comboCounter = new ComboCounter(this);

        this.charGroup = this.physics.add.group();
        this.physics.add.overlap(this.catcher.sprite, this.charGroup, this.catchChar, null, this);

        this.cursors = this.input.keyboard.on('keydown-SPACE', () => {
            this.catcher.toggleDirection();
        }, this);
        this.activeChars = [];
        this.pendingChars = [];
        this.lastCharStartTime = 0; // used to ensure minimum gap between chars
        this.dyingStrips = [];
        this.fallDistance = (this.scale.width + gameSettings.lyrics.startXOffset) - this.catcher.x;
        this.charSize = parseInt(gameSettings.lyrics.fontSize);

        this.maxDurationBGEffect = gameSettings.backgroundLyrics.maxDurationBGEffect;
        this.activeBGChar = null;
        this.bgCharEndTime = 0;
        this.bgCharColorIndex = 0;

        this.charSpawnYPointer = new CharSpawnYPointer(
            this.scale.height / 2
        );

        this.spawnPointerGraphics = this.add.graphics();
        this.spawnPointerGraphics.fillStyle(gameSettings.colors.pointer, 1);
        this.spawnPointerGraphics.fillCircle(0, 0, 10);
        this.spawnPointerGraphics.setDepth(1);
        this.spawnPointerGraphics.x = this.scale.width - 50;
        this.spawnPointerGraphics.y = this.charSpawnYPointer.y;

        this.activeCatchParticles = [];

        if (taPlayer && taPlayer.video) this.loadLyrics(taPlayer.video.firstChar);

        // Create the background char that gets updated when you catch one
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

        this.scale.on('resize', (gameSize) => {
            this.comboCounter.resize(gameSize.height);
        });
    }

    update(time, delta) {
        delta = delta / 1000;
        const w = this.scale.width;
        const h = this.scale.height;


        if (!taPlayer || !taPlayer.isPlaying) return;
        const songTime = taPlayer.timer.position;
        const startX = w + gameSettings.lyrics.startXOffset;

        this.catcher.update(delta, h);
        this.spawnPointerGraphics.y = this.charSpawnYPointer.y;
        this.charSpawnYPointer.update(delta, h);
        this.spawnPendingChars(songTime, startX, w, h);
        this.updateActiveChars(songTime, startX, delta);
        this.destroyStrips(delta);
        this.updateBGChar();
        this.manageMusicalBackdrop(songTime, delta, w, h);
        this.updateCatchParticles();
    }

    manageMusicalBackdrop(time, delta, sceneWidth, sceneHeight) {
        if (!taPlayer || !taPlayer.isPlaying) return;

        // Check if we should enable the chord backdrop based on the next pending character and the current song time
        if (
            this.pendingChars.length > 0
            && (this.pendingChars[0].startTime - this.fallTime - time) > gameSettings.backdrop.minMusicalBackdropLenght
            && !this.musicalBackdrop.enabled
        ) {
            this.musicalBackdrop.enable(time);
            //console.log("Enabling chord backdrop");
            this.time.delayedCall(time - this.pendingChars[0].startTime - this.fallTime - gameSettings.backdrop.musicalBackdropEndLeadTime, () => {
                this.musicalBackdrop.disable(this.time.now);
                //console.log("Disabling chord backdrop");
            });
        }

        this.musicalBackdrop.update(time, delta, sceneWidth, sceneHeight);
    }

    spawnPendingChars(time, startX, sceneWidth, sceneHeight) {
        // Push characters whose start time has arrived from pendingChars -> activeChars
        while (this.pendingChars.length > 0) {
            const nextChar = this.pendingChars[0];
            const yPos = this.charSpawnYPointer.y;
            let glowDuration = gameSettings.spawnGlowDuration;

            if (time >= Math.max(nextChar.startTime - this.fallTime, (this.lastCharStartTime + gameSettings.lyrics.minGapBetweenChars) - this.fallTime)) {
                if (this.waveState.advance(time)) {
                    this.charSpawnYPointer.flipDirection();
                    glowDuration = gameSettings.specialFlipCharGlowDuration;
                }

                const charObj = this.add.text(startX, this.charSpawnYPointer.y, nextChar.text, {
                    fontFamily: gameSettings.fonts.main,
                    fontSize: gameSettings.lyrics.fontSize,
                    color: gameSettings.colors.textMain
                }).setOrigin(0.5);

                const stripLength = nextChar.endTime - nextChar.startTime - this.charSize;

                this.charGroup.add(charObj);
                this.lastCharStartTime = nextChar.startTime;
                this.activeChars.push(new ActiveChar(this, nextChar, charObj, startX, yPos, stripLength, this.charSize / 5, glowDuration, this.charSpawnYPointer));
                this.pendingChars.shift();
            } else {
                break;
            }
        }
    }

    destroyStrips(delta) {
        delta = delta * 1000;
        for (let i = this.dyingStrips.length - 1; i >= 0; i--) {
            const item = this.dyingStrips[i];
            this.catcher.changeMaxSpeed(gameSettings.catcher.slowedSpeed);

            item.progress += delta / item.stripDuration;

            const remainingWidth = item.maxWidth * (1 - item.progress);
            item.strip.setSize(Math.max(0, remainingWidth), item.strip.height);

            if (item.progress >= 1) {
                item.strip.destroy();
                item.obj.destroy();
                this.dyingStrips.splice(i, 1);
                this.catcher.changeMaxSpeed(gameSettings.catcher.maxSpeed);
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

    calcEndXPos(yPos, k){
        // Gives x coordinate goal of a particle depending on y (relative to the catcher)
        const y = yPos - this.catcher.y;

        if (y < -k || y > k){
            console.log(`Out of range particle : catcherY = ${this.catcher.y} y = ${y}`);
            return null;
        }

        if (y < 0){
            return y**2/k + 3*y + 2*k; //a*y**2/k + 2*a*y + a*k
        }
        else{
            return y**2/k - 3*y + 2*k; 
        }
    }

    calcPartSpeed(dist, k){
        // Gives current speed of a particle depending on its distance from its goal
        if (dist < 0 || dist > 2*k){
            return 0;
        }

        const m = gameSettings.catchParticles.maxSpeed;
        return (m*dist/(2*k)); // m*Math.sqrt(dist/(2*k))
    }

    spawnCatchParticles(){
        const minY = this.catcher.y - gameSettings.catcher.height/2;
        const maxY = this.catcher.y + gameSettings.catcher.height/2;
        const mean = (minY + maxY) / 2;

        for (let i = gameSettings.catchParticles.quantity - 1; i >= 0; i--){
            let particle = null;

            const spawnX = gameSettings.catcher.xPos + gameSettings.catcher.width/2 + ((Math.random() - 0.3) * 30);
            const spawnY = Math.random() * (maxY - minY) + minY;
            const color = gameSettings.catchParticles.colors[Math.floor(Math.random() * gameSettings.catchParticles.colors.length)];
            const alpha = Math.random() * (gameSettings.catchParticles.alpha.max - gameSettings.catchParticles.alpha.min) + gameSettings.catchParticles.alpha.min;

            particle = this.add.rectangle(
                spawnX,
                spawnY,
                gameSettings.catchParticles.size,
                gameSettings.catchParticles.size,
                color,
                alpha
            );
            particle.setAngle(Math.random() * 360);

            //console.log(`Spawned particle at ${spawnX} - ${spawnY} size ${gameSettings.catchParticles.size} color ${color} alpha ${alpha}`);

            const lifespanRange = gameSettings.catchParticles.lifespan.max - gameSettings.catchParticles.lifespan.min;
            const lifespan = Math.random() * lifespanRange + gameSettings.catchParticles.lifespan.min;

            const finalX = spawnX + this.calcEndXPos(spawnY, gameSettings.catchParticles.effectSize);

            this.activeCatchParticles.push({ particle, lifespan, finalX });
        }
    }

    catchChar(catcher, charObj) {
        this.spawnCatchParticles();

        const idx = this.activeChars.findIndex(l => l.obj === charObj);
        if (idx > -1) {
            const char = this.activeChars[idx];
            this.activeChars.splice(idx, 1);
            char.retire(this.dyingStrips, this.fallDistance, this.fallTime);

            this.comboCounter.increment();

            const charDuration = char.char.endTime - char.char.startTime;
            this.bgCharStartTime = taPlayer.timer.position;
            this.bgCharEndTime = taPlayer.timer.position + charDuration;

            this.activeBGChar.setText(charObj.text);
            this.activeBGChar.setAlpha(gameSettings.backgroundLyrics.startAlpha);

            this.bgCharColorIndex = (this.bgCharColorIndex + 1) % gameSettings.backgroundLyrics.colors.length;
            const color = gameSettings.backgroundLyrics.colors[Math.floor(Math.random() * gameSettings.backgroundLyrics.colors.length)];
            this.activeBGChar.setColor(color);
            this.activeBGChar.setFontSize(gameSettings.backgroundLyrics.fontSize);
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

    updateCatchParticles(){
        for (let i = this.activeCatchParticles.length - 1; i >= 0; i--) {
            const item = this.activeCatchParticles[i];
            const particle = item.particle;
            const lifespan = item.lifespan;
            const finalX = item.finalX;

            if (lifespan <= 0){
                particle.destroy();
                this.activeCatchParticles.splice(i, 1);
            }
            else{
                this.activeCatchParticles[i].lifespan -= 1;

                const speed = this.calcPartSpeed(finalX - particle.x, gameSettings.catchParticles.effectSize);
                particle.x += speed;
            }
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

const taPlayer = new Player({ app: { token: gameSettings.api.token }, mediaElement: document.querySelector("#media") });
taPlayer.addListener({ onTimerReady() { isTextAliveReady = true; } });
taPlayer.createFromSongUrl(gameSettings.api.songUrl);
