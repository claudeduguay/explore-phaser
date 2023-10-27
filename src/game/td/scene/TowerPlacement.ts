import { Scene, Math as PMath, GameObjects } from "phaser";
import TDTower from "../entity/tower/TDTower";
import ITowerModel from "../entity/model/ITowerModel";
import SelectableGroup from "./SelectableGroup";
import Point from "../../../util/geom/Point";
import { TDTileMap } from "./map/TDTileMap";

export default class TowerPlacement extends GameObjects.GameObject {

  addingTower?: TDTower

  constructor(
    public playScene: Scene,
    public hudScene: Scene,
    public map: TDTileMap,
    public towerGroup: SelectableGroup<TDTower>) {
    super(playScene, "placement")
  }

  onAddTower = (model: ITowerModel) => {
    this.addingTower = this.playScene.add.tower(this.playScene.input.x, this.playScene.input.y, model)
    if (this.addingTower) {
      this.addingTower.preview = true
      this.addingTower.showRange.visible = true
      this.towerGroup.select(undefined)
    }
  }

  preUpdate(time: number, delta: number): void {
    console.log("Update tick")
    const input = this.playScene.input
    if (this.addingTower) {
      const x = PMath.Snap.Floor(input.x, 64) + 32
      const y = PMath.Snap.Floor(input.y, 64) + 32
      const pos = new Point(x, y)
      if (!input.mousePointer.isDown) {
        input.setDefaultCursor("none")

        // Highlight invalid positions
        if (this.map.checkCollision(pos)) {
          this.addingTower.platform.setTint(0xff0000)
        } else {
          this.addingTower.platform.clearTint()
        }
        this.addingTower.setPosition(x, y)
      } else {
        input.setDefaultCursor("default")
        if (this.addingTower.platform.isTinted) {
          this.addingTower.destroy()
          if (this.playScene.sound.get("fail")) {
            this.playScene.sound.play("fail")
          }
        } else {
          this.towerGroup.add(this.addingTower)
          this.map.addTowerMarkAt(pos)
          this.addingTower.preview = false
          if (this.playScene.sound.get("plop")) {
            this.playScene.sound.play("plop")
          }
        }
        this.addingTower.showRange.visible = false
        this.addingTower = undefined
      }
    }
  }
}
