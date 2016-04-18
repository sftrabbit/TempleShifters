import fs from 'fs'

import Blot, { BLOT_FORM } from './blot'
import Boulder from './boulder'

export default class LevelState {
  constructor (tilemapData, nextState) {
    this.tilemapData = tilemapData
    this.nextState = nextState
  }

  preload () {
    this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE
    this.scale.setUserScale(2, 2)
    this.game.renderer.renderSession.roundPixels = true
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)

    this.load.tilemap('tilemap', null, this.tilemapData, Phaser.Tilemap.TILED_JSON)

    const tilesetImageData = fs.readFileSync('./tileset.png', 'base64')
    this.createImage(this.game, 'tileset', tilesetImageData)

    const spritesImageData = fs.readFileSync('./sprites.png', 'base64')
    this.createImage(this.game, 'sprites', spritesImageData)
  }

  create () {
    const tilemap = this.add.tilemap('tilemap')
    tilemap.addTilesetImage('tilemap', 'tileset')

    this.currentTileMap = tilemap

    this.updateGameSize(window.innerWidth, window.innerHeight)
    this.updateCamera()

    this.layers = {
      environment: tilemap.createLayer('Environment'),
      bottomDecoration: tilemap.createLayer('Bottom Decoration'),
      triggers: tilemap.createLayer('Triggers'),
      objects: tilemap.layers[tilemap.getLayer('Objects')],
      topDecoration: tilemap.createLayer('Top Decoration')
    }
    this.layers.environment.resizeWorld()

    this.objectsGroup = this.add.group()

    this.initObjects()
    this.initTriggers()

    this.moveQueue = []
    this.waiting = false
    this.dirtyState = true

    const keyUp = this.input.keyboard.addKey(Phaser.Keyboard.UP)
    keyUp.onDown.add(() => { this.queueMove(0, -1) })
    const keyDown = this.input.keyboard.addKey(Phaser.Keyboard.DOWN)
    keyDown.onDown.add(() => { this.queueMove(0, 1) })
    const keyLeft = this.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    keyLeft.onDown.add(() => { this.queueMove(-1, 0) })
    const keyRight = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    keyRight.onDown.add(() => { this.queueMove(1, 0) })
    const keyR = this.input.keyboard.addKey(Phaser.Keyboard.R)
    keyR.onDown.add(() => { this.initObjects() })
  }

  update () {
    this.objectsGroup.sort('y', Phaser.Group.SORT_ASCENDING)

    if (this.dirtyState) {
      this.dirtyState = false
      if (this.checkState()) {
        console.log('goal')
        this.state.start(this.nextState)
      }
    }

    if (!this.waiting && this.moveQueue.length > 0) {
      this.waiting = true
      const move = this.moveQueue.shift()
      this.move(move.xDelta, move.yDelta)
    }

    for (var i = this.objects.length - 1; i > -1; i--) {
      if (this.objects[i].destroyed) {
        this.objects.splice(i, 1)
      }
    }
  }

  queueMove (xDelta, yDelta) {
    this.moveQueue.push({
      xDelta,
      yDelta
    })
  }

  updateCamera () {
    this.camera.bounds = null
    this.camera.x = (this.currentTileMap.widthInPixels - this.game.width) / 2
    this.camera.y = (this.currentTileMap.heightInPixels - this.game.height) / 2
  }

  updateGameSize (width, height) {
    // this.game.width = Math.floor(width / 2)
    // this.game.height = Math.floor(height / 2)
    // if (this.game.renderType === Phaser.WEBGL) {
    //   this.game.renderer.resize(this.game.width, this.game.height)
    // }
  }

  initObjects () {
    this.objects = []
    this.objectsGroup.removeAll()
    this.blotCount = 0

    for (var i = 0; i < this.layers.objects.width; i++) {
      for (var j = 0; j < this.layers.objects.height; j++) {
        const data = this.layers.objects.data[j][i]

        if (data.properties.type === 'blot') {
          this.blotCount += 1
          this.objects.push(new Blot(this.game, this.objectsGroup, i, j))
        } else if (data.properties.type === 'boulder') {
          this.objects.push(new Boulder(this.game, this.objectsGroup, i, j))
        }
      }
    }
  }

  initTriggers () {
    this.targetGoals = 0

    const teleports = []
    for (var i = 0; i < this.layers.triggers.layer.width; i++) {
      for (var j = 0; j < this.layers.triggers.layer.height; j++) {
        const tile = this.getTile(this.layers.triggers, i, j)
        if (tile.properties.type === 'teleport') {
          tile.properties.teleportId = teleports.length
          teleports.push(tile)
        } else if (tile.properties.type === 'goal') {
          this.targetGoals += 1
        }
      }
    }

    if (teleports.length === 2) {
      this.game.teleports = [
        {
          xDelta: teleports[1].x - teleports[0].x,
          yDelta: teleports[1].y - teleports[0].y
        }, {
          xDelta: teleports[0].x - teleports[1].x,
          yDelta: teleports[0].y - teleports[1].y
        }
      ]
    }
  }

  getTileProperties (layer, tileX, tileY) {
    return layer.layer.data[tileY][tileX].properties
  }

  getTile (layer, tileX, tileY) {
    return layer.layer.data[tileY][tileX]
  }

  move (xDelta, yDelta) {
    const objectGrid = []
    for (let i = 0; i < this.layers.environment.layer.width; i++) {
      objectGrid.push([])
      for (let j = 0; j < this.layers.environment.layer.height; j++) {
        objectGrid[i].push(null)
      }
    }

    for (const blot of this.objects) {
      objectGrid[blot.tileX][blot.tileY] = {
        object: blot,
        motion: { xDelta: 0, yDelta: 0 },
        checked: false
      }
    }

    for (let i = 0; i < objectGrid.length; i++) {
      for (let j = 0; j < objectGrid[i].length; j++) {
        if (objectGrid[i][j]) {
          if (objectGrid[i][j].object.constructor.name === 'Blot') {
            this.computeMotion(objectGrid, i, j, xDelta, yDelta)
          }
        }
      }
    }

    if (this.canMove(objectGrid)) {
      let countMoving = 0

      for (let i = 0; i < objectGrid.length; i++) {
        for (let j = 0; j < objectGrid[i].length; j++) {
          if (objectGrid[i][j]) {
            const object = objectGrid[i][j].object
            countMoving += 1
            object.move(objectGrid[i][j].motion.xDelta, objectGrid[i][j].motion.yDelta, () => {
              countMoving -= 1
              if (countMoving === 0) {
                this.waiting = false
                this.dirtyState = true
              }
            })
          }
        }
      }
    } else {
      this.waiting = false
      this.dirtyState = false
    }
  }

  computeMotion (objectGrid, i, j, xDelta, yDelta) {
    const originalXDelta = xDelta
    const originalYDelta = yDelta

    const tile = objectGrid[i][j]

    if (!tile.checked) {
      let forwardTileX = tile.object.tileX + xDelta
      let forwardTileY = tile.object.tileY + yDelta

      // Teleport logic (changes xDelta/yDelta)
      if (tile.object.constructor.name === 'Blot' &&
          tile.object.form === BLOT_FORM.OTHER) {
        const triggerProperties = this.getTileProperties(
          this.layers.triggers, forwardTileX, forwardTileY
        )
        if (triggerProperties.type === 'teleport') {
          const teleportId = triggerProperties.teleportId
          xDelta += xDelta + this.game.teleports[teleportId].xDelta
          yDelta += yDelta + this.game.teleports[teleportId].yDelta
          forwardTileX = tile.object.tileX + xDelta
          forwardTileY = tile.object.tileY + yDelta
        }
      }

      const forwardTile = objectGrid[forwardTileX][forwardTileY]

      if (forwardTile) {
        // if (tile.object.constructor.name === 'Blot') {
          const neighbourMotion = this.computeMotion(objectGrid, forwardTileX, forwardTileY, originalXDelta, originalYDelta)
          if (neighbourMotion.xDelta !== 0 || neighbourMotion.yDelta !== 0) {
            tile.motion = { xDelta, yDelta }
          }
        // }
        tile.checked = true
      } else {
        const triggerTile = this.getTile(this.layers.triggers, forwardTileX, forwardTileY)
        if (tile.object.constructor.name === 'Blot' && triggerTile.properties.type === 'altar') {
          tile.motion = { xDelta: 0, yDelta: 0 }
          tile.checked = true
        } else {
          tile.motion = { xDelta, yDelta }
          tile.checked = true
        }
      }

      // Boulder pulling logic
      if (tile.object.constructor.name === 'Blot' &&
          tile.object.form === BLOT_FORM.PULLER) {
        const behindTileX = tile.object.tileX - xDelta
        const behindTileY = tile.object.tileY - yDelta
        const behindTile = objectGrid[behindTileX][behindTileY]

        if (behindTile && behindTile.object.constructor.name === 'Boulder') {
          behindTile.motion = tile.motion
          behindTile.checked = true
        }
      }
    }

    return tile.motion
  }

  canMove (objectGrid) {
    for (let i = 0; i < objectGrid.length; i++) {
      for (let j = 0; j < objectGrid[i].length; j++) {
        if (objectGrid[i][j]) {
          const object = objectGrid[i][j].object
          const motion = objectGrid[i][j].motion

          const forwardTile = objectGrid[object.tileX + motion.xDelta][object.tileY + motion.yDelta]

          if (object.constructor.name === 'Blot' &&
              object.form !== BLOT_FORM.NORMAL &&
              forwardTile && forwardTile.object.constructor.name === 'Boulder') {
            return false
          }

          const nextTileProperties = this.getTileProperties(
            this.layers.environment,
            object.tileX + motion.xDelta,
            object.tileY + motion.yDelta
          )

          if (nextTileProperties.type === 'solid') {
            if (object.constructor.name === 'Blot') {
              const trigger = this.getTile(this.layers.triggers, object.tileX + motion.xDelta, object.tileY + motion.yDelta)

              if (trigger.properties.type !== 'blocker') {
                return false
              }
            } else {
              return false
            }
          }
        }
      }
    }

    return true
  }

  checkState () {
    let goals = 0

    for (const object of this.objects) {
      const tileProperties = this.getTileProperties(
        this.layers.triggers, object.tileX, object.tileY
      )

      if (object.constructor.name === 'Blot') {
        if (tileProperties.type === 'pit') {
          if (object.form !== BLOT_FORM.FLYER) {
            object.destroy()
            this.blotCount -= 1
          }
        } else if (tileProperties.type === 'shifter') {
          object.shapeshift(tileProperties.form)
        } else if (tileProperties.type === 'goal') {
          if (object.form === tileProperties.form) {
            goals += 1
          }
        }
      }
    }

    return goals === this.blotCount && goals === this.targetGoals
  }

  createImage (game, key, imageData) {
    const base64image = `data:image/jpeg;base64,${imageData}`
    const image = new Image()
    image.src = base64image
    game.cache.addImage(key, base64image, image)
  }
}
