export class Bootstrap extends Phaser.Scene {
  constructor() {
    super('bootstrap')
  }

  init() {
    console.log('bootstrap init...')
  }
  preload() {
    console.log('bootstrap preload...')
  }
  create() {
    console.log('bootstrap create...')
    this.scene.start('game')
  }
}
