import LevelState from './levelState'

export default class BootState {
  preload () {
    this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE
    this.scale.setUserScale(2, 2)
    this.game.renderer.renderSession.roundPixels = true
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)

    this.game.load.audio('music', ['music.mp3'])
  }

  create () {
    const music = this.game.add.audio('music')
    music.loop = true
    music.play()

    const levelData = [
      require('./levels/level1'),
      require('./levels/level2'),
      require('./levels/level3'),
      require('./levels/level4'),
      require('./levels/level5'),
      require('./levels/level6'),
      require('./levels/level7'),
      require('./levels/level8'),
      require('./levels/level9'),
      require('./levels/level10'),
      require('./levels/level11'),
      require('./levels/level12'),
      require('./levels/level13'),
      require('./levels/level14'),
      require('./levels/level15'),
      require('./levels/level16'),
      require('./levels/level17'),
      require('./levels/level18'),
      require('./levels/level19')
    ]
    for (var i = 0; i < levelData.length; i++) {
      this.state.add(`level${i + 1}`, new LevelState(levelData[i], `level${i + 2}`))
    }
    this.state.start('level1')
  }
}
