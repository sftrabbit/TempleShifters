(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var BLOT_FORM = exports.BLOT_FORM = {
  NORMAL: 0,
  PULLER: 1,
  FLYER: 2,
  OTHER: 3
};

var Blot = function () {
  function Blot(game, group, tileX, tileY) {
    _classCallCheck(this, Blot);

    this.game = game;
    this.tileX = tileX;
    this.tileY = tileY;

    this.form = BLOT_FORM.NORMAL;
    this.destroyed = false;

    this.bitmap = game.add.bitmapData(16, 32);
    this.graphics = game.add.sprite(0, -16, this.bitmap);
    this.graphics.x = 16 * tileX;
    this.graphics.y = 16 * tileY - 16;

    group.add(this.graphics);

    this.kneeling = false;

    this.draw();
  }

  _createClass(Blot, [{
    key: 'move',
    value: function move(xDelta, yDelta, callback) {
      var _this = this;

      this.tileX += xDelta;
      this.tileY += yDelta;

      this.kneeling = false;

      if (xDelta < 0) {
        this.draw(2);
      } else if (xDelta > 0) {
        this.draw(3);
      } else if (yDelta !== 0) {
        this.draw(4);
      } else if (xDelta === 0 && yDelta === 0) {
        this.kneeling = true;
        this.draw(1);
      }

      var tween = this.game.add.tween(this.graphics);
      tween.to({
        x: 16 * this.tileX,
        y: 16 * this.tileY - 16
      }, 200, Phaser.Easing.Sinusoidal.InOut, true);

      tween.onComplete.add(function () {
        if (!_this.kneeling) {
          _this.draw(0);
        }
        callback();
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this2 = this;

      this.destroyed = true;

      this.bitmap.clear(0, 28, 16, 4);

      var tween = this.game.add.tween(this.graphics);
      tween.to({
        y: 16 * this.tileY - 13
      }, 200, 'Linear', true);
      tween.onUpdateCallback(function () {
        _this2.bitmap.update();
        _this2.bitmap.shiftHSL(false, false, -0.03);
      });
      tween.onComplete.add(function () {
        var tween = _this2.game.add.tween(_this2.graphics);
        tween.to({ alpha: 0 }, 200, 'Linear', true);
        tween.onComplete.add(function () {
          console.log('done');
        });
      });
    }
  }, {
    key: 'shapeshift',
    value: function shapeshift(form) {
      var _this3 = this;

      if (this.form !== form) {
        var tween = this.game.add.tween(this.graphics);
        tween.to({
          alpha: 0
        }, 100, 'Linear', true);
        tween.onComplete.add(function () {
          _this3.form = form;
          _this3.draw();
          var tween = _this3.game.add.tween(_this3.graphics);
          tween.to({
            alpha: 1
          }, 100, 'Linear', true);
        });
      }
    }
  }, {
    key: 'draw',
    value: function draw() {
      var frame = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      var spritesImage = this.game.cache.getImage('sprites');
      this.bitmap.clear();
      this.bitmap.context.drawImage(spritesImage, frame * 16, 32 * this.form, 16, 32, 0, 0, 16, 32);
    }
  }]);

  return Blot;
}();

exports.default = Blot;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _levelState = require('./levelState');

var _levelState2 = _interopRequireDefault(_levelState);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var BootState = function () {
  function BootState() {
    _classCallCheck(this, BootState);
  }

  _createClass(BootState, [{
    key: 'preload',
    value: function preload() {
      this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
      this.scale.setUserScale(2, 2);
      this.game.renderer.renderSession.roundPixels = true;
      Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

      this.game.load.audio('music', ['music.mp3']);
    }
  }, {
    key: 'create',
    value: function create() {
      var music = this.game.add.audio('music');
      music.loop = true;
      music.play();

      var levelData = [require('./levels/level1'), require('./levels/level2'), require('./levels/level3'), require('./levels/level4'), require('./levels/level5'), require('./levels/level6'), require('./levels/level7'), require('./levels/level8'), require('./levels/level9'), require('./levels/level10'), require('./levels/level11'), require('./levels/level12'), require('./levels/level13'), require('./levels/level14'), require('./levels/level15'), require('./levels/level16'), require('./levels/level17'), require('./levels/level18'), require('./levels/level19')];
      for (var i = 0; i < levelData.length; i++) {
        this.state.add('level' + (i + 1), new _levelState2.default(levelData[i], 'level' + (i + 2)));
      }
      this.state.start('level1');
    }
  }]);

  return BootState;
}();

exports.default = BootState;

},{"./levelState":5,"./levels/level1":6,"./levels/level10":7,"./levels/level11":8,"./levels/level12":9,"./levels/level13":10,"./levels/level14":11,"./levels/level15":12,"./levels/level16":13,"./levels/level17":14,"./levels/level18":15,"./levels/level19":16,"./levels/level2":17,"./levels/level3":18,"./levels/level4":19,"./levels/level5":20,"./levels/level6":21,"./levels/level7":22,"./levels/level8":23,"./levels/level9":24}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Boulder = function () {
  function Boulder(game, group, tileX, tileY) {
    _classCallCheck(this, Boulder);

    this.game = game;
    this.tileX = tileX;
    this.tileY = tileY;

    var spritesImage = game.cache.getImage('sprites');

    var bitmap = game.add.bitmapData(16, 32);
    bitmap.context.drawImage(spritesImage, 80, 0, 16, 32, 0, 0, 16, 32);

    this.graphics = game.add.sprite(16 * tileX, 16 * tileY - 16, bitmap);
    group.add(this.graphics);
  }

  _createClass(Boulder, [{
    key: 'move',
    value: function move(xDelta, yDelta, callback) {
      this.tileX += xDelta;
      this.tileY += yDelta;

      var tween = this.game.add.tween(this.graphics);
      tween.to({
        x: 16 * this.tileX,
        y: 16 * this.tileY - 16
      }, 200, Phaser.Easing.Sinusoidal.InOut, true);

      tween.onComplete.add(callback);
    }
  }]);

  return Boulder;
}();

exports.default = Boulder;

},{}],4:[function(require,module,exports){
'use strict';

var _bootState = require('./bootState');

var _bootState2 = _interopRequireDefault(_bootState);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var game = new window.Phaser.Game(300, 220, Phaser.AUTO, 'game'); // eslint-disable-line no-new

game.state.add('boot', new _bootState2.default());
game.state.start('boot');

},{"./bootState":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _blot = require('./blot');

var _blot2 = _interopRequireDefault(_blot);

var _boulder = require('./boulder');

var _boulder2 = _interopRequireDefault(_boulder);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var LevelState = function () {
  function LevelState(tilemapData, nextState) {
    _classCallCheck(this, LevelState);

    this.tilemapData = tilemapData;
    this.nextState = nextState;
  }

  _createClass(LevelState, [{
    key: 'preload',
    value: function preload() {
      this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
      this.scale.setUserScale(2, 2);
      this.game.renderer.renderSession.roundPixels = true;
      Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

      this.load.tilemap('tilemap', null, this.tilemapData, Phaser.Tilemap.TILED_JSON);

      var tilesetImageData = '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';
      this.createImage(this.game, 'tileset', tilesetImageData);

      var spritesImageData = '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';
      this.createImage(this.game, 'sprites', spritesImageData);
    }
  }, {
    key: 'create',
    value: function create() {
      var _this = this;

      var tilemap = this.add.tilemap('tilemap');
      tilemap.addTilesetImage('tilemap', 'tileset');

      this.currentTileMap = tilemap;

      this.updateGameSize(window.innerWidth, window.innerHeight);
      this.updateCamera();

      this.layers = {
        environment: tilemap.createLayer('Environment'),
        bottomDecoration: tilemap.createLayer('Bottom Decoration'),
        triggers: tilemap.createLayer('Triggers'),
        objects: tilemap.layers[tilemap.getLayer('Objects')],
        topDecoration: tilemap.createLayer('Top Decoration')
      };
      this.layers.environment.resizeWorld();

      this.objectsGroup = this.add.group();

      this.initObjects();
      this.initTriggers();

      this.moveQueue = [];
      this.waiting = false;
      this.dirtyState = true;

      var keyUp = this.input.keyboard.addKey(Phaser.Keyboard.UP);
      keyUp.onDown.add(function () {
        _this.queueMove(0, -1);
      });
      var keyDown = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      keyDown.onDown.add(function () {
        _this.queueMove(0, 1);
      });
      var keyLeft = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      keyLeft.onDown.add(function () {
        _this.queueMove(-1, 0);
      });
      var keyRight = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      keyRight.onDown.add(function () {
        _this.queueMove(1, 0);
      });
      var keyR = this.input.keyboard.addKey(Phaser.Keyboard.R);
      keyR.onDown.add(function () {
        _this.initObjects();
      });
    }
  }, {
    key: 'update',
    value: function update() {
      this.objectsGroup.sort('y', Phaser.Group.SORT_ASCENDING);

      if (this.dirtyState) {
        this.dirtyState = false;
        if (this.checkState()) {
          console.log('goal');
          this.state.start(this.nextState);
        }
      }

      if (!this.waiting && this.moveQueue.length > 0) {
        this.waiting = true;
        var move = this.moveQueue.shift();
        this.move(move.xDelta, move.yDelta);
      }

      for (var i = this.objects.length - 1; i > -1; i--) {
        if (this.objects[i].destroyed) {
          this.objects.splice(i, 1);
        }
      }
    }
  }, {
    key: 'queueMove',
    value: function queueMove(xDelta, yDelta) {
      this.moveQueue.push({
        xDelta: xDelta,
        yDelta: yDelta
      });
    }
  }, {
    key: 'updateCamera',
    value: function updateCamera() {
      this.camera.bounds = null;
      this.camera.x = (this.currentTileMap.widthInPixels - this.game.width) / 2;
      this.camera.y = (this.currentTileMap.heightInPixels - this.game.height) / 2;
    }
  }, {
    key: 'updateGameSize',
    value: function updateGameSize(width, height) {
      // this.game.width = Math.floor(width / 2)
      // this.game.height = Math.floor(height / 2)
      // if (this.game.renderType === Phaser.WEBGL) {
      //   this.game.renderer.resize(this.game.width, this.game.height)
      // }
    }
  }, {
    key: 'initObjects',
    value: function initObjects() {
      this.objects = [];
      this.objectsGroup.removeAll();
      this.blotCount = 0;

      for (var i = 0; i < this.layers.objects.width; i++) {
        for (var j = 0; j < this.layers.objects.height; j++) {
          var data = this.layers.objects.data[j][i];

          if (data.properties.type === 'blot') {
            this.blotCount += 1;
            this.objects.push(new _blot2.default(this.game, this.objectsGroup, i, j));
          } else if (data.properties.type === 'boulder') {
            this.objects.push(new _boulder2.default(this.game, this.objectsGroup, i, j));
          }
        }
      }
    }
  }, {
    key: 'initTriggers',
    value: function initTriggers() {
      this.targetGoals = 0;

      var teleports = [];
      for (var i = 0; i < this.layers.triggers.layer.width; i++) {
        for (var j = 0; j < this.layers.triggers.layer.height; j++) {
          var tile = this.getTile(this.layers.triggers, i, j);
          if (tile.properties.type === 'teleport') {
            tile.properties.teleportId = teleports.length;
            teleports.push(tile);
          } else if (tile.properties.type === 'goal') {
            this.targetGoals += 1;
          }
        }
      }

      if (teleports.length === 2) {
        this.game.teleports = [{
          xDelta: teleports[1].x - teleports[0].x,
          yDelta: teleports[1].y - teleports[0].y
        }, {
          xDelta: teleports[0].x - teleports[1].x,
          yDelta: teleports[0].y - teleports[1].y
        }];
      }
    }
  }, {
    key: 'getTileProperties',
    value: function getTileProperties(layer, tileX, tileY) {
      return layer.layer.data[tileY][tileX].properties;
    }
  }, {
    key: 'getTile',
    value: function getTile(layer, tileX, tileY) {
      return layer.layer.data[tileY][tileX];
    }
  }, {
    key: 'move',
    value: function move(xDelta, yDelta) {
      var _this2 = this;

      var objectGrid = [];
      for (var i = 0; i < this.layers.environment.layer.width; i++) {
        objectGrid.push([]);
        for (var j = 0; j < this.layers.environment.layer.height; j++) {
          objectGrid[i].push(null);
        }
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var blot = _step.value;

          objectGrid[blot.tileX][blot.tileY] = {
            object: blot,
            motion: { xDelta: 0, yDelta: 0 },
            checked: false
          };
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      for (var _i = 0; _i < objectGrid.length; _i++) {
        for (var _j = 0; _j < objectGrid[_i].length; _j++) {
          if (objectGrid[_i][_j]) {
            if (objectGrid[_i][_j].object.constructor.name === 'Blot') {
              this.computeMotion(objectGrid, _i, _j, xDelta, yDelta);
            }
          }
        }
      }

      if (this.canMove(objectGrid)) {
        (function () {
          var countMoving = 0;

          for (var _i2 = 0; _i2 < objectGrid.length; _i2++) {
            for (var _j2 = 0; _j2 < objectGrid[_i2].length; _j2++) {
              if (objectGrid[_i2][_j2]) {
                var object = objectGrid[_i2][_j2].object;
                countMoving += 1;
                object.move(objectGrid[_i2][_j2].motion.xDelta, objectGrid[_i2][_j2].motion.yDelta, function () {
                  countMoving -= 1;
                  if (countMoving === 0) {
                    _this2.waiting = false;
                    _this2.dirtyState = true;
                  }
                });
              }
            }
          }
        })();
      } else {
        this.waiting = false;
        this.dirtyState = false;
      }
    }
  }, {
    key: 'computeMotion',
    value: function computeMotion(objectGrid, i, j, xDelta, yDelta) {
      var originalXDelta = xDelta;
      var originalYDelta = yDelta;

      var tile = objectGrid[i][j];

      if (!tile.checked) {
        var forwardTileX = tile.object.tileX + xDelta;
        var forwardTileY = tile.object.tileY + yDelta;

        // Teleport logic (changes xDelta/yDelta)
        if (tile.object.constructor.name === 'Blot' && tile.object.form === _blot.BLOT_FORM.OTHER) {
          var triggerProperties = this.getTileProperties(this.layers.triggers, forwardTileX, forwardTileY);
          if (triggerProperties.type === 'teleport') {
            var teleportId = triggerProperties.teleportId;
            xDelta += xDelta + this.game.teleports[teleportId].xDelta;
            yDelta += yDelta + this.game.teleports[teleportId].yDelta;
            forwardTileX = tile.object.tileX + xDelta;
            forwardTileY = tile.object.tileY + yDelta;
          }
        }

        var forwardTile = objectGrid[forwardTileX][forwardTileY];

        if (forwardTile) {
          // if (tile.object.constructor.name === 'Blot') {
          var neighbourMotion = this.computeMotion(objectGrid, forwardTileX, forwardTileY, originalXDelta, originalYDelta);
          if (neighbourMotion.xDelta !== 0 || neighbourMotion.yDelta !== 0) {
            tile.motion = { xDelta: xDelta, yDelta: yDelta };
          }
          // }
          tile.checked = true;
        } else {
          var triggerTile = this.getTile(this.layers.triggers, forwardTileX, forwardTileY);
          if (tile.object.constructor.name === 'Blot' && triggerTile.properties.type === 'altar') {
            tile.motion = { xDelta: 0, yDelta: 0 };
            tile.checked = true;
          } else {
            tile.motion = { xDelta: xDelta, yDelta: yDelta };
            tile.checked = true;
          }
        }

        // Boulder pulling logic
        if (tile.object.constructor.name === 'Blot' && tile.object.form === _blot.BLOT_FORM.PULLER) {
          var behindTileX = tile.object.tileX - xDelta;
          var behindTileY = tile.object.tileY - yDelta;
          var behindTile = objectGrid[behindTileX][behindTileY];

          if (behindTile && behindTile.object.constructor.name === 'Boulder') {
            behindTile.motion = tile.motion;
            behindTile.checked = true;
          }
        }
      }

      return tile.motion;
    }
  }, {
    key: 'canMove',
    value: function canMove(objectGrid) {
      for (var i = 0; i < objectGrid.length; i++) {
        for (var j = 0; j < objectGrid[i].length; j++) {
          if (objectGrid[i][j]) {
            var object = objectGrid[i][j].object;
            var motion = objectGrid[i][j].motion;

            var forwardTile = objectGrid[object.tileX + motion.xDelta][object.tileY + motion.yDelta];

            if (object.constructor.name === 'Blot' && object.form !== _blot.BLOT_FORM.NORMAL && forwardTile && forwardTile.object.constructor.name === 'Boulder') {
              return false;
            }

            var nextTileProperties = this.getTileProperties(this.layers.environment, object.tileX + motion.xDelta, object.tileY + motion.yDelta);

            if (nextTileProperties.type === 'solid') {
              if (object.constructor.name === 'Blot') {
                var trigger = this.getTile(this.layers.triggers, object.tileX + motion.xDelta, object.tileY + motion.yDelta);

                if (trigger.properties.type !== 'blocker') {
                  return false;
                }
              } else {
                return false;
              }
            }
          }
        }
      }

      return true;
    }
  }, {
    key: 'checkState',
    value: function checkState() {
      var goals = 0;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.objects[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var object = _step2.value;

          var tileProperties = this.getTileProperties(this.layers.triggers, object.tileX, object.tileY);

          if (object.constructor.name === 'Blot') {
            if (tileProperties.type === 'pit') {
              if (object.form !== _blot.BLOT_FORM.FLYER) {
                object.destroy();
                this.blotCount -= 1;
              }
            } else if (tileProperties.type === 'shifter') {
              object.shapeshift(tileProperties.form);
            } else if (tileProperties.type === 'goal') {
              if (object.form === tileProperties.form) {
                goals += 1;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return goals === this.blotCount && goals === this.targetGoals;
    }
  }, {
    key: 'createImage',
    value: function createImage(game, key, imageData) {
      var base64image = 'data:image/jpeg;base64,' + imageData;
      game.load.image(key, base64image);
    }
  }]);

  return LevelState;
}();

exports.default = LevelState;

},{"./blot":1,"./boulder":3}],6:[function(require,module,exports){
module.exports={ "height":5,
 "layers":[
        {
         "data":[1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 5, 4, 9, 9, 9, 9, 9, 9, 9, 9, 5, 4, 9, 9, 9, 9, 9, 9, 9, 9, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
         "height":5,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":5,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":5,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":5,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":5,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":10
}
},{}],7:[function(require,module,exports){
module.exports={ "height":10,
 "layers":[
        {
         "data":[0, 1, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0, 0, 0, 4, 9, 9, 9, 9, 9, 9, 9, 5, 3, 0, 0, 0, 4, 9, 5, 9, 9, 9, 5, 9, 9, 5, 0, 0, 0, 4, 9, 9, 9, 5, 9, 9, 9, 5, 5, 0, 0, 0, 4, 9, 5, 9, 9, 9, 5, 9, 9, 5, 0, 0, 1, 2, 9, 9, 9, 5, 9, 5, 9, 2, 2, 0, 0, 4, 9, 9, 5, 9, 9, 9, 9, 9, 5, 0, 0, 0, 2, 2, 9, 5, 9, 5, 9, 5, 9, 5, 0, 0, 0, 0, 4, 9, 9, 9, 5, 9, 9, 9, 5, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
         "height":10,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":10,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":10,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 78, 0, 0, 0, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 78, 0, 0, 0, 78, 0, 0, 0, 0, 0, 0, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 0, 0, 0, 0, 3221225550, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":10,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":10,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":13
}
},{}],8:[function(require,module,exports){
module.exports={ "height":7,
 "layers":[
        {
         "data":[1, 2, 2, 2, 2, 2, 3, 0, 4, 9, 9, 9, 9, 9, 2, 3, 4, 9, 9, 9, 9, 9, 9, 5, 4, 9, 9, 9, 9, 9, 9, 5, 4, 9, 9, 9, 9, 9, 9, 5, 4, 9, 9, 9, 9, 9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
         "height":7,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":8,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":7,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":8,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 17, 0, 17, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":7,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":8,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 73, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":7,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":8,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":7,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":8,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":8
}
},{}],9:[function(require,module,exports){
module.exports={ "height":7,
 "layers":[
        {
         "data":[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 4, 9, 9, 9, 5, 4, 9, 9, 9, 9, 9, 5, 2, 2, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 0, 2, 2, 9, 9, 9, 9, 9, 9, 9, 9, 5, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
         "height":7,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":7,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":7,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 73, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":7,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":7,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":12
}
},{}],10:[function(require,module,exports){
module.exports={ "height":8,
 "layers":[
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0, 0, 1, 2, 2, 2, 3, 0, 4, 9, 5, 0, 0, 4, 9, 2, 9, 2, 2, 2, 9, 5, 0, 0, 4, 9, 9, 9, 9, 9, 9, 9, 5, 1, 2, 2, 9, 2, 2, 2, 13, 9, 2, 5, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 2, 3, 9, 9, 9, 9, 9, 9, 9, 9, 5, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
         "height":8,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":11,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":11,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":11,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 78, 78, 78, 0, 0, 73, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":11,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":11,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":11
}
},{}],11:[function(require,module,exports){
module.exports={ "height":5,
 "layers":[
        {
         "data":[0, 0, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 2, 2, 9, 2, 2, 2, 9, 2, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 2, 2, 3, 9, 9, 1, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0],
         "height":5,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":11,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":5,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":11,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":5,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":11,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 0, 0, 0, 0, 0, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":5,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":11,
         "x":0,
         "y":0
        }, 
        {
         "data":[10, 10, 10, 10, 0, 10, 10, 10, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 0, 0, 10, 10, 10, 10, 10, 10, 0, 0, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":5,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":11,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":11
}
},{}],12:[function(require,module,exports){
module.exports={ "height":8,
 "layers":[
        {
         "data":[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 2, 2, 9, 9, 9, 9, 9, 9, 9, 9, 1, 2, 0, 4, 9, 9, 9, 9, 9, 9, 9, 2, 3, 0, 0, 4, 9, 13, 9, 9, 9, 9, 9, 9, 2, 3, 0, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 0, 4, 9, 9, 9, 9, 9, 9, 9, 9, 1, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
         "height":8,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 28, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 0, 0, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":12
}
},{}],13:[function(require,module,exports){
module.exports={ "height":11,
 "layers":[
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 0, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 0, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 0, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 0, 2, 3, 9, 9, 9, 9, 9, 2, 2, 2, 2, 0, 0, 5, 9, 9, 13, 9, 9, 5, 0, 0, 0, 0, 0, 5, 9, 9, 9, 9, 9, 5, 0, 0, 0, 0, 0, 5, 9, 9, 9, 9, 9, 5, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0],
         "height":11,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 26, 0, 0, 0, 0, 0, 11, 0, 18, 0, 0, 0, 26, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 26, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 26, 0, 0, 0, 0, 0, 11, 0, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":12
}
},{}],14:[function(require,module,exports){
module.exports={ "height":11,
 "layers":[
        {
         "data":[0, 0, 0, 1, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 4, 9, 9, 9, 2, 2, 3, 0, 0, 0, 0, 1, 2, 9, 9, 9, 9, 9, 5, 0, 0, 0, 0, 4, 9, 9, 5, 4, 9, 2, 2, 0, 0, 1, 2, 2, 2, 9, 5, 4, 9, 5, 0, 0, 0, 4, 9, 9, 9, 9, 5, 9, 9, 5, 0, 0, 0, 2, 2, 2, 9, 9, 9, 9, 1, 2, 0, 0, 0, 0, 0, 4, 9, 1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 28, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 0, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":12,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":12
}
},{}],15:[function(require,module,exports){
module.exports={ "height":9,
 "layers":[
        {
         "data":[0, 0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 9, 5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 9, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9, 9, 5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 9, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 4, 9, 9, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 9, 9, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0],
         "height":9,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":9,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 0, 34, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":9,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 0, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":9,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":9,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":13
}
},{}],16:[function(require,module,exports){
module.exports={ "height":12,
 "layers":[
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 9, 0, 9, 0, 9, 0, 9, 9, 9, 0, 0, 0, 0, 0, 9, 0, 0, 9, 9, 9, 0, 9, 9, 0, 0, 0, 0, 0, 0, 9, 0, 0, 9, 0, 9, 0, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 9, 0, 9, 0, 9, 0, 9, 9, 0, 0, 0, 0, 0, 9, 9, 0, 0, 9, 9, 9, 0, 9, 0, 9, 0, 0, 0, 0, 9, 9, 9, 0, 9, 0, 9, 0, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":12,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":15,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":12,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":15,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":12,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":15,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":12,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":15,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":12,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":15,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":15
}
},{}],17:[function(require,module,exports){
module.exports={ "height":8,
 "layers":[
        {
         "data":[1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 5, 4, 9, 9, 9, 5, 4, 9, 9, 9, 5, 4, 9, 9, 9, 5, 4, 9, 9, 9, 5, 4, 9, 2, 2, 2, 2, 2, 2, 9, 5, 4, 9, 9, 9, 9, 9, 9, 9, 9, 5, 4, 9, 9, 9, 9, 9, 9, 9, 9, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
         "height":8,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":10
}
},{}],18:[function(require,module,exports){
module.exports={ "height":8,
 "layers":[
        {
         "data":[1, 2, 2, 2, 2, 2, 3, 1, 2, 3, 4, 9, 9, 9, 9, 9, 5, 4, 9, 5, 4, 9, 9, 5, 4, 9, 9, 9, 9, 5, 4, 9, 9, 5, 4, 9, 5, 4, 9, 5, 4, 9, 9, 9, 9, 9, 9, 9, 9, 5, 4, 9, 9, 5, 4, 9, 5, 4, 9, 5, 4, 9, 9, 9, 9, 9, 5, 4, 9, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
         "height":8,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":10
}
},{}],19:[function(require,module,exports){
module.exports={ "height":8,
 "layers":[
        {
         "data":[0, 0, 0, 0, 0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 4, 9, 5, 0, 0, 1, 2, 2, 2, 2, 2, 9, 2, 2, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 5, 2, 2, 2, 2, 3, 9, 9, 2, 9, 5, 0, 0, 0, 0, 5, 9, 2, 2, 9, 5, 0, 0, 0, 0, 5, 9, 9, 9, 9, 5, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2],
         "height":8,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 0, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":10
}
},{}],20:[function(require,module,exports){
module.exports={ "height":11,
 "layers":[
        {
         "data":[1, 2, 2, 2, 2, 2, 2, 3, 0, 0, 4, 9, 9, 9, 9, 2, 9, 5, 0, 0, 4, 9, 9, 9, 9, 9, 9, 5, 0, 0, 4, 9, 9, 9, 9, 5, 9, 5, 0, 0, 4, 9, 9, 9, 9, 9, 9, 5, 0, 0, 4, 9, 9, 9, 9, 5, 9, 5, 0, 0, 4, 9, 9, 9, 9, 9, 9, 5, 0, 0, 2, 2, 2, 2, 9, 2, 2, 2, 0, 0, 0, 0, 0, 4, 9, 5, 0, 0, 0, 0, 0, 0, 0, 4, 9, 5, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
         "height":11,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 0, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":10
}
},{}],21:[function(require,module,exports){
module.exports={ "height":11,
 "layers":[
        {
         "data":[0, 1, 2, 2, 2, 2, 2, 2, 3, 0, 0, 4, 9, 9, 9, 9, 9, 9, 5, 0, 0, 4, 9, 9, 9, 9, 9, 9, 5, 0, 0, 4, 9, 9, 9, 9, 9, 9, 5, 0, 0, 4, 9, 9, 9, 9, 9, 9, 5, 0, 0, 4, 9, 9, 9, 9, 9, 9, 5, 0, 0, 4, 9, 9, 9, 9, 9, 9, 5, 0, 0, 2, 2, 9, 2, 2, 9, 2, 2, 0, 0, 0, 4, 9, 5, 4, 9, 5, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 11, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 0, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 78, 0, 0, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 10, 10, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":10
}
},{}],22:[function(require,module,exports){
module.exports={ "height":8,
 "layers":[
        {
         "data":[1, 2, 2, 2, 2, 2, 3, 4, 9, 9, 9, 9, 9, 5, 4, 9, 9, 9, 9, 9, 5, 4, 9, 9, 9, 9, 9, 5, 4, 9, 2, 9, 2, 9, 5, 4, 9, 9, 9, 9, 9, 5, 4, 9, 9, 9, 9, 9, 5, 2, 2, 2, 2, 2, 2, 2],
         "height":8,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":7,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":7,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":7,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":7,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":7,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":7
}
},{}],23:[function(require,module,exports){
module.exports={ "height":9,
 "layers":[
        {
         "data":[1, 2, 2, 2, 2, 2, 3, 4, 9, 9, 9, 9, 9, 5, 4, 9, 9, 9, 9, 9, 5, 4, 9, 9, 9, 9, 9, 5, 4, 9, 9, 9, 9, 9, 5, 4, 9, 9, 9, 9, 9, 5, 4, 9, 9, 9, 9, 9, 5, 4, 9, 9, 9, 9, 9, 5, 2, 2, 2, 2, 2, 2, 2],
         "height":9,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":7,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":9,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":7,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 11, 11, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 17, 0, 17, 0, 0, 0, 11, 11, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":9,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":7,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 73, 73, 0, 0, 0, 0, 73, 73, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":9,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":7,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0],
         "height":9,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":7,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":7
}
},{}],24:[function(require,module,exports){
module.exports={ "height":9,
 "layers":[
        {
         "data":[0, 1, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 1, 2, 9, 2, 9, 2, 3, 1, 2, 2, 2, 3, 0, 4, 9, 9, 9, 9, 9, 2, 2, 9, 2, 9, 2, 3, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 4, 9, 2, 9, 9, 9, 2, 2, 9, 2, 2, 2, 2, 4, 9, 9, 9, 9, 9, 9, 9, 9, 5, 0, 0, 0, 4, 9, 9, 9, 9, 9, 1, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":9,
         "name":"Environment",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":9,
         "name":"Bottom Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":9,
         "name":"Triggers",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 78, 0, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 73, 0, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":9,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }, 
        {
         "data":[10, 10, 0, 10, 0, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 10, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 0, 0, 0, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":9,
         "name":"Top Decoration",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":13,
         "x":0,
         "y":0
        }],
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":16,
 "tilesets":[
        {
         "columns":8,
         "firstgid":1,
         "image":"..\/..\/tileset.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"tilemap",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "0":
                {
                 "type":"solid"
                },
             "1":
                {
                 "type":"solid"
                },
             "10":
                {
                 "type":"pit"
                },
             "11":
                {
                 "type":"altar"
                },
             "12":
                {
                 "type":"solid"
                },
             "13":
                {
                 "form":0,
                 "type":"goal"
                },
             "16":
                {
                 "form":0,
                 "type":"goal"
                },
             "17":
                {
                 "form":2,
                 "type":"goal"
                },
             "18":
                {
                 "form":3,
                 "type":"goal"
                },
             "19":
                {
                 "form":1,
                 "type":"goal"
                },
             "2":
                {
                 "type":"solid"
                },
             "24":
                {
                 "form":0,
                 "type":"shifter"
                },
             "25":
                {
                 "form":2,
                 "type":"shifter"
                },
             "26":
                {
                 "form":3,
                 "type":"shifter"
                },
             "27":
                {
                 "form":1,
                 "type":"shifter"
                },
             "3":
                {
                 "type":"solid"
                },
             "32":
                {
                 "type":"teleport"
                },
             "33":
                {
                 "type":"teleport"
                },
             "4":
                {
                 "type":"solid"
                },
             "41":
                {
                 "form":0,
                 "type":"goal"
                },
             "6":
                {
                 "form":2,
                 "type":"shifter"
                },
             "7":
                {
                 "form":1,
                 "type":"shifter"
                }
            },
         "tilepropertytypes":
            {
             "0":
                {
                 "type":"string"
                },
             "1":
                {
                 "type":"string"
                },
             "10":
                {
                 "type":"string"
                },
             "11":
                {
                 "type":"string"
                },
             "12":
                {
                 "type":"string"
                },
             "13":
                {
                 "form":"int",
                 "type":"string"
                },
             "16":
                {
                 "form":"int",
                 "type":"string"
                },
             "17":
                {
                 "form":"int",
                 "type":"string"
                },
             "18":
                {
                 "form":"int",
                 "type":"string"
                },
             "19":
                {
                 "form":"int",
                 "type":"string"
                },
             "2":
                {
                 "type":"string"
                },
             "24":
                {
                 "form":"int",
                 "type":"string"
                },
             "25":
                {
                 "form":"int",
                 "type":"string"
                },
             "26":
                {
                 "form":"int",
                 "type":"string"
                },
             "27":
                {
                 "form":"int",
                 "type":"string"
                },
             "3":
                {
                 "type":"string"
                },
             "32":
                {
                 "type":"string"
                },
             "33":
                {
                 "type":"string"
                },
             "4":
                {
                 "type":"string"
                },
             "41":
                {
                 "form":"int",
                 "type":"string"
                },
             "6":
                {
                 "form":"int",
                 "type":"string"
                },
             "7":
                {
                 "form":"int",
                 "type":"string"
                }
            },
         "tilewidth":16,
         "transparentcolor":"#ffffff"
        }, 
        {
         "columns":8,
         "firstgid":65,
         "image":"..\/sprites.png",
         "imageheight":128,
         "imagewidth":128,
         "margin":0,
         "name":"sprites",
         "spacing":0,
         "tilecount":64,
         "tileheight":16,
         "tileproperties":
            {
             "13":
                {
                 "type":"boulder"
                },
             "8":
                {
                 "type":"blot"
                }
            },
         "tilepropertytypes":
            {
             "13":
                {
                 "type":"string"
                },
             "8":
                {
                 "type":"string"
                }
            },
         "tilewidth":16
        }],
 "tilewidth":16,
 "version":1,
 "width":13
}
},{}]},{},[4]);
