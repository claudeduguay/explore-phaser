import { Scene } from "phaser"
import Maze from "../../../maze/Maze";

export default function generateMap(scene: Scene) {

  const map = scene.make.tilemap({
    tileWidth: 64,
    tileHeight: 64,
    width: 18,
    height: 13
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

  const maze = new Maze(map.width, map.height)
  maze.generate()
  const leaves = maze.get_leaves()
  const left_leaves = leaves.filter(cell => cell.pos.x === 0)
  const right_leaves = leaves.filter(cell => cell.pos.x === map.width)
  const path = maze.get_path_to(left_leaves[0])
  console.log("Leaves:", leaves.map(cell => cell.pos.toString()))
  console.log("Left Leaves:", left_leaves.map(cell => cell.pos.toString()))
  console.log("Right Leaves:", right_leaves.map(cell => cell.pos.toString()))
  console.log("Path:", path.map(cell => cell.pos.toString()))

  for (let x = 0; x < map.width; x++) {
    for (let y = 0; y < map.height; y++) {
      const cell = maze.cell_at(x, y)
      map.putTileAt(cell.connectionsBits(), x, y)
    }
  }

}
