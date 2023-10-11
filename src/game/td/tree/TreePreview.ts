import { Scene } from "phaser";
import TreeLayout, { INodeKey, ITree } from "./TreeLayout";
import PhaserLayoutTarget from "./PhaserLayoutTarget";
import { ALL_TOWERS } from "../entity/model/ITowerModel";
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
      root: "root",
      edges: new Map<INodeKey, INodeKey[]>()
    }
    sampleTree.edges.set("root", ["left", "right"])
    sampleTree.edges.set("left", ["left-a", "left-b"])
    sampleTree.edges.set("right", ["right-a", "right-b"])
    sampleTree.edges.set("right-a", ["right-a1", "right-a2"])

    const nodeKeySet = [...sampleTree.edges.entries()].reduce((prev, [node, children]) => {
      prev.add(node)
      for (let child of children) {
        prev.add(child)
      }
      return prev
    }, new Set<INodeKey>())
    const keysArray = [...nodeKeySet]

    const layoutTarget = new PhaserLayoutTarget()
    keysArray.forEach((key: string, i: number) => {
      const sprite = this.add.sprite(100, 100, `${ALL_TOWERS[i].meta.key}-platform`)
      layoutTarget.set(key, sprite)
      this.add.existing(sprite)
    })

    const drawSurface = new PhaserDrawSurface(this)
    const treeLayout = new TreeLayout(sampleTree, drawSurface, layoutTarget)
    treeLayout.margin = new Point(150, 150)
    treeLayout.doLayout()
  }
}
