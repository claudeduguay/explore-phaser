import { Curves, Scene } from "phaser"
import Cell from "../../../../maze/Cell"
import Maze from "../../../../maze/Maze"
import Point from "../../../../util/Point"
import IMapModel from "./IMapModel"

// Generate a maze, add entry/exit cells and, optionally, Prune unused cells
export function generatePath(rows: number, cols: number, prunePath: boolean = true) {
  const maze = new Maze(rows, cols)
  const random = (x: number) => new Point(x, Math.floor(Math.random() * (rows - 1)))
  const left = maze.cell_atv(random(0))
  const right = maze.cell_atv(random(cols - 1))
  maze.generate(right)
  const path = maze.get_path_to(left)

  // Add a head cell
  const head = new Cell(-1, path[0].pos.y)
  head.parent = path[0]
  head.rechain(head)
  path.unshift(head)

  // Add a tail cell
  const last = path.length - 1
  const tail = new Cell(path[last].pos.x + 1, path[last].pos.y)
  path[last].parent = tail
  head.rechain(tail)
  path.push(tail)

  // Remove non-maze cells
  if (prunePath) {
    path.forEach((cell: Cell) => cell.parent?.rechain(cell))
  }

  return { path, maze }
}

// Create a curve with scaled points that follow the path
export function renderPath(scene: Scene, model: IMapModel, origin: Point, cellSize: Point) {
  const centering = new Point(32, 32)
  const points = model.path.map(cell => cell.pos.times(cellSize).plus(origin).plus(centering))
  const curve = new Curves.Path()
  for (let i = 0; i < points.length; i++) {
    const p = points[i]
    if (i === 0) {
      curve.moveTo(p.x, p.y)
    } else {
      curve.lineTo(p.x, p.y)
    }
  }
  return { curve, points }
}
