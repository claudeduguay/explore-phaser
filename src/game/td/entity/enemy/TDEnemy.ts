import { Scene, GameObjects, Curves, Input } from "phaser";
import IEnemyModel from "../model/IEnemyModel";
import HealthBar from "./HealthBar";
import { ISelectable } from "../../scene/SelectableGroup";
import BehaviorList from "../../behavior/BehaviorList";
import { toSceneCoordinates } from "../../../../util/geom/Point";
import CustomFollower from "./CustomFollower";
import Direction from "../../../../util/geom/Direction";
import { IProxyExtensions, deepCloneEnemyModelAndProxy } from "../model/EffectsProxy";

export default class TDEnemy extends CustomFollower implements ISelectable {

  twin?: TDEnemy   // Used in path preview (needed to match slow effect when applied)
  effects = new BehaviorList()
  frameCount: number = 0
  barContainer!: GameObjects.Container
  shieldBar!: HealthBar
  healthBar!: HealthBar

  health!: number
  shield!: number

  model: IEnemyModel<IProxyExtensions>

  constructor(scene: Scene,
    public x: number, public y: number,
    model: IEnemyModel, public path: Curves.Path = new Curves.Path(),
    public showStatusBars: boolean = false) {

    super(scene, x, y, model, path)

    this.model = deepCloneEnemyModelAndProxy(model)
    this.currentSpeed = this.model.general.speed

    this.setSize(32, 32)
    this.postFX.addShadow(0.2, 1.1, 0.2, 1, 0x000000, 3, 0.5)

    this.anims.play(`east-${model.key}`)
    this.setInteractive()

    this.health = model.general.health || 0
    this.shield = model.general.shield || 0

    if (showStatusBars) {
      this.shieldBar = new HealthBar(scene, this, 0, 0, 30, 5, 0xffa500)
      scene.add.existing(this.shieldBar)
      this.shieldBar.visible = false

      this.healthBar = new HealthBar(scene, this, 0, 3, 30, 5, 0x00ff00)
      scene.add.existing(this.healthBar)

      // NOTE: barContainer should be added to ourselvesfor proper disposal
      this.barContainer = scene.add.container()
      this.barContainer.add(this.healthBar)
      this.barContainer.add(this.shieldBar)
      this.add(this.barContainer)
    }
  }

  // NOTE: barContainer should be added to ourselvesfor proper disposal
  // preDestroy() {
  //   this.effects.clear()
  //   if (this.barContainer) {
  //     this.barContainer.destroy()
  //   }
  // }

  addSelectHandler(select: (selection?: TDEnemy) => void) {
    this.on(Input.Events.POINTER_DOWN, (pointer: any, x: number, y: number, e: Event) => {
      select(this)
      this.showSelection()
      e.stopPropagation()
    }, this)
  }

  removeSelectHandler() {
    this.off(Input.Events.POINTER_DOWN)
  }

  showSelection() {
    this.postFX.clear()
    this.postFX.addGlow()
  }

  hideSelection() {
    this.postFX.clear()
    this.postFX.addShadow(0.2, 1.1, 0.2, 1, 0x000000, 3, 0.5)
  }

  detectDirectionChange() {
    if (!this.scene) {
      return
    }
    const current = this.anims.currentAnim
    switch (this.dir) {
      case Direction.North:
        if (current?.key !== `north-${this.model.key}`) {
          // if (!this.scene.anims.exists(`north-${this.model.key}`)) {
          //   console.log(`north-${this.model.key} animation does not exist, creating`)
          //   this.scene.anims.create({
          //     key: `north-${this.model.key}`, frameRate: 20, repeat: -1,
          //     frames: this.anims.generateFrameNumbers(this.model.key, { start: 48, end: 63 }),
          //   })
          // }
          this.anims.play(`north-${this.model.key}`)
        }
        break
      case Direction.East:
        if (current?.key !== `east-${this.model.key}`) {
          // if (!this.scene.anims.exists(`east-${this.model.key}`)) {
          //   console.log(`east-${this.model.key} animation does not exist, creating`)
          //   this.scene.anims.create({
          //     key: `east-${this.model.key}`, frameRate: 20, repeat: -1,
          //     frames: this.scene.anims.generateFrameNumbers(this.model.key, { start: 0, end: 15 }),
          //   })
          // }
          this.anims.play(`east-${this.model.key}`)
        }
        break
      case Direction.South:
        if (current?.key !== `south-${this.model.key}`) {
          // if (!this.scene.anims.exists(`south-${this.model.key}`)) {
          //   console.log(`south-${this.model.key} animation does not exist, creating`)
          //   this.scene.anims.create({
          //     key: `south-${this.model.key}`, frameRate: 20, repeat: -1,
          //     frames: this.scene.anims.generateFrameNumbers(this.model.key, { start: 16, end: 31 }),
          //   })
          // }
          this.anims.play(`south-${this.model.key}`)
        }
        break
      case Direction.West:
        if (current?.key !== `west-${this.model.key}`) {
          // if (!this.scene.anims.exists(`west-${this.model.key}`)) {
          //   console.log(`west-${this.model.key} animation does not exist, creating`)
          //   this.scene.anims.create({
          //     key: `west-${this.model.key}`, frameRate: 20, repeat: -1,
          //     frames: this.scene.anims.generateFrameNumbers(this.model.key, { start: 32, end: 47 }),
          //   })
          // }
          this.anims.play(`west-${this.model.key}`)
        }
        break
    }
  }

  handleStatusBars() {
    if (this.showStatusBars) {
      if (this.health < 1) {
        // this.barContainer.destroy()  // Make sure we don't leave lingering bar parts behind
        this.emit("died", this)
      }
      const healthFraction = this.health / this.model.general.health
      const shieldFraction = this.shield / this.model.general.shield
      this.shieldBar.fraction = shieldFraction
      this.healthBar.fraction = healthFraction
      // const x = this.x - this.healthBar.width / 2
      // const y = this.y - bounds.height - this.healthBar.h * 2
      // this.barContainer.setPosition(x, y)
      const x = -this.healthBar.width / 2
      const y = -this.height - this.barContainer.height //- this.healthBar.h * 2
      this.barContainer.setPosition(x, y)
    }
  }

  preUpdate(time: number, delta: number): void {
    this.currentSpeed = this.model.general.speed
    super.preUpdate(time, delta)
    this.frameCount += 1
    // if (this.isFollowing()) {
    //   super.preUpdate(time, delta)
    // }
    this.effects.update(time, delta)
    this.detectDirectionChange()
    this.handleStatusBars()
  }

  get scenePosition() {
    return toSceneCoordinates(this)
  }

}

export function registerEnemyFactory() {
  GameObjects.GameObjectFactory.register("enemy",
    function (this: GameObjects.GameObjectFactory, x: number, y: number, model: IEnemyModel, path?: Curves.Path, showStatusBars?: boolean) {
      const tower = new TDEnemy(this.scene, x, y, model, path, showStatusBars)
      this.displayList.add(tower)
      this.updateList.add(tower)
      return tower
    }
  )
}