import { Scene, GameObjects, Types } from "phaser";
import Point from "./geom/Point";

export default class GraphicsContainer extends GameObjects.Graphics {

  g!: GameObjects.Graphics
  pos = new Point()

  constructor(scene: Scene, options?: Types.GameObjects.Graphics.Options) {
    super(scene, options)
    this.pos = new Point(options?.x || 0, options?.y || 0)
    // this.addToUpdateList()
  }

  // preUpdate() {
  //   // if (this.parentContainer) {
  //   if (this.parentContainer && this.x !== this.parentContainer.x && this.y !== this.parentContainer.y) {
  //     console.log("Graphics container moved")
  //     this.setPosition(this.parentContainer.x, this.parentContainer.y)
  //   }
  //   // }
  //   // console.log("DynamicGraphics update")
  // }
}
