import { Math as PMath, GameObjects } from "phaser";
import TDTower, { PreviewType } from "../entity/tower/TDTower";
import ITowerModel from "../entity/model/ITowerModel";
import Point from "../../../util/geom/Point";
import TDPlayScene from "./TDPlayScene";
import TDHUDScene from "./TDHUDScene";

export default class TowerPlacement extends GameObjects.GameObject {

  addingTower?: TDTower

  constructor(
    public playScene: TDPlayScene,
    public hudScene: TDHUDScene) {
    super(playScene, "placement")
  }

  onAddTower = (model: ITowerModel) => {
    this.addingTower = this.playScene.add.tower(this.playScene.input.x, this.playScene.input.y, model)
    if (this.addingTower) {
      this.addingTower.preview = PreviewType.Drag
      this.addingTower.showRange.visible = true
      this.playScene.towerGroup.select(undefined)
    }
  }

  preUpdate(time: number, delta: number): void {
    const input = this.playScene.input
    if (this.addingTower) {
      const x = PMath.Snap.Floor(input.x, 64) + 32
      const y = PMath.Snap.Floor(input.y, 64) + 32
      const pos = new Point(x, y)

      if (input.mousePointer.isDown) {
        // PLOP IF ON VALID POSITION
        input.setDefaultCursor("default")
        if (this.addingTower.platform.isTinted) {
          this.addingTower.destroy()
          if (this.playScene.sound.get("fail")) {
            this.playScene.sound.play("fail")
          }
        } else {
          this.playScene.towerGroup.add(this.addingTower)
          this.playScene.map.addTowerMarkAt(pos)
          this.addingTower.preview = PreviewType.Normal
          if (this.playScene.sound.get("plop")) {
            this.playScene.sound.play("plop")
          }
        }
        this.addingTower.showRange.visible = false
        this.addingTower = undefined
      } else {
        // DRAGGING
        input.setDefaultCursor("none")

        // Highlight invalid positions
        if (this.playScene.map.checkCollision(pos)) {
          this.addingTower.platform.setTint(0xff0000)
        } else {
          this.addingTower.platform.clearTint()
        }
        this.addingTower.setPosition(x, y)
      }
    }
  }
}
