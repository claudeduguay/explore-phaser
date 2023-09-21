import Point from "./Point"

export const BITS_NORTH = 0b0001
export const BITS_SOUTH = 0b0010
export const BITS_WEST = 0b0100
export const BITS_EAST = 0b1000

export const BITS_MAP = new Map<Point, number>([
  [Point.NORTH, BITS_NORTH],
  [Point.SOUTH, BITS_SOUTH],
  [Point.WEST, BITS_WEST],
  [Point.EAST, BITS_EAST]
])

export default BITS_MAP
