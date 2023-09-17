
import { Scene, GameObjects, Input } from "phaser"

export default class TDTower extends Scene {
  tower_base!: GameObjects.Sprite
  turret!: GameObjects.Container | null

  constructor(key: string, public x: number = 0, public y: number = x) {
    super({ key })
  }

  create() {
    this.tower_base = this.add.sprite(this.x, this.y, "tower_base").setInteractive()
      .on(Input.Events.POINTER_OVER, () => console.log("Mouse over"), this)
      .on(Input.Events.POINTER_OUT, () => console.log("Mouse out"), this)
      .on(Input.Events.POINTER_DOWN, () => console.log("Mouse down"), this)
      .on(Input.Events.POINTER_UP, () => console.log("Mouse up"), this)

    const tower_turret = this.add.sprite(0, 0, "tower_turret")
    const tower_gun = this.add.sprite(0, -8, "tower_gun")
    this.turret = this.add.container(this.x, this.y, [tower_turret, tower_gun])
  }

  update(time: number, delta: number): void {
    if (this.turret) {
      this.turret.angle += 1
    }
  }
}
