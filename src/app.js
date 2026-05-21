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
    catcher: { xPos: 120, width: 40, height: 160, speed: 8, marginY: 80 },
    lyrics: {
        fallTimeMs: 1000,
        startXOffset: 100,
        marginY: 100,
        fontSize: "120px",
        destroyOverflowRatio: 0.2,
        minDelayNewYPos: 500,
        minDelayLongChar: 500,
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
        scale: {start: 0.2, end: 2 },
        colors: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff],
        alpha: { min: 0.1, max: 0.6 }
    },
    charSpawnYPointer: { maxSpeed: 0.005, jerk: 0.0005 },
    minDelayLongChar: 400
};

const { Player } = TextAliveApp;
let isTextAliveReady = false;

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
        this.fallTime = gameSettings.lyrics.fallTimeMs;
        this.catcherX = gameSettings.catcher.xPos;
        this.destroyThreshold = gameSettings.lyrics.destroyOverflowRatio;

        this.catcher = this.add.rectangle(this.catcherX, this.scale.height / 2, gameSettings.catcher.width, gameSettings.catcher.height, gameSettings.colors.primary);
        this.physics.add.existing(this.catcher);
        this.catcher.body.setImmovable(true);
        this.catcherCurrentSpeed = gameSettings.catcher.speed;

        this.charGroup = this.physics.add.group();
        this.physics.add.overlap(this.catcher, this.charGroup, this.catchChar, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.activeChars = [];
        this.pendingChars = [];

        this.minDelayLongChar = gameSettings.minDelayLongChar;
        this.dyingStrips = [];
        this.fallDistance = (this.scale.width + gameSettings.lyrics.startXOffset) - this.catcherX;
        this.charSize = parseInt(gameSettings.lyrics.fontSize);

        this.maxDurationBGEffect = gameSettings.backgroundLyrics.maxDurationBGEffect;
        this.activeBGChar = null;
        this.bgCharEndTime = 0;
        this.bgCharColorIndex = 0;

        // Initialize spawn pointer: picks a Y within margins and a small random velocity
        this.charSpawnYPointer = Phaser.Math.Between(gameSettings.lyrics.marginY, this.scale.width - gameSettings.lyrics.marginY);
        this.charSpawnYPointerAccelleration = Phaser.Math.FloatBetween(- gameSettings.charSpawnYPointer.maxSpeed / 2, gameSettings.charSpawnYPointer.maxSpeed / 2);

        if (taPlayer && taPlayer.video) this.loadLyrics(taPlayer.video.firstChar);

        // display song timer for debugging
        this.timeText = this.add.text(10, 10, "", {
            fontFamily: gameSettings.fonts.ui,
            fontSize: "24px",
            color: gameSettings.colors.textMain
        }).setOrigin(0, 0);
        taPlayer.addListener({ onTimerReady: () => { this.timeText.setText("0:00.000"); },
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
        const w = this.scale.width;
        const h = this.scale.height;
        this.handleInput(h);
        if (!taPlayer || !taPlayer.isPlaying) return;
        const songTime = taPlayer.timer.position;
        const startX = w + gameSettings.lyrics.startXOffset;
        this.updateYPointer(h);
        this.spawnPendingChars(songTime, startX, w, h);
        this.updateActiveChars(songTime, startX);
        this.destroyStrips(delta);
        this.updateBGChar();
    }

    handleInput(sceneHeight) {
        if (this.cursors.up.isDown) this.catcher.y -= this.catcherCurrentSpeed;
        if (this.cursors.down.isDown) this.catcher.y += this.catcherCurrentSpeed;
        this.catcher.y = Phaser.Math.Clamp(this.catcher.y, gameSettings.catcher.marginY, sceneHeight - gameSettings.catcher.marginY);
    }

    updateYPointer(sceneHeight) {
        // Move pointer by current acceleration scaled by scene height.
        // Reverse when hitting margins and clamp the value.
        this.charSpawnYPointer += sceneHeight * this.charSpawnYPointerAccelleration;
        if (this.charSpawnYPointer < gameSettings.lyrics.marginY || this.charSpawnYPointer > sceneHeight - gameSettings.lyrics.marginY) {
            this.charSpawnYPointerAccelleration *= -1;
            this.charSpawnYPointer = Phaser.Math.Clamp(this.charSpawnYPointer, gameSettings.lyrics.marginY, sceneHeight - gameSettings.lyrics.marginY);
        }

        // Small random jitter applied to acceleration, then clamp to max speed.
        this.charSpawnYPointerAccelleration += Phaser.Math.FloatBetween(- gameSettings.charSpawnYPointer.jerk, gameSettings.charSpawnYPointer.jerk);
        this.charSpawnYPointerAccelleration = Phaser.Math.Clamp(this.charSpawnYPointerAccelleration, - gameSettings.charSpawnYPointer.maxSpeed, gameSettings.charSpawnYPointer.maxSpeed);
    }

    spawnStrip(startX, yPos, length, height){
        if (length < this.minDelayLongChar){
            return null;
        }

        let strip = null;
                    
        strip = this.add.rectangle(
            startX,
            yPos,
            length,
            height,
            0x000000,
            1
        );

        strip.setOrigin(0, 0.5);
        strip.setDepth(-1);

        return strip;
    }

    spawnPendingChars(time, startX, sceneWidth, sceneHeight) {
        // Push characters whose start time has arrived from pendingChars -> activeChars
        while (this.pendingChars.length > 0) {
            const nextChar = this.pendingChars[0];
            const yPos = this.charSpawnYPointer;
            if (time >= nextChar.startTime - this.fallTime) {
                const charObj = this.add.text(startX, this.charSpawnYPointer, nextChar.text, {
                    fontFamily: gameSettings.fonts.main,
                    fontSize: gameSettings.lyrics.fontSize,
                    color: gameSettings.colors.textMain
                }).setOrigin(0.5);

                console.log(`Spawning char '${nextChar.text}' at time ${time}ms (scheduled for ${nextChar.startTime}ms), falltime ${this.fallTime}ms, startX ${startX}, spawnY ${this.charSpawnYPointer}`);
                const charStripRef = this.spawnStrip(startX + this.charSize/2, yPos, nextChar.endTime - nextChar.startTime - this.charSize, this.charSize/5);
                
                this.charGroup.add(charObj);
                this.activeChars.push({ char: nextChar, obj: charObj, strip: charStripRef });
                this.pendingChars.shift();
            } else {
                break;
            }
        }
    }

    destroyStrips(delta){
        // Lower progressively the size of each strip
        for (let i = this.dyingStrips.length - 1; i >= 0; i--){
            const item = this.dyingStrips[i];

            item.progress += delta / item.stripDuration;

            const remainingWidth = item.maxWidth * (1 - item.progress);
            item.strip.setSize(Math.max(0, remainingWidth), item.strip.height);

            if (item.progress >= 1) {
                item.strip.destroy();
                item.obj.destroy();
                this.dyingStrips.splice(i, 1);
                this.catcherCurrentSpeed = gameSettings.catcher.speed;
            }
        }
    }

    updateActiveChars(time, startX) {
        for (let i = this.activeChars.length - 1; i >= 0; i--) {
            const item = this.activeChars[i];
            const char = item.char;
            const obj = item.obj;
            const strip = item.strip;
            const progress = (time - (char.startTime - this.fallTime)) / this.fallTime; // 0 = start of fall, 1 = reaches catcher, >1 = past catcher 
            obj.x = startX - (startX - this.catcherX) * progress;
            if (strip != null){
                strip.x = startX - (startX - this.catcherX) * progress + this.charSize/2;
            }
            if (progress > 1 + this.destroyThreshold) {
                if (strip == null){
                    obj.destroy();
                }
                else{
                    const stripDuration = (strip.width / this.fallDistance) * this.fallTime;
                    this.dyingStrips.push({ strip: strip, maxWidth: strip.width, progress: 0, obj: obj, stripDuration: stripDuration });
                }
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
            if (char.strip == null){
                charObj.destroy();
            }
            else{
                // Handle the strip if there is one
                const strip = char.strip;
                const stripDuration = (strip.width / this.fallDistance) * this.fallTime;
                this.dyingStrips.push({ strip: strip, maxWidth: strip.width, progress: 0, obj: charObj, stripDuration: stripDuration });
                this.catcherCurrentSpeed = 0.5;
            }

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

            window.navigator.vibrate(charDuration);
        }
    }

    updateBGChar(){
        if (!this.activeBGChar){
            return;
        }

        const animTime = gameSettings.backgroundLyrics.maxDurationBGAnim;
        const position = taPlayer.timer.position;

        if (position >= this.bgCharEndTime){
            if (this.activeBGChar.alpha > 0){
                this.activeBGChar.setAlpha(this.activeBGChar.alpha - 1/this.maxDurationBGEffect);
            }
            else{
                this.activeBGChar.setText(null);
            }
        }
        else if (position <= this.bgCharStartTime + animTime){
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