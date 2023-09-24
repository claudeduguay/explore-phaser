import { Scene, GameObjects } from "phaser";
import { ALL_TOWERS } from "../model/ITowerModel";
import TDTower from "./TDTower";
import { addLabel } from "../../../util/TextUtil";
import Point from "../../../util/Point";

export default class TowerPreview extends GameObjects.Container {
  constructor(public scene: Scene, public x: number = 0, public y: number = x) {
    super(scene)
    const g = scene.add.graphics()
    g.fillStyle(0xffffff, 1.0)
    g.fillRoundedRect(0, 0, ALL_TOWERS.length * 100, 115)
    this.add(g)

    ALL_TOWERS.forEach((model, i) => {
      const p = new Point(50 + i * 100, 35 + 10)
      const t = new TDTower(scene, p.x, p.y, model)
      this.add(t)
      const l = addLabel(scene, p.x, p.y + 35, model.name.split(" ")[0], "center")
      this.add(l)
    })
  }
}
