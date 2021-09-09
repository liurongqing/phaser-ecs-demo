import {
  createWorld,
  addEntity,
  addComponent,
  defineComponent,
  defineSystem,
  defineQuery,
  enterQuery,
  exitQuery,
  System,
  IWorld,
  Types,
} from 'bitecs'

const Position = defineComponent({
  x: Types.f32,
  y: Types.f32,
})

const Velocity = defineComponent({
  x: Types.f32,
  y: Types.f32,
})

const Sprite = defineComponent({
  texture: Types.ui8,
})

const spritesById = new Map<number, Phaser.GameObjects.Sprite>()
const spriteQuery = defineQuery([Sprite, Position])
const spriteQueryEnter = enterQuery(spriteQuery)
const spriteQueryExit = exitQuery(spriteQuery)
const createSpriteSystem = (scene: Phaser.Scene, textures: string[]) =>
  defineSystem((world) => {
    const enterEntities = spriteQueryEnter(world)
    for (let i = 0; i < enterEntities.length; ++i) {
      const id = enterEntities[i]
      const texId = Sprite.texture[id]
      const texture = textures[texId]
      spritesById.set(id, scene.add.sprite(0, 0, texture))
    }

    const entities = spriteQuery(world)
    for (let i = 0; i < entities.length; ++i) {
      const id = entities[i]
      const sprite = spritesById.get(id)
      if (!sprite) continue
      sprite.x = Position.x[id]
      sprite.y = Position.y[id]
    }

    const exitEntities = spriteQueryExit(world)
    for (let i = 0; i < exitEntities.length; ++i) {
      const id = exitEntities[i]
      const sprite = spritesById.get(id)
      if (!sprite) continue
      sprite.destroy()
      spritesById.delete(id)
    }
    // spriteQuery(world)
    return world
  })

export class Game extends Phaser.Scene {
  private world?: IWorld
  private spriteSystem: System
  constructor() {
    super('game')
  }

  init() {
    console.log('game init...')
  }
  preload() {
    // console.log('game preload...')
    this.load.image('tank-blue', 'assets/tank_blue.png')
    this.load.image('tank-green', 'assets/tank_green.png')
    this.load.image('tank-red', 'assets/tank_red.png')
  }
  create() {
    this.world = createWorld()

    const tank = addEntity(this.world)
    // console.log('tank', tank)

    addComponent(this.world, Position, tank)

    Position.x[tank] = 100
    Position.y[tank] = 100

    addComponent(this.world, Velocity, tank)
    Velocity.x[tank] = 5
    Velocity.y[tank] = 5

    addComponent(this.world, Sprite, tank)
    Sprite.texture[tank] = 0

    this.spriteSystem = createSpriteSystem(this, [
      'tank-blue',
      'tank-green',
      'tank-red',
    ])
    // TODO:  create entities
    // TODO: attach components
    // TODO: create systems
  }
  update(t: number, dt: number) {
    if (!this.world || !this.spriteSystem) return
    this.spriteSystem(this.world)
  }
}
