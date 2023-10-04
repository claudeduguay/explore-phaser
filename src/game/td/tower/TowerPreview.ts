import { Scene, Curves } from "phaser";
import { ALL_TOWERS } from "../model/ITowerModel";
import TDTower from "./TDTower";
import { addLabel } from "../../../util/TextUtil";
import TDEnemy from "../enemy/TDEnemy";
import { WEAK_ENEMY } from "../model/IEnemyModel";

// Note: May need to make this a scene to manage the fact that 
// behaviors add elements relative to the tower position in the scene
export default class TowerPreview extends Scene {
  constructor(public main: Scene, public x: number = 0, public y: number = x) {
    super({ key: "tower_preview" })
  }

  create() {
    console.log("Preview offset:", this.x, this.y)

    const vBox = 220
    const hBox = 170
    const g = this.add.graphics()
    g.fillStyle(0x111111, 1.0)
    g.lineStyle(2, 0xFFFFFF, 1.0)
    g.fillRoundedRect(this.x, this.y, hBox * 6, vBox * 3 + 20)
    g.strokeRoundedRect(this.x, this.y, hBox * 6, vBox * 3 + 20)
    this.add.existing(g)

    ALL_TOWERS.forEach((model, i) => {
      const row = Math.floor(i / 6)
      const col = i % 6
      const x = this.x + hBox / 2 + hBox * col
      const y = this.y + 150 + vBox * row
      const t = new TDTower(this, x, y, model)
      t.preview = true
      this.add.existing(t)
      addLabel(this, x, y + 40, model.name.split(" ")[0], "center")
      const e = new TDEnemy(this, x, y - 100, WEAK_ENEMY.meta.body, WEAK_ENEMY)
      t.targets = [e]
      this.add.existing(e)
    })
  }

}
