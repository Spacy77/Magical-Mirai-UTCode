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
    catcher: { xPos: 120, width: 40, height: 300, speed: 1, marginY: 80 }, // speed is in screen ratio
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
    charSpawnYPointer: { speed: 1},
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
        this.fallTimeMultiplier = gameSettings.lyrics.fallTimeMsMultiplier; // this is the only way to change fall time (this will sync other speeds)
        this.fallTime = gameSettings.lyrics.fallTimeMs * this.fallTimeMultiplier;
        this.catcherX = gameSettings.catcher.xPos;
        this.destroyThreshold = gameSettings.lyrics.destroyOverflowRatio;

        this.catcher = this.add.rectangle(this.catcherX, this.scale.height / 2, gameSettings.catcher.width, gameSettings.catcher.height, gameSettings.colors.primary);
        this.catcherDir = 1;
        this.physics.add.existing(this.catcher);
        this.catcher.body.setImmovable(true);
        this.catcherCurrentSpeed = gameSettings.catcher.speed;

        this.charGroup = this.physics.add.group();
        this.physics.add.overlap(this.catcher, this.charGroup, this.catchChar, null, this);

        this.cursors = this.input.keyboard.on('keydown-SPACE', () => {
            this.catcherDir *= -1;
        }, this);
        this.activeChars = [];
        this.pendingChars = [];

        this.minDelayLongChar = gameSettings.minDelayLongChar;
        this.dyingStrips = [];
        this.fallDistance = (this.scale.width + gameSettings.lyrics.startXOffset) - this.catcherX;
        this.charSize = parseInt(gameSettings.lyrics.fontSize);

        // Initialize spawn pointer: picks a Y within margins and a small random velocity
        this.charSpawnYPointer = Phaser.Math.Between(gameSettings.lyrics.marginY, this.scale.width - gameSettings.lyrics.marginY);
        this.charSpawnYPointerSpeed = gameSettings.charSpawnYPointer.speed;

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

    update(time, delta) {
        delta = delta / 1000; // convert to seconds
        const w = this.scale.width;
        const h = this.scale.height;
        this.updateCatcher(h, delta);
        if (!taPlayer || !taPlayer.isPlaying) return;
        const songTime = taPlayer.timer.position;
        const startX = w + gameSettings.lyrics.startXOffset;
        this.updateYPointer(h, delta);
        this.spawnPendingChars(songTime, startX, w, h);
        this.updateActiveChars(songTime, startX);
        this.destroyStrips(delta);
    }

    updateCatcher(sceneHeight, delta) {
        
        this.catcherCurrentSpeed = sceneHeight * gameSettings.catcher.speed * this.fallTimeMultiplier * delta;
        this.catcher.y += this.catcherDir * this.catcherCurrentSpeed;
        this.catcher.y = Phaser.Math.Clamp(this.catcher.y, gameSettings.catcher.marginY, sceneHeight - gameSettings.catcher.marginY);
    }

    updateYPointer(sceneHeight, delta) {
        this.charSpawnYPointer += sceneHeight * this.charSpawnYPointerSpeed * this.fallTimeMultiplier * delta;
        if (this.charSpawnYPointer < gameSettings.lyrics.marginY || this.charSpawnYPointer > sceneHeight - gameSettings.lyrics.marginY) {
            this.charSpawnYPointerSpeed *= -1;
            this.charSpawnYPointer = Phaser.Math.Clamp(this.charSpawnYPointer, gameSettings.lyrics.marginY, sceneHeight - gameSettings.lyrics.marginY);
        }
    }

    spawnStrip(startX, yPos, length, height){
        if (length < this.minDelayLongChar){
            return null;
        }

        let strip = null;
                    
        strip = this.add.rectangle(
            startX,
            yPos,
            length * 0.7,
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

                this.charSpawnYPointerSpeed *= -1; // change direction of spawn pointer to create better movement

                const charObj = this.add.text(startX, this.charSpawnYPointer, nextChar.text, {
                    fontFamily: gameSettings.fonts.main,
                    fontSize: gameSettings.lyrics.fontSize,
                    color: gameSettings.colors.textMain
                }).setOrigin(0.5);

                console.log(`Spawning char '${nextChar.text}' at time ${time}ms (scheduled for ${nextChar.startTime}ms), falltime ${this.fallTime}ms, startX ${startX}, spawnY ${this.charSpawnYPointer}`);
                const charStripRef = this.spawnStrip(startX + this.charSize/2, yPos, nextChar.endTime - nextChar.startTime - this.charSize * 1.5, this.charSize/5);
                
                this.charGroup.add(charObj);
                this.activeChars.push({ char: nextChar, obj: charObj, strip: charStripRef });
                this.pendingChars.shift();
            } else {
                break;
            }
        }
    }

    destroyStrips(delta){
        delta = delta * 1000; // convert to ms
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
        const idx = this.activeChars.findIndex(l => l.obj === charObj);
        if (idx > -1) {
            const char = this.activeChars[idx];
            this.activeChars.splice(idx, 1);
            if (char.strip == null){
                charObj.destroy();
            }
            else{
                const strip = char.strip;
                const stripDuration = (strip.width / this.fallDistance) * this.fallTime;
                this.dyingStrips.push({ strip: strip, maxWidth: strip.width, progress: 0, obj: charObj, stripDuration: stripDuration });
                this.catcherCurrentSpeed = 0.5;
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