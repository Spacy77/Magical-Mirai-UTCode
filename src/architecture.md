# Architecture

**Phaser 3** is used for rendering, physics and scenes.

- **Scenes**
  - `BootScene`: loads the game assets.
  - `TitleScene`: displays the main menu, loading screen and settings.
  - `GameScene`: contains the gameplay.
  - `EndScene`: displays the results at the end of the song.

- **Gameplay**
  - `Catcher`: the player-controlled character.
  - `ActiveChar`: represents a lyric character currently on screen.
  - `ComboCounter`: keeps track of the score and accuracy.
  - `WaveState` and `CharSpawnYPointer`: control where new characters appear.

- **Visual effects**
  - `MusicVisualizer`: The music spectrum visualizer is driven directly by TextAlive song-map signals in the browser (fake it until you make it as they say)
  - `FLTimelineBackground`: scrolling background inspired by FL Studio.
  - `BackgroundChar`: displays large background characters and heart effects.
  - Particle effects and character animations.

- **Configuration**
  - Most values (colors, timings, speeds, fonts, effects, etc.) are stored in the `gameSettings` object, making the game easy to tweak without changing the code.