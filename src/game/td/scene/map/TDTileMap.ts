import { Scene } from "phaser"
import Point from "../../../../util/Point";
import Cell from "../../../../maze/Cell";
import { BITS_EAST, BITS_NORTH, BITS_SOUTH, BITS_WEST } from "../../../../util/Cardinal";


export default function makeTileMap(scene: Scene, cells: Cell[], origin: Point, cellSize: Point, rows: number, cols: number) {

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

  cells.forEach(cell => {
    map.putTileAt(cell.connectionsBits(), cell.pos.x * 2, cell.pos.y * 2)
    if (cell.links.get(Point.SOUTH) !== null) {
      map.putTileAt(BITS_NORTH + BITS_SOUTH, cell.pos.x * 2, cell.pos.y * 2 + 1)
    }
    if (cell.links.get(Point.NORTH) !== null) {
      map.putTileAt(BITS_NORTH + BITS_SOUTH, cell.pos.x * 2, cell.pos.y * 2 - 1)
    }
    if (cell.links.get(Point.EAST) != null) {
      map.putTileAt(BITS_WEST + BITS_EAST, cell.pos.x * 2 + 1, cell.pos.y * 2)
    }
    if (cell.links.get(Point.WEST) != null) {
      map.putTileAt(BITS_WEST + BITS_EAST, cell.pos.x * 2 - 1, cell.pos.y * 2)
    }
  })
}
