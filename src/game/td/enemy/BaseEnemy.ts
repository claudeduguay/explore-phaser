import { Scene } from "phaser";
import BehaviorContainer from "../behavior/BehaviorContainer";
import OrbitBehavior from "../behavior/OrbitBehavior";

export default class BaseEnemy extends BehaviorContainer {

  constructor(scene: Scene, public x: number, public y: number, angle: number = 0) {
    super(scene)
    const enemy = this.scene.add.sprite(0, 0, "enemy")
    this.add(enemy)

    this.setSize(32, 32) // Sets bounding box

    this.behavior.push(new OrbitBehavior(x, y, 300, 125, angle))
  }
}
