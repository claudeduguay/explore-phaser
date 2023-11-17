import { GameObjects, Math as PMath, Scene } from "phaser"
import BaseBehavior from "./BaseBehavior"
import TDTower from "../../../entity/tower/TDTower"
import { IPointLike } from "../../../../../util/geom/Point"

export default class BulletBehavior extends BaseBehavior {

  constructor(scene: Scene, tower: TDTower) {
    super(scene, tower, {
      singleEmitter: false,
      singleTarget: true
    })
  }

  initEmitter(i: number, source: IPointLike, time: number): void {
    const target = this.pickStrategy(this.tower)
    if (target) {
      // const color = DAMAGE_DATA[this.tower.model.organize.damage].color.value
      const { x, y } = this.asRelative(source)
      const emitter = this.scene.add.sprite(x, y, "muzzle")
      this.add(emitter)
      // emitter.setTint(color)
      emitter.setOrigin(0.5, 0.9)
      emitter.setScale(0.075)
      emitter.alpha = 0.75
      emitter.visible = false
    }
  }

  updateEmitter(i: number, source: IPointLike, time: number): void {
    const target = this.pickStrategy(this.tower)
    if (target) {
      const emitter = this.getAt<GameObjects.Sprite>(i)
      const { x, y } = this.asRelative(source)
      emitter.setPosition(x, y)
      const angle = PMath.Angle.BetweenPoints(target, this.tower) + Math.PI / 2
      emitter.rotation = angle - Math.PI
      const show = time % 150 > 75 //  Visible half of every 150ms
      emitter.visible = show
    }
  }

  clearEmitter(i: number, source: IPointLike, time: number): void {
    const emitter = this.getAt<GameObjects.Sprite>(i)
    if (emitter) {
      emitter.visible = false
    }
  }
}
