/* Main application script extracted from index.html
   - Keeps original logic but separated for easier editing and testing
   - Requires external libraries to be loaded before this file (see index.html)
*/

const gameSettings = {
    api: {
        token: "1O5BTRwWsXT6TfAP",
        songUrl: "https://piapro.jp/t/B3yJ/20251215061727"
    },
    colors: {
        primary: 0x0000ff,
        primaryHover: 0x0000aa,
        textMain: "#000000",
        textLight: "#ffffff",
        textPrimary: "#0000ff"
    },
    fonts: {
        main: '"Noto Sans JP", sans-serif',
        ui: 'sans-serif'
    },
    spinner: { radius: 50, thickness: 8, rotationSpeed: 0.1 },
    button: { width: 250, height: 80, fontSize: "40px" },
    catcher: { xPos: 120, width: 40, height: 300, maxSpeed: 1, responsiveness: 5.0, marginY: 80 }, // speed is in screen ratio, every thing needs to be used with Delta in SECONDS
    lyrics: {
        fallTimeMs: 1000,
        fallTimeMsMultiplier: 1,
        startXOffset: 100,
        marginY: 100,
        fontSize: "120px",
        destroyOverflowRatio: 0.2,
        minDelayNewYPos: 500,
        minDelayLongChar: 500
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
    charSpawnYPointer: { speed: 1 }, // in screen ratio

    minDelayLongChar: 400,

    spawnGlowDuration: 50,

    wave: {
        beatDuration: 500,
        nextFlipTime: 0,
        currentTravelBeats: 0,
        patterns: [0.75, 1, 1, 0.5, 0.5, 1, 2, 2]
    }
};

const { Player } = TextAliveApp;
let isTextAliveReady = false;

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
        this.glowObj = glowOnSpawn ? this.createGlowObject() : null;
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
            0x000000,
            1
        );

        strip.setOrigin(0, 0.5);
        strip.setDepth(-1);
        return strip;
    }

    createGlowObject() {
        const glowObj = this.scene.add.text(this.obj.x, this.obj.y, this.char.text, {
            fontFamily: gameSettings.fonts.main,
            fontSize: gameSettings.lyrics.fontSize,
            color: "#ffffff"
        }).setOrigin(0.5);

        glowObj.setAlpha(0.45);
        glowObj.setBlendMode(Phaser.BlendModes.ADD);
        glowObj.setDepth(this.obj.depth - 1);
        return glowObj;
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
        if (this.glowObj == null) {
            return;
        }

        this.glowObj.x = this.obj.x;
        this.glowObj.y = this.obj.y;

        if (this.glowRemaining > 0) {
            this.glowRemaining = Math.max(0, this.glowRemaining - delta);
            const glowStrength = this.glowRemaining / this.glowDuration;
            this.glowObj.setAlpha(0.18 + (0.45 * glowStrength));
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
        if (this.glowObj != null) {
            this.glowObj.destroy();
            this.glowObj = null;
        }
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
        this.fallTimeMultiplier = gameSettings.lyrics.fallTimeMsMultiplier; // this is the only way to change fall time (this will sync other speeds)
        this.fallTime = gameSettings.lyrics.fallTimeMs * this.fallTimeMultiplier;
        this.destroyThreshold = gameSettings.lyrics.destroyOverflowRatio;

        this.catcher = new Catcher(this, this.scale.height / 2);
        this.waveState = new WaveState();

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

        this.maxDurationBGEffect = gameSettings.backgroundLyrics.maxDurationBGEffect;
        this.activeBGChar = null;
        this.bgCharEndTime = 0;
        this.bgCharColorIndex = 0;

        // Initialize spawn pointer: picks a Y within margins and a small random velocity
        this.charSpawnYPointer = new CharSpawnYPointer(
            this.scale.height / 2
        );

        // debug graphics to visualize spawn pointer
        this.spawnPointerGraphics = this.add.graphics();
        this.spawnPointerGraphics.fillStyle(0xff0000, 1);
        this.spawnPointerGraphics.fillCircle(0, 0, 10);
        this.spawnPointerGraphics.setDepth(1);
        this.spawnPointerGraphics.x = this.scale.width - 50;
        this.spawnPointerGraphics.y = this.charSpawnYPointer.y;


        if (taPlayer && taPlayer.video) this.loadLyrics(taPlayer.video.firstChar);

        // display song timer for debugging
        this.timeText = this.add.text(10, 10, "", {
            fontFamily: gameSettings.fonts.ui,
            fontSize: "24px",
            color: gameSettings.colors.textMain
        }).setOrigin(0, 0);
        taPlayer.addListener({
            onTimerReady: () => { this.timeText.setText("0:00.000"); },
            onTimeUpdate: () => {
                this.timeText.setText(taPlayer.timer.position.toString());
            }
        });

        // Create the background char that gets updated when you catch one
        this.activeBGChar = this.add.text(this.scale.width / 2, this.scale.height / 2, "", {
            fontFamily: gameSettings.fonts.main,
            fontSize: gameSettings.backgroundLyrics.fontSize,
            color: gameSettings.backgroundLyrics.colors[this.bgCharColorIndex]
        }).setOrigin(0.5).setAlpha(0).setDepth(-1);

        // Create particle effect for when you catch a char
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
    }

    update(time, delta) {
        delta = delta / 1000; // convert to seconds
        const w = this.scale.width;
        const h = this.scale.height;
        
        if (!taPlayer || !taPlayer.isPlaying) return;
        const songTime = taPlayer.timer.position;
        const startX = w + gameSettings.lyrics.startXOffset;

        this.catcher.update(delta, h);
        // update debug spawn pointer
        this.spawnPointerGraphics.y = this.charSpawnYPointer.y;
        this.charSpawnYPointer.update(delta, h);
        this.spawnPendingChars(songTime, startX, w, h);
        this.updateActiveChars(songTime, startX, delta);
        this.destroyStrips(delta);
        this.updateBGChar();
    }

    spawnPendingChars(time, startX, sceneWidth, sceneHeight) {
        // Push characters whose start time has arrived from pendingChars -> activeChars
        while (this.pendingChars.length > 0) {
            const nextChar = this.pendingChars[0];
            const yPos = this.charSpawnYPointer.y;
            let glowOnSpawn = false;

            if (time >= nextChar.startTime - this.fallTime) {

                // Reverse direction every time the wave state changes
                if (this.waveState.advance(time)) {
                    this.charSpawnYPointer.flipDirection();
                    glowOnSpawn = true;
                }

                const charObj = this.add.text(startX, this.charSpawnYPointer.y, nextChar.text, {
                    fontFamily: gameSettings.fonts.main,
                    fontSize: gameSettings.lyrics.fontSize,
                    color: gameSettings.colors.textMain
                }).setOrigin(0.5);

                console.log(`Spawning char '${nextChar.text}' at time ${time}ms (scheduled for ${nextChar.startTime}ms), falltime ${this.fallTime}ms, startX ${startX}, spawnY ${this.charSpawnYPointer.y}`);
                const stripLength = nextChar.endTime - nextChar.startTime - this.charSize;

                this.charGroup.add(charObj);
                this.activeChars.push(new ActiveChar(this, nextChar, charObj, startX, yPos, stripLength, this.charSize / 5, glowOnSpawn, gameSettings.spawnGlowDuration));
                this.pendingChars.shift();
            } else {
                break;
            }
        }
    }

    destroyStrips(delta) {
        delta = delta * 1000; // convert to ms
        // Lower progressively the size of each strip
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

            // Update background character text
            const charDuration = char.char.endTime - char.char.startTime;
            this.bgCharStartTime = taPlayer.timer.position;
            this.bgCharEndTime = taPlayer.timer.position + charDuration;

            this.activeBGChar.setText(charObj.text);
            this.activeBGChar.setAlpha(gameSettings.backgroundLyrics.startAlpha);

            this.bgCharColorIndex = (this.bgCharColorIndex + 1) % gameSettings.backgroundLyrics.colors.length;
            const color = gameSettings.backgroundLyrics.colors[Math.floor(Math.random() * gameSettings.backgroundLyrics.colors.length)];
            this.activeBGChar.setColor(color);
            this.activeBGChar.setFontSize(gameSettings.backgroundLyrics.fontSize);

            //window.navigator.vibrate(charDuration); TODO : fix
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

        // sort pending chars by start time just in case
        this.pendingChars.sort((a, b) => a.startTime - b.startTime);
    }
}

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