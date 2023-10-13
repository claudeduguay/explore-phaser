import { Scene } from "phaser";
import TreeLayout, { INodeKey, ITree } from "./TreeLayout";
import PhaserLayoutTarget from "./PhaserLayoutTarget";
import { TOWER_INDEX, TOWER_GROUPS } from "../entity/model/ITowerModel";
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

    const root = "bullet"
    const sampleTree: ITree = {
      root,
      edges: new Map<INodeKey, INodeKey[]>()
    }
    const beams = TOWER_GROUPS["beam"].map(t => t.key).filter(k => k !== root)
    const thrown = TOWER_GROUPS["throw"].map(t => t.key).filter(k => k !== root)
    const spray = TOWER_GROUPS["spray"].map(t => t.key).filter(k => k !== root)
    const cloud = TOWER_GROUPS["cloud"].map(t => t.key).filter(k => k !== root)
    const fall = TOWER_GROUPS["fall"].map(t => t.key).filter(k => k !== root)
    const area = TOWER_GROUPS["area"].map(t => t.key).filter(k => k !== root)
    function sequenceFor(node: string, children: string[]) {
      if (children.length > 0) {
        const [head, ...tail] = children
        if (!sampleTree.edges.has(node)) {
          sampleTree.edges.set(node, [])
        }
        sampleTree.edges.get(node)?.push(head)
        sequenceFor(head, tail)
      }
    }
    sequenceFor(root, [...beams, ...thrown])
    sequenceFor(root, spray)
    sequenceFor(root, cloud)
    sequenceFor(root, fall)
    sequenceFor(root, area)

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
      const tower = this.add.tower(100, 100, TOWER_INDEX[key])
      tower.preview = true
      tower.showLabel.visible = true
      layoutTarget.set(key, tower)
    })

    const drawSurface = new PhaserDrawSurface(this)
    const treeLayout = new TreeLayout(sampleTree, drawSurface, layoutTarget)
    treeLayout.margin = new Point(150, 150)
    treeLayout.doLayout()
  }
}
