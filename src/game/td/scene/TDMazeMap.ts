import { Scene } from "phaser"
import Maze from "../../../maze/Maze";
import Point from "../../../util/Point";
import Cell from "../../../maze/Cell";

export function makeTileMap(scene: Scene, maze: Maze, origin: Point, cellSize: Point, rows: number, cols: number) {

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

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const cell = maze.cell_at(x, y)
      map.putTileAt(cell.connectionsBits(), x * 2, y * 2)
    }
  }
}

export function generateLevel(rows: number, cols: number) {
  const maze = new Maze(rows, cols)
  const right = new Point(cols - 1, Math.floor(Math.random() * (rows - 1)))
  maze.generate(maze.cell_atv(right))
  const leaves = maze.get_leaves()
  const left_leaves = leaves.filter(cell => cell.pos.x === 0)
  // const right_leaves = leaves.filter(cell => cell.pos.x === cols)
  return { path: maze.get_path_to(left_leaves[0]), maze }
}

export default function generateMap(scene: Scene, showUndeyingMaze: boolean = false) {

  const origin = new Point(10, 50)
  const cellSize = new Point(64, 64)
  const rows = 6 //11
  const cols = 9 //17

  const { path, maze } = generateLevel(rows, cols)
  if (showUndeyingMaze) {
    makeTileMap(scene, maze, origin, cellSize, rows, cols)
  }
  renderPath(scene, path, origin, cellSize)
}

function renderPath(scene: Scene, path: Cell[], origin: Point, cellSize: Point) {
  const centering = new Point(32, 32)
  const points = path.map(cell => cell.pos.times(new Point(2, 2)).times(cellSize).plus(origin).plus(centering))
  if (points.length) {
    const curve = new Phaser.Curves.Path()
    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      if (i === 0) {
        curve.moveTo(p.x, p.y)
      } else {
        curve.lineTo(p.x, p.y)
      }
    }
    const radius = 32
    const g = scene.add.graphics({ lineStyle: { color: 0x00FF00, alpha: 1.0, width: radius } })
    curve.draw(g)
    // Round corners overlay
    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      scene.add.ellipse(p.x, p.y, radius, radius, 0x00FF00)
    }
  } else {
    console.error("Path is empty")
  }
}
