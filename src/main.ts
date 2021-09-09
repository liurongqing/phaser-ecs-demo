import 'phaser'

import * as scene from './scenes'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 600,
    height: 600,
  },
  scene: Object.values(scene),
}

export default new Phaser.Game(config)
