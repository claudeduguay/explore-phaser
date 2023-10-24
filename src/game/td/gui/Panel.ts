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
      color: ["#CC0000", "#990000"],
      colorBox: BOX.TO_SE,
    }
  })
  makePlatform(scene, "green-panel", {
    size,
    options: {
      ...blue,
      color: ["#00CC00", "#009900"],
      colorBox: BOX.TO_SE,
    }
  })
  makePlatform(scene, "blue-panel", {
    size,
    options: {
      ...blue,
      color: ["#0000CC", "#000099"],
      colorBox: BOX.TO_SE,
    }
  })
  makePlatform(scene, "cyan-panel", {
    size,
    options: {
      ...blue,
      color: ["#00CCCC", "#009999"],
      colorBox: BOX.TO_SE,
    }
  })
  makePlatform(scene, "magenta-panel", {
    size,
    options: {
      ...blue,
      color: ["#CC00CC", "#990099"],
      colorBox: BOX.TO_SE,
    }
  })
  makePlatform(scene, "yellow-panel", {
    size,
    options: {
      ...blue,
      color: ["#CCCC00", "#999900"],
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
