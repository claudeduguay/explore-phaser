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
// SINGLE TARGET STRATEGIES
// ------------------------------------------------------------------

export type ISingleTargetStrategy = (tower: TDTower) => TDEnemy | undefined

function makeMaxStrategyForProp(propName: keyof IEnemyGeneral): ISingleTargetStrategy {
  return (tower: TDTower) => {
    const targets: TDEnemy[] = tower.targeting.current
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

function makeMinStrategyForProp(propName: keyof IEnemyGeneral): ISingleTargetStrategy {
  return (tower: TDTower) => {
    const targets: TDEnemy[] = tower.targeting.current
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
export const pickFirst: ISingleTargetStrategy = (tower: TDTower) => tower.targeting.current[0]
export const pickLast: ISingleTargetStrategy = (tower: TDTower) => tower.targeting.current[tower.targeting.current.length - 1]
export const pickRandom: ISingleTargetStrategy = (tower: TDTower) => randomChoice(tower.targeting.current)
export const pickMaxLevel: ISingleTargetStrategy = makeMaxStrategyForProp("level")
export const pickMinLevel: ISingleTargetStrategy = makeMinStrategyForProp("level")
export const pickMaxHealth: ISingleTargetStrategy = makeMaxStrategyForProp("health")
export const pickMinHealth: ISingleTargetStrategy = makeMinStrategyForProp("health")
export const pickMaxShield: ISingleTargetStrategy = makeMaxStrategyForProp("shield")
export const pickMinShield: ISingleTargetStrategy = makeMinStrategyForProp("shield")
export const pickMaxSpeed: ISingleTargetStrategy = makeMaxStrategyForProp("speed")
export const pickMinSpeed: ISingleTargetStrategy = makeMinStrategyForProp("speed")
export const pickMaxValue: ISingleTargetStrategy = makeMaxStrategyForProp("value")
export const pickMinValue: ISingleTargetStrategy = makeMinStrategyForProp("value")

export const SINGLE_TARGET_STRATEGIES: { [key: string]: ISingleTargetStrategy } = {
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

// ------------------------------------------------------------------
// MULTI-TARGET STRATEGIES
// ------------------------------------------------------------------

export type IMultiTargetStrategy = (tower: TDTower) => TDEnemy[]

export const pickAll: IMultiTargetStrategy = (tower: TDTower) => tower.targeting.current

export const MULTI_TARGET_STRATEGIES: { [key: string]: IMultiTargetStrategy } = {
  pickAll
}
