import Grid from "./Grid"
import Cell from "./Cell"
import Point from "../util/Point"
import { shuffle } from "../util/ArrayUtil"

export default class Maze {

  grid: Grid

  static randRange(min: number, max: number) {
    return min + Math.random() * (max - min)
  }

  constructor(rows: number, cols: number) {
    this.grid = new Grid(rows, cols)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        this.grid.set_at(x, y, new Cell(x, y))
      }
    }
  }

  cell_at(x: number, y: number): Cell {
    return this.grid.get_at(x, y)
  }

  cell_atv(pos: Point): Cell {
    return this.grid.get_atv(pos)
  }

  get_row(y: number): Array<Cell> {
    return this.grid.get_row(y)
  }

  get_col(x: number): Array<Cell> {
    return this.grid.get_col(x)
  }

  get_neighbours(cell: Cell): Array<Cell> {
    const neighbours: Cell[] = []
    if (cell.pos.y > 0) { // North
      const neighbour = this.cell_atv(cell.pos.plus(Point.UP))
      neighbours.push(neighbour)
    }
    if (cell.pos.y < this.grid.rows - 1) { // South
      const neighbour = this.cell_atv(cell.pos.plus(Point.DOWN))
      neighbours.push(neighbour)
    }
    if (cell.pos.x > 0) { // West
      const neighbour = this.cell_atv(cell.pos.plus(Point.LEFT))
      neighbours.push(neighbour)
    }
    if (cell.pos.x < this.grid.cols - 1) { // East
      const neighbour = this.cell_atv(cell.pos.plus(Point.RIGHT))
      neighbours.push(neighbour)
    }
    return neighbours
  }

  random_cell(): Cell {
    const x = Math.floor(Maze.randRange(this.grid.cols * 0.25, this.grid.cols * 0.75))
    const y = Math.floor(Maze.randRange(this.grid.rows * 0.25, this.grid.rows * 0.75))
    return this.cell_at(x, y)
  }

  generate(start: Cell = this.random_cell()): Cell {
    return this.walkFrom(start, 0)
  }

  walkFrom(cell: Cell, depth: number) {
    cell.visited = true
    cell.depth = depth
    const neighbors = this.get_neighbours(cell)
    shuffle(neighbors)
    for (let neighbor of neighbors) {
      if (!neighbor.visited) {
        cell.link(neighbor, true)
      }
      this.walkFrom(neighbor, depth + 1)
    }
    return cell
  }
}
