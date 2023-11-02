import SelectableGroup from "../../scene/SelectableGroup";
import { Types, Math as PMath, Scene } from "phaser";
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


// ------------------------------------------------------------------
// COLLISION DETECTION
// ------------------------------------------------------------------

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
// TARGETING STRATEGIES
// ------------------------------------------------------------------

export type ITargetingStrategy = (targets: TDEnemy[]) => TDEnemy | undefined

function makeMaxStrategyForProp(propName: keyof IEnemyGeneral): ITargetingStrategy {
  return (targets: TDEnemy[]) => {
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
}

function makeMinStrategyForProp(propName: keyof IEnemyGeneral): ITargetingStrategy {
  return (targets: TDEnemy[]) => {
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
}

// Assumes non-zero targets array length has been tested before calling
export const pickFirst: ITargetingStrategy = (targets: TDEnemy[]) => targets[0]
export const pickLast: ITargetingStrategy = (targets: TDEnemy[]) => targets[targets.length - 1]
export const pickRandom: ITargetingStrategy = (targets: TDEnemy[]) => randomChoice(targets)
export const pickMaxLevel: ITargetingStrategy = makeMaxStrategyForProp("level")
export const pickMinLevel: ITargetingStrategy = makeMinStrategyForProp("level")
export const pickMaxHealth: ITargetingStrategy = makeMaxStrategyForProp("health")
export const pickMinHealth: ITargetingStrategy = makeMinStrategyForProp("health")
export const pickMaxShield: ITargetingStrategy = makeMaxStrategyForProp("shield")
export const pickMinShield: ITargetingStrategy = makeMinStrategyForProp("shield")
export const pickMaxSpeed: ITargetingStrategy = makeMaxStrategyForProp("speed")
export const pickMinSpeed: ITargetingStrategy = makeMinStrategyForProp("speed")
export const pickMaxValue: ITargetingStrategy = makeMaxStrategyForProp("value")
export const pickMinValue: ITargetingStrategy = makeMinStrategyForProp("value")

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
