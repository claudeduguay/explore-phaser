import { Curves, Scene } from "phaser"
import Cell from "../../../../maze/Cell"
import Maze from "../../../../maze/Maze"
import Point from "../../../../util/geom/Point"
import { sceneSize } from "../../../../util/SceneUtil"
import { shuffle } from "../../../../util/ArrayUtil"

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

// const DOWN_ONE = new Point(0, 1)
// const CENTERING = new Point(32, 32)

// Create a curve with scaled points that follow the path
export function createCurve(points: Point[]) {
  const curve = new Curves.Path()
  for (let i = 0; i < points.length; i++) {
    const p = points[i]
    if (i === 0) {
      curve.moveTo(p.x, p.y)
    } else {
      curve.lineTo(p.x, p.y)
    }
  }
  return curve
}

export function generatePathAdjacentPositions(scene: Scene, pathPoints: Point[]): Point[] {
  const { w, h } = sceneSize(scene)
  const WEST = new Point(-64, 0)
  const EAST = new Point(64, 0)
  const NORTH = new Point(0, -64)
  const SOUTH = new Point(0, 64)
  const inRange = ({ x, y }: Point) => x > 0 && x < w - 64 * 2 && y > 64 && y < h - 64 * 2
  const pointSet = new Set<string>(pathPoints.map(p => p.toKey()))
  const towerSet = new Set<string>()
  const positions: Point[] = []
  for (let point of pathPoints) {
    // Include only even cell positions
    if (Math.floor(point.x / 64) % 2 === 0 && Math.floor(point.y / 64) % 2 === 0) {
      const west = point.plus(WEST)
      const east = point.plus(EAST)
      const north = point.plus(NORTH)
      const south = point.plus(SOUTH)
      // Avoid recomputing keys each time
      const westKey = west.toKey()
      const eastKey = east.toKey()
      const northKey = north.toKey()
      const southKey = south.toKey()
      // console.log("Adjacencies:", point.toKey(), westKey, eastKey, northKey, southKey)

      if (inRange(west) && !pointSet.has(westKey) && !towerSet.has(westKey)) {
        towerSet.add(westKey)
        positions.push(west)
      }
      if (inRange(east) && !pointSet.has(eastKey) && !towerSet.has(eastKey)) {
        towerSet.add(eastKey)
        positions.push(east)
      }
      if (inRange(north) && !pointSet.has(northKey) && !towerSet.has(northKey)) {
        towerSet.add(northKey)
        positions.push(north)
      }
      if (inRange(south) && !pointSet.has(southKey) && !towerSet.has(southKey)) {
        towerSet.add(southKey)
        positions.push(south)
      }
    }
  }
  // console.log("Positions:", positions.map(x => x.toString()))
  shuffle(positions)
  return positions
}