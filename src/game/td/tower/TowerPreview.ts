import { Scene, GameObjects, Curves } from "phaser";
import { ALL_TOWERS } from "../model/ITowerModel";
import TDTower from "./TDTower";
import { addLabel } from "../../../util/TextUtil";
import TDEnemy from "../enemy/TDEnemy";
import { WEAK_ENEMY } from "../model/IEnemyModel";

// Note: May need to make this a scene to manage the fact that 
// behaviors add elements relative to the tower position in the scene
export default class TowerPreview extends GameObjects.Container {
  constructor(public scene: Scene, public x: number = 0, public y: number = x) {
    super(scene)

    const g = scene.add.graphics()
    g.fillStyle(0x333333, 0.9)
    g.fillRoundedRect(0, 0, 160 * 6, 180 * 3)
    this.add(g)

    ALL_TOWERS.forEach((model, i) => {
      const row = Math.floor(i / 6)
      const col = i % 6
      const x = 75 + col * 160
      const y = 100 + 180 * row
      const t = new TDTower(scene, x, y, model)
      t.preview = true
      this.add(t)
      const l = addLabel(scene, x, y + 35, model.name.split(" ")[0], "center")
      this.add(l)
      const e = new TDEnemy(scene, x, y - 64, WEAK_ENEMY.meta.body, new Curves.Path(), WEAK_ENEMY)
      t.targets = [e]
      this.add(e)
    })
  }
}
