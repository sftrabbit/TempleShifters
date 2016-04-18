import BootState from './bootState'

const game = new window.Phaser.Game(300, 220, Phaser.AUTO, 'game') // eslint-disable-line no-new

game.state.add('boot', new BootState())
game.state.start('boot')

export function foo() {
  console.log('foo')
}
