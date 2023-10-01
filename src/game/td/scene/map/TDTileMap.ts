import { Scene } from "phaser"
import Point from "../../../../util/Point";
import IMapModel from "./IMapModel";


export default function makeTileMap(scene: Scene, model: IMapModel, origin: Point, cellSize: Point, rows: number, cols: number) {

  const map = scene.make.tilemap({
    tileWidth: cellSize.x,
    tileHeight: cellSize.y,
    width: cols * 2,
    height: rows * 2
  })

  const tileset = map.addTilesetImage('path_tiles', 'path_tiles')
  if (!tileset) {
    throw new Error("Failed to create tileset")
  }

  const layer = map.createBlankLayer('Map Layer', tileset)
  if (!layer) {
    throw new Error("Failed to create layer")
  }
  layer.fill(20)  // Fill with black tiles
  layer.setPosition(origin.x, origin.y)

  model.path.forEach(cell => {
    map.putTileAt(cell.bits, cell.pos.x, cell.pos.y)
  })

  return layer
}
