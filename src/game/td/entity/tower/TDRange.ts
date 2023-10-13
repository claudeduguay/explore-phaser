import { Scene, GameObjects } from "phaser";
import { makeEllipse } from "../../assets/TextureFactory";

export default class TDRange extends GameObjects.Container {

  constructor(scene: Scene, x: number, y: number, name: string, range: number) {
    super(scene, x, y)

    // Cache a texture, based on the range, if not present
    const ellipseKey = `range-${range}`
    if (!scene.textures.exists(ellipseKey)) {
      makeEllipse(scene, ellipseKey, range * 2, range * 2, { color: "red", alpha: 0.1 })
    }

    const shape = scene.add.sprite(0, 0, ellipseKey)
    this.add(shape)
  }

}
