export const BLOT_FORM = {
  NORMAL: 0,
  PULLER: 1,
  FLYER: 2,
  OTHER: 3
}

export default class Blot {
  constructor (game, group, tileX, tileY) {
    this.game = game
    this.tileX = tileX
    this.tileY = tileY

    this.form = BLOT_FORM.NORMAL
    this.destroyed = false

    this.bitmap = game.add.bitmapData(16, 32)
    this.graphics = game.add.sprite(0, -16, this.bitmap)
    this.graphics.x = 16 * tileX
    this.graphics.y = 16 * tileY - 16

    group.add(this.graphics)

    this.kneeling = false

    this.draw()
  }

  move (xDelta, yDelta, callback) {
    this.tileX += xDelta
    this.tileY += yDelta

    this.kneeling = false

    if (xDelta < 0) {
      this.draw(2)
    } else if (xDelta > 0) {
      this.draw(3)
    } else if (yDelta !== 0) {
      this.draw(4)
    } else if (xDelta === 0 && yDelta === 0) {
      this.kneeling = true
      this.draw(1)
    }

    const tween = this.game.add.tween(this.graphics)
    tween.to({
      x: 16 * this.tileX,
      y: 16 * this.tileY - 16
    }, 200, Phaser.Easing.Sinusoidal.InOut, true)

    tween.onComplete.add(() => {
      if (!this.kneeling) {
        this.draw(0)
        console.log('foo')
      }
      callback()
    })
  }

  destroy () {
    this.destroyed = true

    this.bitmap.clear(0, 28, 16, 4)

    const tween = this.game.add.tween(this.graphics)
    tween.to({
      y: 16 * this.tileY - 13
    }, 200, 'Linear', true)
    tween.onUpdateCallback(() => {
      this.bitmap.update()
      this.bitmap.shiftHSL(false, false, -0.03)
    })
    tween.onComplete.add(() => {
      const tween = this.game.add.tween(this.graphics)
      tween.to({ alpha: 0 }, 200, 'Linear', true)
      tween.onComplete.add(() => {
        console.log('done')
      })
    })
  }

  shapeshift (form) {
    if (this.form !== form) {
      const tween = this.game.add.tween(this.graphics)
      tween.to({
        alpha: 0
      }, 100, 'Linear', true)
      tween.onComplete.add(() => {
        this.form = form
        this.draw()
        const tween = this.game.add.tween(this.graphics)
        tween.to({
          alpha: 1
        }, 100, 'Linear', true)
      })
    }
  }

  draw (frame = 0) {
    const spritesImage = this.game.cache.getImage('sprites')
    this.bitmap.clear()
    this.bitmap.context.drawImage(spritesImage, frame * 16, 32 * this.form, 16, 32, 0, 0, 16, 32)
  }
}
