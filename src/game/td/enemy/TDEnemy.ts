import { Scene, GameObjects, Curves, Input } from "phaser";
import IEnemyModel from "../model/IEnemyModel";
import HealthBar from "./HealthBar";
import ActiveValue from "../value/ActiveValue";
import { ISelectable } from "../scene/SelectableGroup";

export default class TDEnemy extends GameObjects.PathFollower implements ISelectable {

  container!: GameObjects.Container
  shieldBar!: HealthBar
  healthBar!: HealthBar

  health!: ActiveValue
  shield!: ActiveValue

  constructor(scene: Scene,
    public x: number, public y: number, public key: string,
    public model: IEnemyModel, public path: Curves.Path = new Curves.Path(),
    public showStatusBars: boolean = false) {
    super(scene, path, x, y, key)

    this.setInteractive()

    this.health = new ActiveValue(model.stats.health || 0)
    this.shield = new ActiveValue(model.stats.shield || 0)

    if (showStatusBars) {
      // this.shieldBar = new HealthBar(scene, this, 0, 0, 30, 5, 0xffa500)
      // scene.add.existing(this.shieldBar)

      this.healthBar = new HealthBar(scene, this, 0, 3, 30, 5, 0x00ff00)
      scene.add.existing(this.healthBar)

      this.container = scene.add.container()
      this.container.add(this.healthBar)
      // this.container.add(this.shieldBar)
      scene.add.existing(this.container)
    }
  }

  addSelectHandler(select: (selection?: TDEnemy) => void) {
    this.on(Input.Events.POINTER_UP, () => {
      select(this)
      this.showSelection()
    }, this)
  }

  removeSelectHandler() {
    this.off(Input.Events.POINTER_UP)
  }

  showSelection() {
    console.log("Add glow")
    this.postFX.addGlow()
  }

  hideSelection() {
    this.postFX.clear()
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)
    if (this.showStatusBars) {
      const health_fraction = this.health.compute() / this.health.baseValue
      const shield_fraction = this.shield.compute() / this.shield.baseValue
      if (health_fraction < 0.005) {
        this.emit("died", this)
      }
      if (shield_fraction < 0.005) {
        this.shield.reset()
      }
      // this.shieldBar.fraction = shield_fraction
      this.healthBar.fraction = health_fraction
      const bounds = this.getBounds()
      const x = this.pathVector.x - this.healthBar.w / 2
      const y = this.pathVector.y - bounds.height - this.healthBar.h * 2
      this.container.setPosition(x, y)
    }
  }

}

GameObjects.GameObjectFactory.register("enemy",
  function (this: GameObjects.GameObjectFactory, x: number, y: number, key: string, model: IEnemyModel, path?: Curves.Path, showStatusBars?: boolean) {
    const tower = new TDEnemy(this.scene, x, y, key, model, path, showStatusBars)
    this.displayList.add(tower)
    this.updateList.add(tower)
    return tower
  }
)
