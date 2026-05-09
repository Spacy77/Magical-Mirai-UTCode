/* Main application script extracted from index.html
   - Keeps original logic but separated for easier editing and testing
   - Requires external libraries to be loaded before this file (see index.html)
*/

const gameSettings = {
    api: {
        token: "1O5BTRwWsXT6TfAP",
        songUrl: "https://piapro.jp/t/hZ35/20240130103028"
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
        fallTimeMs: 3000,
        startXOffset: 100,
        marginY: 100,
        fontSize: "80px",
        destroyOverflowRatio: 0.2,
        minDelayNewYPos: 500,
        minDelayLongChar: 500
    },
    charSpawnYPointer: { maxSpeed: 0.00, jerk: 0.001 }
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
        this.charSpawnYPointerAccelleration += Phaser.Math.FloatBetween(- gameSettings.charSpawnYPointer.jerk, gameSettings.charSpawnYPointer.jerk);
        this.charSpawnYPointerAccelleration = Phaser.Math.Clamp(this.charSpawnYPointerAccelleration, - gameSettings.charSpawnYPointer.maxSpeed, gameSettings.charSpawnYPointer.maxSpeed);
    }

    spawnPendingChars(time, startX, sceneWidth, sceneHeight) {
        // Push characters whose start time has arrived from pendingChars -> activeChars
        while (this.pendingChars.length > 0) {
            const nextChar = this.pendingChars[0];
            if (time >= nextChar.startTime - this.fallTime) {
                const charObj = this.add.text(startX, this.charSpawnYPointer, nextChar.text, {
                    fontFamily: gameSettings.fonts.main,
                    fontSize: gameSettings.lyrics.fontSize,
                    color: gameSettings.colors.textMain
                }).setOrigin(0.5);

                console.log(`Spawning char '${nextChar.text}' at time ${time}ms (scheduled for ${nextChar.startTime}ms), falltime ${this.fallTime}ms, startX ${startX}, spawnY ${this.charSpawnYPointer}`);
                this.charGroup.add(charObj);
                this.activeChars.push({ char: nextChar, obj: charObj });
                this.pendingChars.shift();
            } else {
                break;
            }
        }
    }

    updateActiveChars(time, startX) {
        for (let i = this.activeChars.length - 1; i >= 0; i--) {
            const item = this.activeChars[i];
            const char = item.char;
            const obj = item.obj;
            const progress = (time - (char.startTime - this.fallTime)) / this.fallTime; // 0 = start of fall, 1 = reaches catcher, >1 = past catcher 
            obj.x = startX - (startX - this.catcherX) * progress;
            if (progress > 1 + this.destroyThreshold) {
                obj.destroy();
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
