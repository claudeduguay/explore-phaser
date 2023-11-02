import { Math as PMath, GameObjects } from "phaser";
import TDTower, { PreviewType } from "../entity/tower/TDTower";
import ITowerModel from "../entity/model/ITowerModel";
import Point from "../../../util/geom/Point";
import TDPlayScene from "./TDPlayScene";
import TDHUDScene from "./TDHUDScene";
import { play } from "../../../util/SceneUtil";

export default class TowerPlacement extends GameObjects.GameObject {

  addingTower?: TDTower

  constructor(
    public playScene: TDPlayScene,
    public hudScene: TDHUDScene) {
    super(playScene, "placement")
  }

  dragging: boolean = false

  onAddTower = (model: ITowerModel) => {
    const { x, y } = this.hudScene.input
    // const { x: tx, y: ty } = this.playScene.cameras.main.getWorldPoint(x, y)
    this.addingTower = this.playScene.add.tower(x, y, model)
    if (this.addingTower) {
      this.addingTower.preview = PreviewType.Drag
      this.addingTower.showRange.visible = true
      this.playScene.towerGroup.select(undefined)
      setTimeout(() => this.dragging = true, 1000) // do this to avoid immediate mouse down 
    }
  }

  preUpdate(time: number, delta: number): void {
    const input = this.playScene.input
    if (this.addingTower) {
      const x = PMath.Snap.Floor(input.x, 64) + 32
      const y = PMath.Snap.Floor(input.y, 64) + 32
      const pos = new Point(x, y)
      if (input.mousePointer.isDown && this.dragging) {
        console.log("Detected as mouse down")
        // PLOP IF ON A VALID POSITION
        if (this.addingTower.platform.isTinted) {
          this.addingTower.destroy()
          play(this.playScene, "fail")
        } else {
          this.playScene.towerGroup.add(this.addingTower)
          this.playScene.map.addTowerMarkAt(pos)
          this.addingTower.showRange.visible = false
          this.addingTower.preview = PreviewType.Normal
          play(this.playScene, "plop")
        }
        input.setDefaultCursor("default")
        this.addingTower = undefined
        this.dragging = false
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
