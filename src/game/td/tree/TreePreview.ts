import { Scene } from "phaser";
import TreeLayout, { INodeKey, ITree } from "./TreeLayout";
import PhaserLayoutTarget from "./PhaserLayoutTarget";
import { TOWER_MODELS } from "../entity/model/ITowerModel";
import PhaserDrawSurface from "./PhaserDrawSurface";
import Point from "../../../util/Point";

export default class TreePreview extends Scene {
  constructor(public main: Scene, public x: number = 0, public y: number = x) {
    super({ key: "tree_preview" })
  }

  create() {
    const vBox = 220
    const hBox = 170
    const g = this.add.graphics()
    g.fillStyle(0x111111, 1.0)
    g.lineStyle(2, 0xFFFFFF, 1.0)
    g.fillRoundedRect(this.x, this.y, hBox * 6, vBox * 3 + 20)
    g.strokeRoundedRect(this.x, this.y, hBox * 6, vBox * 3 + 20)
    this.add.existing(g)

    const sampleTree: ITree = {
      root: "lazer",
      edges: new Map<INodeKey, INodeKey[]>()
    }
    sampleTree.edges.set("lazer", ["plasma", "lightning"])
    sampleTree.edges.set("plasma", ["bullet"])
    sampleTree.edges.set("bullet", ["missile"])
    sampleTree.edges.set("missile", ["rain"])
    sampleTree.edges.set("rain", ["snow"])
    sampleTree.edges.set("lightning", ["flame", "freeze"])
    sampleTree.edges.set("flame", ["fire", "ice"])
    sampleTree.edges.set("fire", ["poison"])
    sampleTree.edges.set("poison", ["boost"])
    sampleTree.edges.set("ice", ["impact"])
    sampleTree.edges.set("impact", ["slow"])
    sampleTree.edges.set("freeze", ["smoke", "shock"])

    const nodeKeySet = [...sampleTree.edges.entries()].reduce((prev, [node, children]) => {
      prev.add(node)
      for (let child of children) {
        prev.add(child)
      }
      return prev
    }, new Set<INodeKey>())
    const keysArray = [...nodeKeySet]

    const layoutTarget = new PhaserLayoutTarget(64, 64)
    keysArray.forEach((key: string, i: number) => {
      const tower = this.add.tower(100, 100, TOWER_MODELS[key])
      layoutTarget.set(key, tower)
    })

    const drawSurface = new PhaserDrawSurface(this)
    const treeLayout = new TreeLayout(sampleTree, drawSurface, layoutTarget)
    treeLayout.margin = new Point(150, 150)
    treeLayout.doLayout()
  }
}
