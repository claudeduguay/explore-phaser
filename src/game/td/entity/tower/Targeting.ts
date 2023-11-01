import SelectableGroup from "../../scene/SelectableGroup";
import { Types, Math as PMath, Scene, Utils } from "phaser";
import TDEnemy from "../enemy/TDEnemy";
import TDTower from "./TDTower";
import { randomChoice } from "../../../../util/Random";
import { IEnemyGeneral } from "../model/IEnemyModel";

export type ICollidable = Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile

export default class Targeting {

  previous: TDEnemy[] = []
  current: TDEnemy[] = []

  // Called by TargetClearBehavior, caches previous list for comparison 
  clear() {
    this.previous = this.current
    this.current = []
  }

  // Compute difference between current and previous lists
  delta() {
    const same = []
    const added = []
    const deleted = []
    for (let target of this.previous) {
      if (this.current.includes(target)) {
        same.push(target)
      } else {
        deleted.push(target)
      }
    }
    for (let target of this.current) {
      if (!this.previous.includes(target)) {
        added.push(target)
      }
    }
    return { same, added, deleted }
  }
}

export function connectTowerEnemyCollisionDetection(scene: Scene, towerGroup: SelectableGroup<TDTower>, enemyGroup: SelectableGroup<TDEnemy>) {
  scene.physics.add.overlap(towerGroup, enemyGroup, onEnemyOverlap, onEnemyInRadius)
}

// If we are in collision range (radius is checked by onEnemyInRange), add target
export function onEnemyOverlap(tower: ICollidable, enemy: ICollidable) {
  if (tower instanceof TDTower && enemy instanceof TDEnemy) {
    tower.targeting.current.unshift(enemy)
  }
}

// Check if enemy is within range radius
export function onEnemyInRadius(tower: ICollidable, enemy: ICollidable) {
  if (tower instanceof TDTower && enemy instanceof TDEnemy) {
    if (tower.preview) {
      return false
    }
    const distance = PMath.Distance.BetweenPoints(enemy, tower)
    return distance <= tower.model.general.range
  }
}

// ------------------------------------------------------------------
// Targeting Strategies
// ------------------------------------------------------------------

export type ITargetingStrategy = (targets: TDEnemy[]) => TDEnemy | undefined

export const pickFirst = (targets: TDEnemy[]) => {
  if (targets.length) {
    return targets[0]
  }
}

export const pickLast = (targets: TDEnemy[]) => {
  if (targets.length) {
    return targets[targets.length - 1]
  }
}

export const pickRandom = (targets: TDEnemy[]) => {
  if (targets.length) {
    return randomChoice(targets)
  }
}

export const pickMaxProp = (targets: TDEnemy[], propName: keyof IEnemyGeneral) => {
  let value = 0
  let best: TDEnemy | undefined
  targets.forEach(enemy => {
    if (enemy.model.general[propName] > value) {
      value = enemy.model.general[propName]
      best = enemy
    }
  })
  return best
}

export const pickMinProp = (targets: TDEnemy[], propName: keyof IEnemyGeneral) => {
  let value = Number.MAX_SAFE_INTEGER
  let best: TDEnemy | undefined
  targets.forEach(enemy => {
    if (enemy.model.general[propName] < value) {
      value = enemy.model.general[propName]
      best = enemy
    }
  })
  return best
}

export const pickMaxLevel = (targets: TDEnemy[]) => pickMaxProp(targets, "level")
export const pickMinLevel = (targets: TDEnemy[]) => pickMinProp(targets, "level")
export const pickMaxHealth = (targets: TDEnemy[]) => pickMaxProp(targets, "health")
export const pickMinHealth = (targets: TDEnemy[]) => pickMinProp(targets, "health")
export const pickMaxShield = (targets: TDEnemy[]) => pickMaxProp(targets, "shield")
export const pickMinShield = (targets: TDEnemy[]) => pickMinProp(targets, "shield")
export const pickMaxSpeed = (targets: TDEnemy[]) => pickMaxProp(targets, "speed")
export const pickMinSpeed = (targets: TDEnemy[]) => pickMinProp(targets, "speed")
export const pickMaxValue = (targets: TDEnemy[]) => pickMaxProp(targets, "value")
export const pickMinValue = (targets: TDEnemy[]) => pickMinProp(targets, "value")

export const TARGETING_STRATEGIES: { [key: string]: ITargetingStrategy } = {
  pickFirst,
  pickLast,
  pickRandom,
  pickMaxLevel,
  pickMinLevel,
  pickMaxHealth,
  pickMinHealth,
  pickMaxShield,
  pickMinShield,
  pickMaxSpeed,
  pickMinSpeed,
  pickMaxValue,
  pickMinValue
}