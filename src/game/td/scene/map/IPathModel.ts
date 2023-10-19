import Cell from "../../../../maze/Cell"
import { BITS_EAST, BITS_NORTH, BITS_SOUTH, BITS_WEST } from "../../../../util/Cardinal"
import Point from "../../../../util/geom/Point"

// Minimal information model for constructing a TileMap view

export interface IMapCell {
  bits: number
  pos: Point
}

export type IPathModel = Array<IMapCell>
export default IPathModel

// Todo: We will use this to construct the mapped model path
export function interpolateMidPoints(cells: IMapCell[]): IMapCell[] {
  const result: IMapCell[] = []
  for (let i = 0; i < cells.length; i++) {
    if (i > 0) {
      const prev = cells[i - 1].pos
      const current = cells[i].pos
      const diff = current.minus(prev).div(Point.TWO)
      const bits = diff.x === 0 ? BITS_NORTH + BITS_SOUTH : BITS_WEST + BITS_EAST
      result.push({ bits, pos: prev.plus(diff) })
    }
    result.push(cells[i])
  }
  return result
}

// Convert cell array intp an IMapModel
export function asPathModel(cells: Cell[]): IPathModel {
  return interpolateMidPoints(
    cells.map((cell: Cell) => ({ bits: cell.connectionsBits(), pos: cell.pos.times(Point.TWO) })))
}
