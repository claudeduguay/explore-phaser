import { Scene, Tilemaps } from "phaser"
import Point from "../../../../util/Point";
import IMapModel from "./IMapModel";
import BehaviorContainer from "../../behavior/BehaviorContainer";


export default function makeTileMap(scene: Scene, model: IMapModel, origin: Point, cellSize: Point, rows: number, cols: number) {
  const map = new TDTileMap(scene, origin.x, origin.y, cellSize, rows, cols)
  map.setModel(model)
  scene.add.existing(map)
}


export class TDTileMap extends BehaviorContainer {

  map!: Tilemaps.Tilemap
  layer!: Tilemaps.TilemapLayer

  constructor(scene: Scene, x: number, y: number, cellSize = new Point(64, 64), rows: number, cols: number) {
    super(scene, x, y)

    const map = scene.make.tilemap({
      tileWidth: cellSize.x,
      tileHeight: cellSize.y,
      width: cols * 2,
      height: rows * 2
    })
    this.map = map

    const tileset = map.addTilesetImage('path_tiles', 'path_tiles')
    if (!tileset) {
      throw new Error("Failed to create tileset")
    }

    const layer = map.createBlankLayer('Path Layer', tileset, x, y)
    if (!layer) {
      throw new Error("Failed to create layer")
    }
    this.layer = layer
    this.add(layer)
  }

  setModel(model: IMapModel) {
    this.layer.fill(0x1111 + 1)  // Fill with black tiles
    model.path.forEach(cell => {
      this.map.putTileAt(cell.bits, cell.pos.x, cell.pos.y)
    })
  }
}
