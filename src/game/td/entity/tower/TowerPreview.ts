import { Scene } from "phaser";
import { TOWER_LIST } from "../model/ITowerModel";
import TDTower, { PreviewType } from "./TDTower";
import TDEnemy from "../enemy/TDEnemy";
import { ENEMY_LIST } from "../model/IEnemyModel";

// Note: May need to make this a scene to manage the fact that 
// behaviors add elements relative to the tower position in the scene
export default class TowerPreview extends Scene {
  constructor(public main: Scene, public x: number = 0, public y: number = x) {
    super({ key: "tower_preview" })
  }

  create() {
    const vBox = 175
    const hBox = 170
    const g = this.add.graphics()
    g.fillStyle(0x111111, 1.0)
    g.lineStyle(2, 0xFFFFFF, 1.0)
    g.fillRoundedRect(this.x, this.y, hBox * 6, vBox * 4 + 20)
    g.strokeRoundedRect(this.x, this.y, hBox * 6, vBox * 4 + 20)
    this.add.existing(g)

    TOWER_LIST.forEach((model, i) => {
      const row = Math.floor(i / 6)
      const col = i % 6
      const x = this.x + hBox / 2 + hBox * col
      const y = this.y + 110 + vBox * row
      const tower = new TDTower(this, x, y, model)
      tower.preview = PreviewType.Preview
      tower.showLabel.visible = true
      this.add.existing(tower)
      // addLabel(this, x, y + 40, model.name.split(" ")[0], "center")
      tower.targeting.current = [new TDEnemy(this, x, y - 100, ENEMY_LIST[0])]
    })
  }

}
