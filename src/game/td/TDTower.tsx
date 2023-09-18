
import { Scene, GameObjects, Input } from "phaser"
import TDTurret from "./TDTurret"

export default class TDTower extends GameObjects.Container {
  tower_base: GameObjects.Sprite
  turret: GameObjects.Container | null

  constructor(public scene: Scene, public x: number = 0, public y: number = x) {
    super(scene)
    this.tower_base = this.scene.add.sprite(0, 0, "tower_base").setInteractive()
      .on(Input.Events.POINTER_OVER, () => console.log("Mouse over"), this)
      .on(Input.Events.POINTER_OUT, () => console.log("Mouse out"), this)
      .on(Input.Events.POINTER_DOWN, () => console.log("Mouse down"), this)
      .on(Input.Events.POINTER_UP, () => console.log("Mouse up"), this)
    this.add(this.tower_base)

    this.turret = new TDTurret(scene)
    this.add(this.turret)

    // scene.sys.updateList.add(this)
  }

  // preUpdate(time: number, delta: number): void {
  //   if (this.turret) {
  //     this.turret.angle += 1
  //   }
  // }
}

// Not functional
declare interface GameObjectFactory {
  tower: (this: GameObjectFactory, x: number, y: number) => TDTower
}

GameObjects.GameObjectFactory.register("tower",
  function (this: GameObjects.GameObjectFactory, x: number, y: number) {
    return new TDTower(this.scene, x, y)
  }
)
