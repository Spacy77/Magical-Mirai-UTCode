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
        strip: 0xCCCCCC,
        pointer: 0x00FFFF
    },
    fonts: {
        main: 'jackeyfont',
        ui: 'jackeyfont'
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
        fallTimeMs: 1300,
        fallTimeMsMultiplier: 1,
        startXOffset: 100,
        marginY: 100,
        fontSize: "160px",
        destroyOverflowRatio: 0.2,
        minDelayNewYPos: 500,
        minDelayLongChar: 500,
        minGapBetweenChars: 100,
        lyricsDelay: 200
    },
    backgroundLyrics: {
        fontSize: "450px",
        maxDurationBGEffect: 150,
        maxDurationBGAnim: 100,
        sizeChangeCoeff: 10,
        colors: ["#D00000", "#FFB703", "#2A9D8F", "#86cecb", "#8338EC", "#e12885", "#137a7f"],
        startAlpha: 0.5,
        fadeOutSpeed: 5
    },
    catchParticles: {
        maxSpeed: 10,
        lifespan: { min: 30, max: 100 },
        quantity: 4,
        size: 45,
        boringColors: [0x274c5e, 0x3a7d7a, 0x7fb8aa, 0xd9efe7, 0xfdfaf4],
        mildColors: [0x6d3fa9, 0xa37ad9, 0x2e7d5b, 0x7ecf9a, 0xf3f0ea, 0xe12885, 0x137a7f],
        excitingColors: [0xff9835, 0xfaa668, 0xf52019, 0xff533a, 0xff7254],
        alpha: { min: 0.3, max: 0.6 },
        effectSizes: [225, 300, 400],
        arousalThresholds: [0.335, 0.37],
        valenceThresholds: [0.15, 0.20]
    },
    combo: {
        xOffset: 100,
        mainYOffset: 125,
        scoreYOffset: 175,
        fontSize: 100,
        color: "#ffffff",
        ghostAlpha: 0.2,
        mainScaleBounce: 1.1,
        ghostScaleBounce: 1.4,
        animDuration: 500,

        displayXOffset: 230,
        displayMainYOffset: 90,
        displayScoreYOffset: 170,
        displayFontSize: 40
    },
    charSpawnYPointer: { speed: 1 },

    minDelayLongChar: 400,

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

    special_chars: [" ", "　", ".", "。", ",", "、", "-", "ー", "～", "~"],

    visualizer: {
        numBars: 15,
        barWidth: 60,
        barGap: 5,
        maxHeight: 800,
        numSegments: 16,
        segmentGap: 4,
        reflectionSegments: 4,
        reflectionAlpha: 0.25,
        smoothingUp: 0.95,
        smoothingDown: 0.04,
        depth: -5,
        
        bellCurveStrength: 5,
        beatSharpness: 20,
        arousalWeight: 10.0,
        beatWeight: 100.0,
        noiseAmount: 0.60,
        perBarDrift: 20,
        minLevel: 50.0,

        redThreshold: 0.4,
        gradientStops: [
            { r: 134,  g: 206, b: 203  }, //low
            { r: 34, g: 16, b: 79   }, //middle
            { r: 225, g: 40,  b: 133   }  //top
        ],

        minDelayTrigger: 5000
    },
};

const { Player } = TextAliveApp;
let isTextAliveReady = false;

class ComboCounter {
    constructor(scene) {
        this.scene = scene;
        this.combo = 0;
        this.comboPoints = 0;
        this.totalScore = 0;

        this.valueX = this.scene.scale.width - gameSettings.combo.xOffset;
        this.displayX = this.scene.scale.width - gameSettings.combo.displayXOffset;
        this.varXOffset = 0;

        this.ghostText = scene.add.text(this.valueX, gameSettings.combo.mainYOffset, "0", {
            fontFamily: gameSettings.fonts.ui,
            fontSize: `${gameSettings.combo.fontSize}px`,
            color: gameSettings.combo.color,
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 4
        }).setOrigin(0, 1).setAlpha(gameSettings.combo.ghostAlpha).setDepth(100);

        this.mainText = scene.add.text(this.valueX, gameSettings.combo.mainYOffset, "0", {
            fontFamily: gameSettings.fonts.ui,
            fontSize: `${gameSettings.combo.fontSize}px`,
            color: gameSettings.combo.color,
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 6
        }).setOrigin(0, 1).setDepth(101);

        this.totalScoreText = scene.add.text(this.valueX, gameSettings.combo.scoreYOffset, "0", {
            fontFamily: gameSettings.fonts.ui,
            fontSize: `${gameSettings.combo.fontSize / 2}px`,
            color: gameSettings.combo.color,
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 6
        }).setOrigin(0, 1).setDepth(102);

        // Display text in front of combo and score
        this.displayComboText = scene.add.text(this.displayX, gameSettings.combo.displayMainYOffset, "Combo", {
            fontFamily: gameSettings.fonts.ui,
            fontSize: `${gameSettings.combo.displayFontSize}px`,
            color: gameSettings.combo.color,
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 6
        }).setOrigin(0, 1).setDepth(102);

        this.displayTotalScoreText = scene.add.text(this.displayX, gameSettings.combo.displayScoreYOffset, "Score", {
            fontFamily: gameSettings.fonts.ui,
            fontSize: `${gameSettings.combo.displayFontSize}px`,
            color: gameSettings.combo.color,
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 6
        }).setOrigin(0, 1).setDepth(102);
    }

    increment() {
        this.combo++;
        this.comboPoints = this.calcPointsCurrentCombo(this.combo);

        if (this.comboPoints == 11 || this.comboPoints == 102 || this.comboPoints == 1002){
            this.varXOffset += gameSettings.combo.fontSize / 2;

            this.ghostText.x = this.valueX - this.varXOffset;
            this.mainText.x = this.valueX - this.varXOffset;
            this.totalScoreText.x = this.valueX - this.varXOffset;
            this.displayComboText.x = this.displayX - this.varXOffset;

            if (this.totalScoreText.x > this.valueX - this.varXOffset){
                this.totalScoreText.x = this.valueX - this.varXOffset;
            }
            if (this.displayTotalScoreText.x > this.displayX - this.varXOffset){
                this.displayTotalScoreText.x = this.displayX - this.varXOffset;
            }
        }

        this.updateText();
        this.playAnimation();
    }

    reset() {
        if (this.combo > 0) {
            this.totalScore += this.comboPoints;
            this.combo = 0;
            this.comboPoints = 0;

            this.varXOffset = 0;
            this.ghostText.x = this.valueX;
            this.mainText.x = this.valueX;
            this.displayComboText.x = this.displayX - this.varXOffset;

            this.updateText();
            this.scene.tweens.killTweensOf([this.mainText, this.ghostText]);
            this.mainText.setScale(1);
            this.ghostText.setScale(1);
        }
    }

    updateText() {
        const text = this.comboPoints.toString();
        this.mainText.setText(text);
        this.ghostText.setText(text);

        const totalText = (this.comboPoints + this.totalScore).toString();
        this.totalScoreText.setText(totalText);
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

    calcPointsCurrentCombo(combo){
        if (combo < 1){
            return 0;
        }
        if (combo < 20){
            return Math.floor(0.16 * (combo**2) - 0.33 * combo + 1.16);
        }
        if (combo >= 20){
            return 3 * combo;
        }
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
        this.charSpawnYPointerSpeed = speed;
    }
}

class ActiveChar {
    constructor(scene, char, obj, startX, yPos, stripLength, stripHeight, charSpawnYPointerRef, effectiveStartTime) {
        this.scene = scene;
        this.char = char;
        this.obj = obj;
        this.startX = startX;
        this.yPos = yPos;
        this.charSpawnYPointer = charSpawnYPointerRef;
        this.effectiveStartTime = effectiveStartTime;
        this.strip = this.createStrip(stripLength, stripHeight);
    }

    createStrip(stripLength, stripHeight) {
        if (stripLength < gameSettings.minDelayLongChar) {
            return null;
        }

        this.charSpawnYPointer.changeSpeed(gameSettings.catcher.slowedSpeed);
        setTimeout(() => {
            this.charSpawnYPointer.changeSpeed(gameSettings.charSpawnYPointer.speed);}, 
        stripLength);

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

    update(time, startX, catcherX, fallTime, delta, destroyThreshold, fallDistance, charSize, dyingStrips) {
        const progress = (time - (this.effectiveStartTime - fallTime)) / fallTime;

        this.obj.x = startX - (startX - catcherX) * progress;
        this.updateStripPosition(startX, catcherX, progress, charSize);

        if (progress > 1 + destroyThreshold) {
            this.retire(dyingStrips, fallDistance, fallTime);
            return true;
        }

        return false;
    }

    updateStripPosition(startX, catcherX, progress, charSize) {
        if (this.strip != null) {
            this.strip.x = startX - (startX - catcherX) * progress + charSize / 2;
        }
    }

    retire(dyingStrips, fallDistance, fallTime) {

        if (this.strip == null) {
            this.obj.destroy();
            return;
        }

        const stripDuration = (this.strip.width / fallDistance) * fallTime;
        dyingStrips.push({ strip: this.strip, maxWidth: this.strip.width, progress: 0, obj: this.obj, stripDuration: stripDuration });
    }
}

class MusicalBackdrop {
    constructor(scene) {
        this.scene = scene;
        this.scroll = 0;
        this.pulse = 0;
        this.enabled = false;
        this.state_change_time = 0;
        this.opacity = 0;
        this.trackSeed = [0.32, 0.68, 0.45, 0.82, 0.54, 0.74, 0.38, 0.62];
        this.clipColors = [0x8a2be2, 0x9d4edd, 0x7b2cbf, 0xc77dff, 0x5a189a, 0xb5179e];

        // ── Un seul objet graphics au lieu de 4 → 4x moins de clear() par frame
        this.graphics = scene.add.graphics().setDepth(-10);

        // ── Backdrop statique pré-rendu en RenderTexture ──────────────────────
        // Le fond sombre ne change jamais → on le dessine une seule fois
        this.backdropTexture = null;
        this._backdropDirty  = true; // force le premier rendu
        this._lastW = 0;
        this._lastH = 0;

        // ── Throttle : ne redessine qu'une frame sur deux ─────────────────────
        this._skipFrame = false;
    }

    enable(time) {
        this.enabled = true;
        this.state_change_time = time;
    }

    disable(time) {
        this.enabled = false;
        this.state_change_time = time;
    }

    /**
     * Construit (ou reconstruit si la taille a changé) la RenderTexture
     * du fond statique. Appelé une seule fois tant que la taille ne change pas.
     */
    _rebuildBackdropTexture(leftGutter, top, usableHeight, sceneWidth, sceneHeight) {
        if (this.backdropTexture) this.backdropTexture.destroy();

        this.backdropTexture = this.scene.add.renderTexture(0, 0, sceneWidth, sceneHeight)
            .setDepth(-11)
            .setAlpha(0); // invisible par défaut, alpha géré par update()

        const g = this.scene.make.graphics({ add: false });
        g.fillStyle(0x0b0d12, 0.86);
        g.fillRect(0, 0, sceneWidth, sceneHeight);
        g.fillStyle(0x151824, 0.72);
        g.fillRect(leftGutter, top - 22, sceneWidth - leftGutter, usableHeight + 44);
        g.fillStyle(0x10131b, 0.9);
        g.fillRect(0, top - 22, leftGutter, usableHeight + 44);
        this.backdropTexture.draw(g, 0, 0);
        g.destroy();

        this._backdropDirty = false;
        this._lastW = sceneWidth;
        this._lastH = sceneHeight;
    }

    update(time, delta, sceneWidth, sceneHeight) {
        // ── Throttle : saute une frame sur deux ──────────────────────────────
        this._skipFrame = !this._skipFrame;
        if (this._skipFrame) return;

        // ── Opacité ───────────────────────────────────────────────────────────
        const baseOpacity  = 0.45;
        const fadeDuration = this.enabled ? 1000 : gameSettings.backdrop.musicalBackdropEndLeadTime;
        const fadeProgress = Phaser.Math.Clamp((time - this.state_change_time) / fadeDuration, 0, 1);

        this.opacity = this.enabled
            ? Phaser.Math.Easing.Quartic.Out(fadeProgress)
            : Phaser.Math.Linear(this.opacity || baseOpacity, baseOpacity,
                Phaser.Math.Easing.Quartic.Out(fadeProgress));

        const layerAlpha = Phaser.Math.Clamp(this.opacity, baseOpacity, 1);
        this.graphics.setAlpha(layerAlpha);

        // ── Layout ────────────────────────────────────────────────────────────
        const leftGutter  = Math.max(110, sceneWidth * 0.11);
        const rightEdge   = sceneWidth + 40;
        const top         = Math.max(44, sceneHeight * 0.08);
        const bottom      = sceneHeight - Math.max(58, sceneHeight * 0.08);
        const usableHeight = Math.max(180, bottom - top);

        // ── Backdrop statique ─────────────────────────────────────────────────
        if (this._backdropDirty || sceneWidth !== this._lastW || sceneHeight !== this._lastH) {
            this._rebuildBackdropTexture(leftGutter, top, usableHeight, sceneWidth, sceneHeight);
        }
        this.backdropTexture.setAlpha(layerAlpha);

        // ── Paramètres dynamiques ──────────────────────────────────────────────
        // trackCount réduit : 3 max au lieu de 8 → 3x moins de clips dessinés
        const trackCount  = Phaser.Math.Clamp(Math.floor(usableHeight / 72), 3, 5);
        const trackGap    = 8;
        const trackHeight = (usableHeight - trackGap * (trackCount - 1)) / trackCount;
        const barWidth    = Math.max(120, sceneWidth / 8);
        const minorWidth  = barWidth / 4;
        const clipSpacing = barWidth * 1.42;
        const accentNumeric  = gameSettings.colors.pointer;

        this.scroll += delta * (this.enabled ? 72 : 42);
        // Pulse arrondi à 2 décimales pour éviter les recalculs inutiles
        this.pulse = Math.round((0.5 + Math.sin(time * 0.006) * 0.5) * 100) / 100;

        this.graphics.clear();

        // ── Grille (lignes horizontales + verticales) ─────────────────────────
        this.graphics.lineStyle(1, 0xffffff, 0.05);
        for (let i = 0; i <= trackCount; i++) {
            const y = top + i * (trackHeight + trackGap) - trackGap / 2;
            this.graphics.lineBetween(0, y, rightEdge, y);
        }

        const firstMinor = leftGutter - (this.scroll % minorWidth);
        for (let x = firstMinor; x < rightEdge; x += minorWidth) {
            const isBar = Math.round((x - firstMinor) / minorWidth) % 4 === 0;
            this.graphics.lineStyle(
                isBar ? 2 : 1,
                isBar ? accentNumeric : 0xffffff,
                isBar ? 0.17 : 0.055
            );
            this.graphics.lineBetween(x, top - 22, x, bottom + 22);
        }

        // ── Clips ─────────────────────────────────────────────────────────────
        // fillRect au lieu de fillRoundedRect : ~5x plus rapide
        // 5 clips max au lieu de 8 : moins de draw calls
        for (let i = 0; i < trackCount; i++) {
            const trackY    = top + i * (trackHeight + trackGap);
            const laneColor = this.clipColors[i % this.clipColors.length];
            const trackNameWidth = leftGutter - 28;

            // En-tête de piste (gutter gauche)
            this.graphics.fillStyle(laneColor, 0.12);
            this.graphics.fillRect(16, trackY, trackNameWidth, trackHeight);
            this.graphics.lineStyle(1, laneColor, 0.18);
            this.graphics.strokeRect(16, trackY, trackNameWidth, trackHeight);  // strokeRect, pas strokeRoundedRect
            this.graphics.fillStyle(laneColor, 0.18 + this.pulse * 0.06);
            this.graphics.fillRect(26, trackY + 10, 8, trackHeight - 20);

            const travel      = this.scroll * (0.55 + i * 0.04);
            const cycleOffset = travel % (clipSpacing * 1000); // grand cycle pour éviter les resets

            // Calcule les indices de clips visibles (de hors-écran gauche à hors-écran droit)
            const firstC = Math.floor((cycleOffset - leftGutter - 80) / clipSpacing) - 1;
            const lastC  = Math.ceil((cycleOffset + rightEdge + 80) / clipSpacing) + 1;

            for (let c = firstC; c <= lastC; c++) {
                // Modulo pour réutiliser les seeds en boucle
                const seedIdx  = ((i + c) % this.trackSeed.length + this.trackSeed.length) % this.trackSeed.length;
                const seed     = this.trackSeed[seedIdx];
                const clipWidth = barWidth * (0.72 + seed * 0.9);
                const clipX    = leftGutter + c * clipSpacing - cycleOffset;
                const clipY    = trackY + 8 + (i % 2) * 3;
                const clipH    = trackHeight - 16 - (i % 3) * 4;

                // Filtre les clips hors de la zone visible
                if (clipX > rightEdge + 80 || clipX + clipWidth < -80) continue;

                this.graphics.fillStyle(laneColor, 0.16 + (this.enabled ? 0.1 : 0));
                this.graphics.fillRect(clipX, clipY, clipWidth, clipH);
                this.graphics.lineStyle(1, laneColor, 0.34);
                this.graphics.strokeRect(clipX, clipY, clipWidth, clipH);

                if (i % 3 === 0) {
                    this.drawWaveform(clipX, clipY, clipWidth, clipH, laneColor, time, i);
                } else if (i % 3 === 1) {
                    this.drawMidiNotes(clipX, clipY, clipWidth, clipH, laneColor, i, c);
                }
            }
        }

        // ── Playhead ──────────────────────────────────────────────────────────
        this.drawPlayhead(leftGutter, top - 28, bottom + 28, sceneWidth, accentNumeric);
    }

    // Waveform réduite : 8 steps au lieu de 18 → 2.25x moins de lineBetween
    drawWaveform(x, y, width, height, color, time, trackIndex) {
        const centerY = y + height / 2;
        const steps   = 8; // ← était 18

        this.graphics.lineStyle(2, color, 0.33);
        for (let i = 0; i < steps; i++) {
            const px  = x + (i / steps) * width;
            const amp = Math.sin(time * 0.004 + i * 0.9 + trackIndex) * height * 0.22;
            this.graphics.lineBetween(px, centerY - amp, px + width / steps * 0.46, centerY + amp * 0.55);
        }
    }

    // MidiNotes sans fillRoundedRect → fillRect, et 6 notes au lieu de 10
    drawMidiNotes(x, y, width, height, color, trackIndex, clipIndex) {
        const rows       = 5;
        const noteHeight = Math.max(3, height / 9);

        this.graphics.fillStyle(color, 0.3);
        for (let i = 0; i < 6; i++) { // ← était 10
            const rowIndex  = i * 2 + trackIndex + clipIndex;
            const row       = ((rowIndex % rows) + rows) % rows;
            const noteX     = x + 12 + i * (width - 24) / 6;
            const noteY     = y + 10 + row * (height - 20) / rows;
            const noteWidth = width * (0.06 + ((i + trackIndex) % 3) * 0.025);
            this.graphics.fillRect(noteX, noteY, noteWidth, noteHeight); // ← fillRect, pas fillRoundedRect
        }
    }

    drawPlayhead(leftGutter, top, bottom, sceneWidth, color) {
        const playheadX = leftGutter + Math.max(72, (sceneWidth - leftGutter) * 0.16);
        this.graphics.lineStyle(3, color, 0.56 + this.pulse * 0.22);
        this.graphics.lineBetween(playheadX, top, playheadX, bottom);
        this.graphics.fillStyle(color, 0.16 + this.pulse * 0.1);
        this.graphics.fillTriangle(playheadX - 9, top, playheadX + 9, top, playheadX, top + 14);
        // Supprime le fillRect du halo du playhead (peu visible, coûteux)
    }

    destroy() {
        this.graphics.destroy();
        if (this.backdropTexture) this.backdropTexture.destroy();
    }
}

/**
 * Visualisateur audio temps réel : colonnes de carrés colorés à la façon d'un égaliseur.
 * Utilise la Web Audio API (intégrée au navigateur, aucune dépendance externe).
 * Fallback automatique sur les données de beats TextAlive si CORS bloque l'accès audio.
 */
class MusicVisualizer {
    constructor(scene, config) {
        this.scene = scene;

        // ── Config mise en page ──────────────────────────────────────────────
        this.x                  = config.x                  ?? 0;
        this.y                  = config.y                  ?? scene.scale.height;
        this.numBars            = config.numBars            ?? 16;
        this.barWidth           = config.barWidth           ?? 35;
        this.barGap             = config.barGap             ?? 5;
        this.maxHeight          = config.maxHeight          ?? 250;
        this.numSegments        = config.numSegments        ?? 12;
        this.segmentGap         = config.segmentGap         ?? 4;
        this.reflectionSegments = config.reflectionSegments ?? 4;
        this.reflectionAlpha    = config.reflectionAlpha    ?? 0.25;
        this.depth              = config.depth              ?? -5;
        this.inactiveColor      = config.inactiveColor      ?? 0x1a1a1a;

        // ── Lissage asymétrique (monte vite, descend lentement) ──────────────
        this.smoothingUp   = config.smoothingUp   ?? 0.6;
        this.smoothingDown = config.smoothingDown ?? 0.12;

        // ── État Web Audio ───────────────────────────────────────────────────
        this.audioContext = null;
        this.analyser     = null;
        this.dataArray    = null;
        this.connected    = false;
        this.corsBlocked  = false;

        // ── Fallback TextAlive beat ──────────────────────────────────────────
        // Utilisé si la connexion Web Audio échoue (CORS).
        // Simule un signal global basé sur l'énergie du beat courant.
        this.beatFallbackLevel = 0;

        // ── Niveaux lissés courants [0..1] par barre ─────────────────────────
        this.currentLevels = new Float32Array(this.numBars).fill(0);
        // Phases d'oscillation indépendantes par barre — donne une vie propre à chaque colonne
        this.barPhases = new Float32Array(this.numBars);
        for (let b = 0; b < this.numBars; b++) {
            this.barPhases[b] = Math.random() * Math.PI * 2;
        }

        // Mémorise les smoothings de base pour les adapter au BPM
        this._baseSmoothingDown = this.smoothingDown;
        this._baseSmoothingUp   = this.smoothingUp;

        // Cache du profil d'accord courant (évite de recalculer à chaque frame)
        this._lastChordName    = null;
        this._lastChordProfile = null;

        // Enveloppe de phrase courante
        this._phraseEnvelope = 1.0;

        // ── Couleurs par segment : vert → jaune → rouge ──────────────────────
        this.segmentColors = this._buildGradient();

        // ── Objet graphique Phaser ───────────────────────────────────────────
        this.graphics = scene.add.graphics().setDepth(this.depth).setAlpha(0);

        this.enabled = false;
    }

    // ── Connexion Web Audio ─────────────────────────────────────────────────
    tryConnect() {
        this.corsBlocked = true;
        console.log("MusicVisualizer : mode fallback TextAlive activé");
    }

    /**
     * Construit un tableau de facteurs par barre à partir du nom d'un accord.
     * Les barres proches du fondamental et de la quinte sont renforcées.
     * Ex: "Am" → fondamental A (9), quinte E (4)
     */
    _buildChordProfile(chordName) {
        // Table de correspondance note → demi-ton (0 = C)
        const noteMap = {
            'C': 0, 'C#': 1, 'Db': 1,
            'D': 2, 'D#': 3, 'Eb': 3,
            'E': 4,
            'F': 5, 'F#': 6, 'Gb': 6,
            'G': 7, 'G#': 8, 'Ab': 8,
            'A': 9, 'A#': 10, 'Bb': 10,
            'B': 11
        };

        // Extrait la note fondamentale du nom d'accord ("Am7" → "A", "C#maj" → "C#")
        const match = chordName.match(/^([A-G][#b]?)/);
        if (!match) return null;

        const root  = noteMap[match[1]] ?? 0;
        const fifth = (root + 7) % 12;

        // Mappe les demi-tons vers des positions de barres
        const rootBar  = (root  / 12) * this.numBars;
        const fifthBar = (fifth / 12) * this.numBars;

        const profile = new Float32Array(this.numBars);
        for (let b = 0; b < this.numBars; b++) {
            const dRoot  = Math.min(Math.abs(b - rootBar),  this.numBars - Math.abs(b - rootBar));
            const dFifth = Math.min(Math.abs(b - fifthBar), this.numBars - Math.abs(b - fifthBar));

            // Pic gaussien sur le fondamental (fort) et la quinte (plus doux)
            const rootPeak  = Math.exp(-(dRoot  * dRoot)  / (this.numBars * 0.08));
            const fifthPeak = Math.exp(-(dFifth * dFifth) / (this.numBars * 0.08)) * 0.5;

            // Niveau de base 0.7 + modulation harmonique jusqu'à +0.5
            profile[b] = 0.7 + 0.5 * Math.max(rootPeak, fifthPeak);
        }

        return profile;
    }

    /**
     * Fallback : simule des niveaux de barres à partir des données de beat TextAlive.
     * Donne un effet de pulsation rythmique quand la Web Audio est inaccessible.
     */
    _readBeatFallbackLevels(taPlayer) {
        if (!taPlayer) return;

        const pos = taPlayer.timer.position;

        // ── 1. Valence / Arousal ─────────────────────────────────────────────────
        const va      = taPlayer.getValenceArousal ? taPlayer.getValenceArousal(pos) : null;
        const arousal = va ? Phaser.Math.Clamp((va.a + 1) / 2, 0, 1) : 0.5;
        const valence = va ? Phaser.Math.Clamp((va.v + 1) / 2, 0, 1) : 0.5;

        // ── 2. Beat ──────────────────────────────────────────────────────────────
        const beat = taPlayer.findBeat(pos);
        let pulse  = 0;
        let bpm    = 120;
        let beatPositionInBar = 0; // position dans la mesure (0 = temps fort)

        if (beat) {
            bpm = beat.bpm || 120;

            // Attaque aiguisée proportionnelle à l'arousal
            // Fort arousal = attaque plus brutale
            const sharpness = (this.beatSharpness ?? 3) + arousal * 2;
            pulse = Math.pow(Math.max(0, 1 - beat.progress(pos)), sharpness);

            const decayFactor = 1 - pulse * arousal;
            this.beatFallbackLevel *= (1 - decayFactor * 0.15);

            // Position dans la mesure : déduite de l'index du beat
            // Les temps forts (0, 2) donnent une impulsion plus forte que (1, 3)
            if (beat.position !== undefined) {
                beatPositionInBar = beat.position % 4;
            }
        }

        // Coefficient de pulsion selon la position dans la mesure
        // Temps 1 et 3 (index 0, 2) = forte impulsion
        // Temps 2 et 4 (index 1, 3) = impulsion réduite
        const beatAccentFactor = (beatPositionInBar % 2 === 0) ? 1.0 : 0.6;
        const accentedPulse    = pulse * beatAccentFactor;

        // ── 3. Adaptation du smoothing au BPM ────────────────────────────────────
        // Plus le tempo est rapide, plus les barres montent et descendent vite
        const bpmFactor     = bpm / 120;
        this.smoothingDown  = this._baseSmoothingDown * bpmFactor;
        this.smoothingUp    = Math.min(0.95, this._baseSmoothingUp * bpmFactor);

        // ── 4. Enveloppe de phrase ───────────────────────────────────────────────
        // Le visualisateur monte en intensité au fil d'une phrase et redescend à la fin
        const phrase = taPlayer.findPhrase ? taPlayer.findPhrase(pos) : null;
        if (phrase && phrase.endTime > phrase.startTime) {
            const t = (pos - phrase.startTime) / (phrase.endTime - phrase.startTime);
            // Attaque rapide (10%), sustain, release (15%)
            const envelope = t < 0.10 ? t / 0.10
                        : t > 0.85 ? 1 - (t - 0.85) / 0.15
                        : 1.0;
            // Lisse l'enveloppe pour éviter les sauts brusques
            this._phraseEnvelope += (envelope - this._phraseEnvelope) * 0.05;
        } else {
            this._phraseEnvelope = 1.0;
        }

        // ── 5. Profil harmonique basé sur l'accord courant ───────────────────────
        // Recalcule uniquement si l'accord a changé
        const chord = taPlayer.findChord ? taPlayer.findChord(pos) : null;
        const chordName = chord ? (chord.name ?? null) : null;
        if (chordName !== this._lastChordName) {
            this._lastChordName    = chordName;
            this._lastChordProfile = chordName
                ? this._buildChordProfile(chordName)
                : null;
        }

        // ── 6. Niveau global ─────────────────────────────────────────────────────
        const arousalW  = this.arousalWeight ?? 0.5;
        const beatW     = this.beatWeight    ?? 0.5;
        const baseLevel = arousal * arousalW + accentedPulse * beatW;
        this.beatFallbackLevel += (baseLevel - this.beatFallbackLevel) * 0.4;
        //console.log(`arousal : ${arousal} arousalW : ${arousalW} accentedPulse : ${accentedPulse} beatW : ${beatW}`);

        // ── 7. Distribution par barre ────────────────────────────────────────────
        const center      = (this.numBars - 1) / 2;
        const bellStr     = this.bellCurveStrength ?? 4;
        const drift       = this.perBarDrift       ?? 0.8;
        const noise       = this.noiseAmount       ?? 0.25; // réduit vs avant
        const minLevel    = this.minLevel          ?? 0.05;
        const bpmDrift    = 0.001 * bpmFactor;

        // La valence (positivité) décale le centre de gravité du visualisateur
        // valence faible = barres basses concentrées, valence haute = barres étalées
        const spread    = 0.5 + valence * 0.5; // 0.5..1.0
        const adjBellStr = bellStr / spread;   // plus valence est haute, plus c'est étalé

        for (let b = 0; b < this.numBars; b++) {
            // Oscillation lente propre à chaque barre, calée sur le BPM
            this.barPhases[b] += bpmDrift * (0.6 + b * 0.08);
            const driftValue = 1 - drift * 0.5 + drift * 0.5 * Math.sin(this.barPhases[b]);

            // Courbe de cloche avec spread ajusté par la valence
            const dist        = Math.abs(b - center) / center;
            const bellProfile = Math.exp(-dist * dist * adjBellStr);

            // Profil harmonique de l'accord (1.0 si pas d'accord disponible)
            const chordMod = this._lastChordProfile ? this._lastChordProfile[b] : 1.0;

            // Bruit réduit : le hasard reste mais ne domine plus
            const randomNoise = 1 - noise * 0.5 + Math.random() * noise;

            const target = Phaser.Math.Clamp(
                this.beatFallbackLevel
                    * bellProfile
                    * driftValue
                    * chordMod
                    * this._phraseEnvelope
                    * randomNoise
                + minLevel,
                0, 1
            );

            const prev  = this.currentLevels[b];
            const alpha = target > prev ? this.smoothingUp : this.smoothingDown;
            this.currentLevels[b] = prev + (target - prev) * alpha;
            //console.log(`prev : ${prev} target : ${target} alpha : ${alpha}`);
        }
    }

    // ── Rendu ───────────────────────────────────────────────────────────────

    /**
     * À appeler dans update() de GameScene.
     * @param {Player} taPlayer - instance TextAlive (pour le fallback beat)
     */
    update(taPlayer) {
        // Connexion paresseuse : retente si pas encore connecté
        if (!this.connected && !this.corsBlocked) {
            this.tryConnect();
        }

        this._readBeatFallbackLevels(taPlayer);
        this._draw();
    }

    _draw() {
        this.graphics.clear();

        const segH  = Math.max(1, Math.floor((this.maxHeight - this.segmentGap * this.numSegments) / this.numSegments));
        const stepX = this.barWidth + this.barGap;

        for (let b = 0; b < this.numBars; b++) {
            const level      = this.currentLevels[b];
            const activeSegs = Math.round(level * this.numSegments);
            const barX       = this.x + b * stepX;

            // ── Barres principales (du bas vers le haut) ─────────────────────
            for (let s = 0; s < activeSegs; s++) {
                const segY = this.y - (s + 1) * (segH + this.segmentGap);
                this.graphics.fillStyle(this.segmentColors[s], 1);
                this.graphics.fillRect(barX, segY, this.barWidth, segH);
            }

            // ── Reflet en dessous de la ligne de base ─────────────────────────
            const refSegs = Math.min(activeSegs, this.reflectionSegments);
            for (let s = 0; s < refSegs; s++) {
                const segY  = this.y + s * (segH + this.segmentGap) + this.segmentGap;
                const alpha = this.reflectionAlpha * (1 - s / this.reflectionSegments);
                this.graphics.fillStyle(this.segmentColors[s], alpha);
                this.graphics.fillRect(barX, segY, this.barWidth, segH);
            }
        }
    }

    // ── Utilitaires ─────────────────────────────────────────────────────────

    /**
     * Précalcule les couleurs des segments : vert (#00cc00) → jaune → rouge (#cc0000).
     */
    _buildGradient() {
        const stops       = gameSettings.visualizer.gradientStops;
        const redThreshold = gameSettings.visualizer.redThreshold ?? 0.5;

        const colors = [];

        for (let i = 0; i < this.numSegments; i++) {
            // t normalisé : 0 = bas, 1 = haut — mais compressé par redThreshold
            const t = Math.min(1, (i / (this.numSegments - 1)) / redThreshold);

            // Interpolation entre les stops
            const scaledT  = t * (stops.length - 1);
            const stopIdx  = Math.min(Math.floor(scaledT), stops.length - 2);
            const frac     = scaledT - stopIdx;

            const a = stops[stopIdx];
            const b = stops[stopIdx + 1];

            const r = Math.round(a.r + (b.r - a.r) * frac);
            const g = Math.round(a.g + (b.g - a.g) * frac);
            const bv = Math.round(a.b + (b.b - a.b) * frac);

            colors.push((r << 16) | (g << 8) | bv);
        }

        return colors;
    }

    destroy() {
        this.graphics.destroy();
        if (this.audioContext) this.audioContext.close();
    }

    enable(duration = 500) {
        if (this.enabled) return;
        this.segmentColors = this._buildGradient();
        this.enabled = true;
        this.graphics.setAlpha(0);
        this.scene.tweens.add({
            targets: this.graphics,
            alpha: 1,
            duration: duration,
            ease: 'Quad.easeIn'
        });
    }

    disable(duration = 500) {
        if (!this.enabled) return;
        this.enabled = false;
        this.graphics.setAlpha(1);
        this.scene.tweens.add({
            targets: this.graphics,
            alpha: 0,
            duration: duration,
            ease: 'Quad.easeOut'
        });
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

        const vizCfg = gameSettings.visualizer;
        this.visualizer = new MusicVisualizer(this, {
            ...vizCfg,
            // Position : centré horizontalement, ligne de base en bas de l'écran
            x: (this.scale.width - (vizCfg.numBars * (vizCfg.barWidth + vizCfg.barGap))) / 2,
            y: this.scale.height - 20
        });

        this.lyricsDelay = gameSettings.lyrics.lyricsDelay;
    }

    update(time, delta) {
        delta = delta / 1000;
        const w = this.scale.width;
        const h = this.scale.height;

        // Activate/deactivate the music visualizer when it is needed
        this.visualizer.update(taPlayer);
        if (this.pendingChars.length > 0 && taPlayer?.isPlaying){
            const delayBeforeNextChar = this.pendingChars[0].startTime - taPlayer.timer.position + gameSettings.lyrics.fallTimeMs;
            if (!this.visualizer.enabled && this.activeChars.length == 0 && delayBeforeNextChar > gameSettings.visualizer.minDelayTrigger){
                console.log("Enable visualizer");
                this.visualizer.enable(1500);
            }
            else if (this.visualizer.enabled && delayBeforeNextChar < gameSettings.visualizer.minDelayTrigger){
                console.log("Disable visualizer");
                setTimeout(() => {
                    this.visualizer.disable(1000);}, 
                gameSettings.visualizer.minDelayTrigger / 3);
            }
        }
        else{
            this.visualizer.enabled = false;
        }

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

            const effectiveStartTime = nextChar.startTime + this.lyricsDelay;

            if (time >= Math.max(effectiveStartTime - this.fallTime, (this.lastCharStartTime + gameSettings.lyrics.minGapBetweenChars) - this.fallTime)) {
                if (this.waveState.advance(time)) {
                    this.charSpawnYPointer.flipDirection();
                }

                const charObj = this.add.text(startX, this.charSpawnYPointer.y, nextChar.text, {
                    fontFamily: gameSettings.fonts.main,
                    fontSize: gameSettings.lyrics.fontSize,
                    color: gameSettings.colors.textMain
                }).setOrigin(0.5);

                const stripLength = nextChar.endTime - nextChar.startTime - this.charSize;

                this.charGroup.add(charObj);
                this.lastCharStartTime = nextChar.startTime;
                this.activeChars.push(new ActiveChar(this, nextChar, charObj, startX, yPos, stripLength, this.charSize / 5, this.charSpawnYPointer, effectiveStartTime));
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
            if (item.strip.x > 0){
                this.catcher.changeMaxSpeed(gameSettings.catcher.slowedSpeed);
            }

            item.progress += delta / item.stripDuration;

            const remainingWidth = item.maxWidth * (1 - item.progress);
            item.strip.setSize(Math.max(0, remainingWidth), item.strip.height);

            if (item.progress >= 1) {
                item.strip.destroy();
                item.obj.destroy();
                this.dyingStrips.splice(i, 1);
                this.catcher.changeMaxSpeed(gameSettings.catcher.maxSpeed);
                this.spawnCatchParticles();
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
        return (m*dist/(2*k));
    }

    spawnCatchParticles(){
        const minY = this.catcher.y - gameSettings.catcher.height/2;
        const maxY = this.catcher.y + gameSettings.catcher.height/2;
        const mean = (minY + maxY) / 2;

        const valenceArousal = taPlayer.getValenceArousal(taPlayer.timer.position);
        let colors = [];
        if (valenceArousal.a < gameSettings.catchParticles.arousalThresholds[0]){
            colors = gameSettings.catchParticles.boringColors;
        }
        else if (valenceArousal.a < gameSettings.catchParticles.arousalThresholds[1]){
            colors = gameSettings.catchParticles.mildColors;
        }
        else{
            colors = gameSettings.catchParticles.excitingColors;
        }

        let effectSize = 0;
        if (valenceArousal.v < gameSettings.catchParticles.arousalThresholds[0]){
            effectSize = gameSettings.catchParticles.effectSizes[0];
        }
        else if (valenceArousal.v < gameSettings.catchParticles.arousalThresholds[1]){
            effectSize = gameSettings.catchParticles.effectSizes[1];
        }
        else{
            effectSize = gameSettings.catchParticles.effectSizes[2];
        }

        for (let i = gameSettings.catchParticles.quantity - 1; i >= 0; i--){
            let particle = null;

            const spawnX = gameSettings.catcher.xPos + gameSettings.catcher.width/2 + ((Math.random() - 0.3) * 30);
            const spawnY = Math.random() * (maxY - minY) + minY;
            const color = colors[Math.floor(Math.random() * colors.length)];
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

            const lifespanRange = gameSettings.catchParticles.lifespan.max - gameSettings.catchParticles.lifespan.min;
            const lifespan = Math.random() * lifespanRange + gameSettings.catchParticles.lifespan.min;

            const finalX = spawnX + this.calcEndXPos(spawnY, effectSize);

            this.activeCatchParticles.push({ particle, lifespan, finalX, effectSize });
        }
    }

    catchChar(catcher, charObj) {
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

            if (charDuration < gameSettings.minDelayLongChar){
                this.spawnCatchParticles();
            }
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
                this.activeBGChar.setAlpha(this.activeBGChar.alpha - gameSettings.backgroundLyrics.fadeOutSpeed / 100);
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
            const effectSize = item.effectSize;

            if (lifespan <= 0){
                particle.destroy();
                this.activeCatchParticles.splice(i, 1);
            }
            else{
                this.activeCatchParticles[i].lifespan -= 1;

                const speed = this.calcPartSpeed(finalX - particle.x, effectSize);
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

const taPlayer = new Player({ 
    app: { token: gameSettings.api.token }, 
    mediaElement: document.querySelector("#media") ,
    valenceArousalEnabled: true
});
taPlayer.addListener({ 
    onTimerReady() { isTextAliveReady = true; },
    onPlay() { 
        if (game.scene.isActive("GameScene")) {
            game.scene.getScene("GameScene").visualizer?.tryConnect();
        }
    }
});
taPlayer.createFromSongUrl(gameSettings.api.songUrl);
