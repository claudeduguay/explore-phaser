import { Scene, GameObjects, Curves, Input } from "phaser";
import IEnemyModel from "../model/IEnemyModel";
import HealthBar from "./HealthBar";
import ActiveValue from "../../value/ActiveValue";
import { ISelectable } from "../../scene/SelectableGroup";
import BehaviorList from "../../behavior/core/BehaviorList";
import { toSceneCoordinates } from "../../../../util/Point";

export default class TDEnemy extends GameObjects.PathFollower implements ISelectable {

  twin?: TDEnemy   // Used in path preview (needed to match slow effect when applied)
  effects = new BehaviorList()
  frameCount: number = 0
  container!: GameObjects.Container
  shieldBar!: HealthBar
  healthBar!: HealthBar

  health!: ActiveValue
  shield!: ActiveValue

  constructor(scene: Scene,
    public x: number, public y: number,
    public model: IEnemyModel, public path: Curves.Path = new Curves.Path(),
    public showStatusBars: boolean = false) {

    super(scene, path, x, y, model.key)
    this.postFX.addShadow(0.2, 1.2, 0.2, 1, 0x000000, 3, 0.5)
    this.anims.create({
      key: 'east',
      frameRate: 20,
      frames: this.anims.generateFrameNumbers(model.key, { start: 0, end: 15 }),
      repeat: -1,
    })
    this.anims.create({
      key: 'south', frameRate: 20, repeat: -1,
      frames: this.anims.generateFrameNumbers(model.key, { start: 16, end: 31 }),
    })
    this.anims.create({
      key: 'west', frameRate: 20, repeat: -1,
      frames: this.anims.generateFrameNumbers(model.key, { start: 32, end: 47 }),
    })
    this.anims.create({
      key: 'north', frameRate: 20, repeat: -1,
      frames: this.anims.generateFrameNumbers(model.key, { start: 48, end: 63 }),
    })
    this.anims.play("east")
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

  detectDirectionChange() {
    const current = this.anims.currentAnim
    switch (this.angle) {
      case -90:
        if (current?.key !== "north") {
          this.anims.play("north")
        }
        break
      case 0:
        if (current?.key !== "east") {
          this.anims.play("east")
        }
        break
      case 90:
        if (current?.key !== "south") {
          this.anims.play("south")
        }
        break
      case 180:
        if (current?.key !== "west") {
          this.anims.play("west")
        }
        break
    }
    this.angle = 0
  }

  handleStatusBars() {
    if (this.showStatusBars) {
      const healthFraction = this.health.compute() / this.health.baseValue
      const shieldFraction = this.shield.compute() / this.shield.baseValue
      if (healthFraction < 0.005) {
        this.container.destroy()  // Make sure we don't leave lingering bar parts behind
        this.emit("died", this)
      }
      if (shieldFraction < 0.005) {
        this.shield.reset()
      }
      // this.shieldBar.fraction = shield_fraction
      this.healthBar.fraction = healthFraction
      const bounds = this.getBounds()
      const x = this.pathVector.x - this.healthBar.w / 2
      const y = this.pathVector.y - bounds.height - this.healthBar.h * 2
      this.container.setPosition(x, y)
    }
  }

  preUpdate(time: number, delta: number): void {
    this.frameCount += 1
    if (this.isFollowing()) {
      super.preUpdate(time, delta)
    }
    this.effects.update(time, delta)
    this.detectDirectionChange()
    this.handleStatusBars()
  }

  get scenePosition() {
    return toSceneCoordinates(this)
  }

}

GameObjects.GameObjectFactory.register("enemy",
  function (this: GameObjects.GameObjectFactory, x: number, y: number, model: IEnemyModel, path?: Curves.Path, showStatusBars?: boolean) {
    const tower = new TDEnemy(this.scene, x, y, model, path, showStatusBars)
    this.displayList.add(tower)
    this.updateList.add(tower)
    return tower
  }
)
