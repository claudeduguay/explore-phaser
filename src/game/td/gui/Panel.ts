import { GameObjects, Scene } from "phaser";
import { makePlatform } from "../assets/TextureFactory";
import { IPlatformOptions, corners } from "../assets/PlatformFactory";
import { BOX, box } from "../../../util/geom/Box";

function makeKey(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`
}

export default class Panel extends GameObjects.Container {
  background: GameObjects.NineSlice
  label?: GameObjects.Text

  constructor(scene: Scene, x: number, y: number,
    public w: number, public h: number, public stylePrefix: string = "blue") {
    super(scene, x, y)
    this.background = scene.add.nineslice(0, 0, makeKey(stylePrefix, "panel"),
      undefined, w, h, 16, 16, 16, 16).setOrigin(0)
    this.background.setSize(w, h)
    this.setSize(w, h)// Set bounds
    this.add(this.background)
  }
}

export function makePanelTextures(scene: Scene) {
  const size = { x: 100, y: 100 }
  // Blue panel
  const blue: Partial<IPlatformOptions> = {
    type: "box",
    margin: box(0),
    inset: box(0.1),
    corners: corners("curve-o"),
  }
  makePlatform(scene, "red-panel", {
    size,
    options: {
      ...blue,
      color: ["#996666", "#663333"],
      colorBox: BOX.TO_SE,
    }
  })
  makePlatform(scene, "green-panel", {
    size,
    options: {
      ...blue,
      color: ["#669966", "#336633"],
      colorBox: BOX.TO_SE,
    }
  })
  makePlatform(scene, "blue-panel", {
    size,
    options: {
      ...blue,
      color: ["#666699", "#333366"],
      colorBox: BOX.TO_SE,
    }
  })
  makePlatform(scene, "cyan-panel", {
    size,
    options: {
      ...blue,
      color: ["#669999", "#336666"],
      colorBox: BOX.TO_SE,
    }
  })
  makePlatform(scene, "magenta-panel", {
    size,
    options: {
      ...blue,
      color: ["#996699", "#663366"],
      colorBox: BOX.TO_SE,
    }
  })
  makePlatform(scene, "yellow-panel", {
    size,
    options: {
      ...blue,
      color: ["#999966", "#666633"],
      colorBox: BOX.TO_SE,
    }
  })
  makePlatform(scene, "dark-panel", {
    size,
    options: {
      ...blue,
      color: "rgba(64, 64, 64, 0.9)",
      colorBox: BOX.TO_SE,
    }
  })
}

export function registerPanelFactory() {
  GameObjects.GameObjectFactory.register("panel",
    function (this: GameObjects.GameObjectFactory, x: number, y: number,
      w: number, h: number, stylePrefix?: string): Panel {
      const panel = new Panel(this.scene, x, y, w, h, stylePrefix)
      this.displayList.add(panel)
      return panel
    }
  )
}
