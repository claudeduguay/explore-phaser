type Point = { x: number, y: number }

export default class Grid<T = any> {

  array: Array<T> = []

  constructor(public rows: number, public cols: number) {
    this.array = new Array<T>(rows * cols)
  }

  index(x: number, y: number): number {
    return x + y * this.cols
  }

  get_at(x: number, y: number) {
    return this.array[this.index(x, y)]
  }

  set_at(x: number, y: number, data: T) {
    this.array[this.index(x, y)] = data
  }

  get_atv(pos: Point) {
    var p = { x: Math.floor(pos.x), y: Math.floor(pos.y) }
    return this.get_at(p.x, p.y)
  }

  set_atv(pos: Point, data: T) {
    var p = { x: Math.floor(pos.x), y: Math.floor(pos.y) }
    this.set_at(p.x, p.y, data)
  }

  get_row(y: number): Array<T> {
    const cells: Array<T> = []
    for (let x = 0; x < this.cols; x++) {
      cells.push(this.get_at(x, y))
    }
    return cells
  }

  get_col(x: number): Array<T> {
    var cells = []
    for (let y = 0; y < this.rows; y++) {
      cells.push(this.get_at(x, y))
    }
    return cells
  }

  same(other: Grid) {
    return this.array === other.array
  }

  index_of(value: T) {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.get_at(x, y) === value) {
          return { x, y }
        }
      }
    }
    return null
  }

  toString() {
    return this.array.toString()
  }

}