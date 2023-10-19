import { Types, Math as PMath } from "phaser";
import TDEnemy from "../enemy/TDEnemy";
import TDTower from "./TDTower";
import Point from "../../../../util/geom/Point";

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


// Check if enemy is within range radius
export function onEnemyInRange(tower: Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
  enemy: Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
  if (tower instanceof TDTower && enemy instanceof TDEnemy) {
    if (tower.preview) {
      return false
    }
    const distance = PMath.Distance.BetweenPoints(enemy, tower)
    return distance <= tower.model.stats.range
  }
}

// If we are within range (radius checked by onEnemyInRange), add target
export function onEnemyOverlap(
  tower: Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
  enemy: Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
  if (tower instanceof TDTower && enemy instanceof TDEnemy) {
    tower.targeting.current.unshift(enemy)
  }
}

export function checkPointCollision(points: Point[], pos: Point, tolerance: number = 32,) {
  let collision = false
  points?.forEach(point => {
    const diff = point.diff(pos)
    if (diff.x < tolerance && diff.y < tolerance) {
      collision = true
    }
  })
  return collision
}