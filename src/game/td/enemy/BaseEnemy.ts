import { Scene, GameObjects } from "phaser";
import BehaviorContainer from "../behavior/BehaviorContainer";
import OrbitBehavior from "../behavior/OrbitBehavior";

export default class BaseEnemy extends BehaviorContainer {

  constructor(scene: Scene, public x: number, public y: number) {
    super(scene)
    const enemy = this.scene.add.sprite(0, 0, "enemy")
    this.add(enemy)
    this.behavior.push(new OrbitBehavior(x, y, 250, 250))

    // const c = scene.add.ellipse(0, 0, 32, 32)
    scene.physics.add.existing(this)
  }
}
