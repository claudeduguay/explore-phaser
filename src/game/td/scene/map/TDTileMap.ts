import { Scene } from "phaser"
import Point from "../../../../util/Point";
import { hasBits, BITS_EAST, BITS_NORTH, BITS_SOUTH, BITS_WEST } from "../../../../util/Cardinal";
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

  // Lets use use a Point rather than separate coordinates
  function putTileAt(bits: number, pos: Point) {
    map.putTileAt(bits, pos.x, pos.y)
  }

  model.path.forEach(cell => {
    const pos = cell.pos.times(Point.TWO)
    putTileAt(cell.bits, pos)
    // Insert intermediate (straight connection) cells
    if (hasBits(cell.bits, BITS_SOUTH)) {
      putTileAt(BITS_NORTH + BITS_SOUTH, pos.plus(Point.SOUTH))
    }
    if (hasBits(cell.bits, BITS_NORTH)) {
      putTileAt(BITS_NORTH + BITS_SOUTH, pos.plus(Point.NORTH))
    }
    if (hasBits(cell.bits, BITS_EAST)) {
      putTileAt(BITS_WEST + BITS_EAST, pos.plus(Point.EAST))
    }
    if (hasBits(cell.bits, BITS_WEST)) {
      putTileAt(BITS_WEST + BITS_EAST, pos.plus(Point.WEST))
    }
  })
}
