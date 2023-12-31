import { Scene } from "phaser"
import { randomPeepOptions } from "../../assets/PeepFactory"
import { makePeep } from "../../assets/TextureFactory"
import { DAMAGE_DATA } from "./ITowerData"

export interface IEnemyGeneral {
  level: number
  health: number
  shield: number
  speed: number
  value: number
}

export interface IEnemyVulnerability {
  default: number
  [key: string]: number
}

export interface IEnemyModel<E = {}> {
  key: string
  name: string
  general: IEnemyGeneral & E
  defense: IEnemyVulnerability
}

export default IEnemyModel

export const ENEMY_LIST: IEnemyModel[] = []
export const ENEMY_INDEX: { [key: string]: IEnemyModel } = {}

export function generateEnemies(scene: Scene, count: number = 5) {
  for (let i = 1; i <= count; i++) {
    // Register assets
    const options = randomPeepOptions()
    makePeep(scene, `peep_${i}`, 32, 32, options)
    const maxSpeed = 75 * (count + 1)
    const speedUnit = 50
    const peep: IEnemyModel = {
      key: `peep_${i}`,
      name: `Level ${i}`,
      general: {
        level: i,
        health: 50 * i,
        shield: 50 * i,
        speed: maxSpeed - i * speedUnit,  // Toughter enemies are slower 
        value: 10 * i
      },
      defense: {
        default: 0,
      }
    }
    const defense = Object.entries(DAMAGE_DATA)
      .find(([key, data]: any) => data.color.value === options.colorChoice)
    if (defense?.[0]) {
      peep.defense[defense[0]] = 1.0
    }
    ENEMY_INDEX[peep.key] = peep
    ENEMY_LIST.push(peep)
    makeEnemyAnimations(scene, peep)
  }
}

export function makeEnemyAnimations(scene: Scene, model: IEnemyModel) {
  if (!scene.anims.exists(`east-${model.key}`)) {
    scene.anims.create({
      key: `east-${model.key}`, frameRate: 20, repeat: -1,
      frames: scene.anims.generateFrameNumbers(model.key, { start: 0, end: 15 }),
    })
  }
  if (!scene.anims.exists(`south-${model.key}`)) {
    scene.anims.create({
      key: `south-${model.key}`, frameRate: 20, repeat: -1,
      frames: scene.anims.generateFrameNumbers(model.key, { start: 16, end: 31 }),
    })
  }
  if (!scene.anims.exists(`west-${model.key}`)) {
    scene.anims.create({
      key: `west-${model.key}`, frameRate: 20, repeat: -1,
      frames: scene.anims.generateFrameNumbers(model.key, { start: 32, end: 47 }),
    })
  }
  if (!scene.anims.exists(`north-${model.key}`)) {
    scene.anims.create({
      key: `north-${model.key}`, frameRate: 20, repeat: -1,
      frames: scene.anims.generateFrameNumbers(model.key, { start: 48, end: 63 }),
    })
  }
}
