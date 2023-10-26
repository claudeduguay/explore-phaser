import SelectableGroup from "../../scene/SelectableGroup";
import { Types, Math as PMath, Scene } from "phaser";
import TDEnemy from "../enemy/TDEnemy";
import TDTower from "./TDTower";

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
    return distance <= tower.model.stats.range
  }
}
