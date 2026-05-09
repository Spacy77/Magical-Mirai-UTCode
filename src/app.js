/* Main application script extracted from index.html
   - Keeps original logic but separated for easier editing and testing
   - Requires external libraries to be loaded before this file (see index.html)
*/

const gameSettings = {
    api: {
        token: "1O5BTRwWsXT6TfAP",
        songUrl: "https://piapro.jp/t/PNpQ/20251209170719"
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
        fallTimeMs: 2400,
        startXOffset: 100,
        marginY: 100,
        fontSize: "80px",
        destroyOverflowRatio: 0.2,
        minDelayNewYPos: 500,
        minDelayLongChar: 500
    },
    charSpawnYPointer: { maxSpeed: 0.05, jerk: 0.001 }
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

        this.charGroup = this.physics.add.group();
        this.physics.add.overlap(this.catcher, this.charGroup, this.catchChar, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.activeChars = [];
        this.pendingChars = [];
        this.wordYMap = new Map();

        // Initialize spawn pointer: picks a Y within margins and a small random velocity
        this.charSpawnYPointer = Phaser.Math.Between(gameSettings.lyrics.marginY, this.scale.width - gameSettings.lyrics.marginY);
        this.charSpawnYPointerAccelleration = Phaser.Math.Between(- gameSettings.charSpawnYPointer.maxSpeed / 2, gameSettings.charSpawnYPointer.maxSpeed / 2);

        if (taPlayer && taPlayer.video) this.loadLyrics(taPlayer.video.firstChar);

        this.lastSpawnedChar = null;
        this.fontSizeInt = parseInt(gameSettings.lyrics.fontSize);
        this.minDelayNewYPos = gameSettings.lyrics.minDelayNewYPos;
        this.lastSpawnedCharY = this.scale.height / 2;
        this.minDelayLongChar = gameSettings.lyrics.minDelayLongChar;

        // Debug visual for spawn pointer (non-essential)
        this.spawnYPointerDebugRect = this.add.rectangle(this.scene.width - 10, this.charSpawnYPointer, 10, 10, gameSettings.colors.primary);
        // NOTE: enabling physics bodies on this debug rect seems to interfere with collision detection.
        // The original code had a commented-out block; keep that comment here for future debugging.
        /*
        this.physics.add.existing(this.spawnYPointerDebugRect);
        this.spawnYPointerDebugRect.body.setImmovable(true);
        */
    }

    update() {
        const w = this.scale.width;
        const h = this.scale.height;
        this.handleInput(h);
        if (!taPlayer || !taPlayer.isPlaying) return;
        const time = taPlayer.timer.position;
        const startX = w + gameSettings.lyrics.startXOffset;
        this.updateYPointer(h);
        this.spawnPendingChars(time, startX, w, h);
        this.updateActiveChars(time, startX);
    }

    handleInput(sceneHeight) {
        if (this.cursors.up.isDown) this.catcher.y -= gameSettings.catcher.speed;
        if (this.cursors.down.isDown) this.catcher.y += gameSettings.catcher.speed;
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
        this.charSpawnYPointerAccelleration += Phaser.Math.Between(- gameSettings.charSpawnYPointer.jerk, gameSettings.charSpawnYPointer.jerk);
        this.charSpawnYPointerAccelleration = Phaser.Math.Clamp(this.charSpawnYPointerAccelleration, - gameSettings.charSpawnYPointer.maxSpeed, gameSettings.charSpawnYPointer.maxSpeed);

        // Keep debug visual aligned
        this.spawnYPointerDebugRect.y = this.charSpawnYPointer;
    }

    spawnPendingChars(time, startX, sceneWidth, sceneHeight) {
        // Push characters whose start time has arrived from pendingChars -> activeChars
        while (this.pendingChars.length > 0 && this.pendingChars[0].startTime - this.fallTime <= time) {
            const charData = this.pendingChars.shift();

            let deltaTime = this.lastSpawnedChar ? (charData.startTime - this.lastSpawnedChar.startTime) : 9999;
            if (time > charData.startTime + (this.fallTime * this.destroyThreshold)) continue;

            // Decide Y position for this character. If the word already has a Y, reuse it.
            let yPos;
            if (this.wordYMap.has(charData.parent)) {
                yPos = this.wordYMap.get(charData.parent);
            } else if (deltaTime < this.minDelayNewYPos) {
                // Place near the last spawned char to keep words visually grouped
                yPos = Math.random() < 0.5 ? this.lastSpawnedCharY - this.fontSizeInt : this.lastSpawnedCharY + this.fontSizeInt;
                yPos = Phaser.Math.Clamp(yPos, this.fontSizeInt / 2, sceneHeight - this.fontSizeInt / 2);
                this.wordYMap.set(charData.parent, yPos);
            } else {
                // Use the moving pointer as a spawn baseline
                yPos = this.charSpawnYPointer;
                this.wordYMap.set(charData.parent, yPos);
            }

            if (!this.wordYMap.has(charData.parent)) this.lastSpawnedCharY = yPos;

            const txt = this.add.text(0, 0, charData.text, { fontFamily: gameSettings.fonts.main, fontSize: gameSettings.lyrics.fontSize, color: gameSettings.colors.textMain, fontStyle: "bold" }).setOrigin(0.5);

            const duration = charData.endTime - charData.startTime;
            let strip = null;

            // Long-duration characters get a translucent strip graphic that moves with them.
            if (duration > this.minDelayLongChar) {
                txt.updateText();
                strip = this.add.graphics();
                strip.fillStyle(0x0000ff, 0.3);
                strip.fillRect(-txt.width / 2 - 10, -txt.height / 2, txt.width + duration, txt.height);

                // The tween detaches the strip from the container and animates it separately.
                // This section is somewhat fiddly: it moves the strip, then destroys it when done.
                this.tweens.add({
                    targets: strip,
                    alpha: 0,
                    duration: this.fallTime,
                    delay: this.fallTime + duration,
                    onStart: () => {
                        const worldX = container.x;
                        const worldY = container.y;
                        container.remove(strip);
                        strip.setPosition(worldX, worldY);
                        this.add.existing(strip);
                    },
                    onUpdate: () => { strip.x -= 5; },
                    onComplete: () => strip.destroy()
                });
            }

            // Pack text and optional strip into a container so we can move them together and add physics.
            const children = strip ? [strip, txt] : [txt];
            const container = this.add.container(startX, yPos, children);
            this.physics.add.existing(container);
            this.charGroup.add(container);

            this.activeChars.push({ obj: container, startTime: charData.startTime });
            this.lastSpawnedChar = charData;
        }
    }

    updateActiveChars(time, startX) {
        for (let i = this.activeChars.length - 1; i >= 0; i--) {
            const item = this.activeChars[i];
            const progress = (time - (item.startTime - this.fallTime)) / this.fallTime;
            item.obj.x = startX - (startX - this.catcherX) * progress;
            if (progress > 1 + this.destroyThreshold) {
                item.obj.destroy();
                this.activeChars.splice(i, 1);
            }
        }
    }

    catchChar(catcher, charObj) {
        charObj.destroy();
        const idx = this.activeChars.findIndex(l => l.obj === charObj);
        if (idx > -1) this.activeChars.splice(idx, 1);
    }

    loadLyrics(firstChar) {
        this.pendingChars = [];
        this.wordYMap.clear();
        let char = firstChar;
        while (char) {
            if (char.text.trim().length > 0) this.pendingChars.push(char);
            char = char.next;
        }
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
