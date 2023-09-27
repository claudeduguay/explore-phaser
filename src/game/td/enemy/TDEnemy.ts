import { Scene, GameObjects, Curves } from "phaser";
import IEnemyModel from "../model/IEnemyModel";
import HealthBar from "./HealthBar";
import ActiveValue from "../value/ActiveValue";

export default class TDEnemy extends GameObjects.PathFollower {

  container!: GameObjects.Container
  shieldBar!: HealthBar
  healthBar!: HealthBar
  status: { health: number, shield: number } = { health: 1.0, shield: 1.0 }

  health!: ActiveValue
  shield!: ActiveValue

  constructor(scene: Scene, public path: Curves.Path,
    public x: number, public y: number, key: string,
    public model?: IEnemyModel, public showStatisBars: boolean = false) {
    super(scene, path, x, y, key)

    this.health = new ActiveValue(model?.stats.health || 0)
    this.shield = new ActiveValue(model?.stats.shield || 0)

    if (showStatisBars) {
      this.shieldBar = new HealthBar(scene, this, 0, 0, 30, 5, 0xffa500)
      scene.add.existing(this.shieldBar)

      this.healthBar = new HealthBar(scene, this, 0, 3, 30, 5, 0x00ff00)
      scene.add.existing(this.healthBar)

      this.container = scene.add.container()
      this.container.add(this.healthBar)
      this.container.add(this.shieldBar)
      scene.add.existing(this.container)
    }
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)
    if (this.showStatisBars) {
      const SHIELD_TIME = 8000
      const HEALTH_TIME = 10000
      this.status.shield = 1.0 - time % SHIELD_TIME / SHIELD_TIME
      this.status.health = 1.0 - time % HEALTH_TIME / HEALTH_TIME
      this.shieldBar.fraction = this.status.shield
      this.healthBar.fraction = this.status.health
      const bounds = this.getBounds()
      const x = this.pathVector.x - this.healthBar.w / 2
      const y = this.pathVector.y - bounds.height - this.healthBar.h * 2
      this.container.setPosition(x, y)
    }
  }

}
