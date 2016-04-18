export default class Boulder {
  constructor (game, group, tileX, tileY) {
    this.game = game
    this.tileX = tileX
    this.tileY = tileY

    const spritesImage = game.cache.getImage('sprites')

    const bitmap = game.add.bitmapData(16, 32)
    bitmap.context.drawImage(spritesImage, 80, 0, 16, 32, 0, 0, 16, 32)

    this.graphics = game.add.sprite(16 * tileX, 16 * tileY - 16, bitmap)
    group.add(this.graphics)
  }

  move (xDelta, yDelta, callback) {
    this.tileX += xDelta
    this.tileY += yDelta

    const tween = this.game.add.tween(this.graphics)
    tween.to({
      x: 16 * this.tileX,
      y: 16 * this.tileY - 16
    }, 200, Phaser.Easing.Sinusoidal.InOut, true)

    tween.onComplete.add(callback)
  }
}
