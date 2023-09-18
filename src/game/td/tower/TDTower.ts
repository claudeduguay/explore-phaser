
import { Scene, GameObjects, Input, Types, Math as PMath } from "phaser"
import TDTurret from "./TDTurret"
import BaseEnemy from "../enemy/BaseEnemy"
import BehaviorContainer from "../behavior/BehaviorContainer"
import TargetBehavior from "../behavior/TargetBehavior"
import IBehavior from "../behavior/IBehavior"

export class ClearTargetOnExit implements IBehavior<any> {
  update(obj: any, time: number, delta: number) {
    // console.log("Target:", obj.target)
    if (obj.target && obj.target.body.touching.none) {
      obj.target = undefined
      obj.angle = 0
      console.log("Clear target")
    }
  }
}

export default class TDTower extends BehaviorContainer {

  name: string = "tower"
  tower_base: GameObjects.Sprite
  turret: GameObjects.Container
  target?: BaseEnemy
  // zone: GameObjects.Graphics
  zone: GameObjects.Zone

  constructor(public scene: Scene, public x: number = 0, public y: number = x, public range: number = 150) {
    super(scene)
    this.tower_base = this.scene.add.sprite(0, 0, "tower_base").setInteractive()
      .on(Input.Events.POINTER_OVER, () => console.log("Mouse over"), this)
      .on(Input.Events.POINTER_OUT, () => console.log("Mouse out"), this)
      .on(Input.Events.POINTER_DOWN, () => console.log("Mouse down"), this)
      .on(Input.Events.POINTER_UP, () => console.log("Mouse up"), this)
    this.add(this.tower_base)

    this.turret = new TDTurret(scene)
    this.add(this.turret)

    const circle = new Phaser.Geom.Circle(this.x, this.y, range)
    const g = scene.add.graphics({ fillStyle: { color: 0xff0000, alpha: 0.1 } }).fillCircleShape(circle)
    scene.add.existing(g)
    this.zone = new GameObjects.Zone(scene, x, y, range * 2)
    scene.physics.add.existing(this.zone)
    // scene.physics.add.existing(this.zone)
    this.behavior.push(new TargetBehavior())
    this.behavior.push(new ClearTargetOnExit())
  }

  onOverlap(
    zone: Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    enemy: Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
    if (zone === this.zone) {
      if (enemy && !this.target) {
        const distance = PMath.Distance.BetweenPoints(enemy as BaseEnemy, this)
        if (distance <= this.range) {
          console.log(`DISTANCE:`, distance)
          console.log(`SET TARGET:`, enemy)
          this.target = enemy as BaseEnemy
        }
      }
    }
  }

  onCollision(
    zone: Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    enemy: Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
    // if (zone === this.zone) {
    //   console.log(`SPRITE COLLLISION:`, enemy)
    //   if (enemy && !this.target) {
    //     this.target = enemy as BaseEnemy
    //   }
    // }
  }
}
