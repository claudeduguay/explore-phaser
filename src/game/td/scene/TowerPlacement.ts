import { Math as PMath, GameObjects } from "phaser";
import TDTower, { PreviewType } from "../entity/tower/TDTower";
import ITowerModel from "../entity/model/ITowerModel";
import { play } from "../../../util/SceneUtil";
import Point from "../../../util/geom/Point";
import TDPlayScene from "./TDPlayScene";
import TDHUDScene from "./TDHUDScene";

export default class TowerPlacement extends GameObjects.GameObject {

  dragging: boolean = false
  placingTower?: TDTower
  timer?: number

  constructor(
    public playScene: TDPlayScene,
    public hudScene: TDHUDScene) {
    super(playScene, "placement")
  }

  onAddTower = (model: ITowerModel) => {
    const { x, y } = this.hudScene.input
    this.placingTower = this.playScene.add.tower(x, y, model)
    if (this.placingTower) {
      this.placingTower.preview = PreviewType.Drag
      this.placingTower.showRange.visible = true
      this.playScene.towerGroup.select(undefined)
      setTimeout(() => this.dragging = true, 1000) // do this to avoid immediate mouse down 
    }
  }

  preUpdate(time: number, delta: number): void {
    const input = this.playScene.input
    if (!this.placingTower && input.mousePointer.isDown) {
      const timeout = 2000
      if (!this.timer) {
        this.timer = time
      } else {
        if (time > this.timer + timeout) {
          this.timer = undefined
          const selected = this.playScene.towerGroup.selected.value
          if (selected) {
            this.placingTower = selected
            this.placingTower.preview = PreviewType.Drag
            this.placingTower.showRange.visible = true
            this.playScene.towerGroup.select(undefined)
            setTimeout(() => this.dragging = true, 1000)
          }
        }
      }
    }
    if (this.placingTower) {
      const x = PMath.Snap.Floor(input.x, 64) + 32
      const y = PMath.Snap.Floor(input.y, 64) + 32
      const pos = new Point(x, y)
      if (input.mousePointer.isDown && this.dragging) {
        const isRightButton = input.mousePointer.rightButtonDown()
        // PLOP IF ON A VALID POSITION
        if (this.placingTower.platform.isTinted || isRightButton) {
          this.placingTower.destroy()
          if (!isRightButton) {
            play(this.playScene, "fail")
          }
        } else {
          this.playScene.towerGroup.add(this.placingTower)
          this.playScene.map.addTowerMarkAt(pos)
          this.placingTower.showRange.visible = false
          this.placingTower.preview = PreviewType.Normal
          play(this.playScene, "plop")
        }
        input.setDefaultCursor("default")
        this.placingTower = undefined
        this.dragging = false
      } else {
        // DRAGGING
        input.setDefaultCursor("none")

        // Highlight invalid positions
        if (this.playScene.map.checkCollision(pos)) {
          this.placingTower.platform.setTint(0xff0000)
        } else {
          this.placingTower.platform.clearTint()
        }
        this.placingTower.setPosition(x, y)
      }
    }
  }
}
