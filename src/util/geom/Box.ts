// ----------------------------------------------------------------------------
// BOX DEFINITIONS, ALLOWS SCALING TO COMMON DIRECTIONS, USED BY colorStyle
// ----------------------------------------------------------------------------

export interface IBox {
  x1: number
  y1: number
  x2: number
  y2: number
}

export function box(all: number): IBox
export function box(horz: number, vert: number): IBox
export function box(x1: number, y1: number, x2: number, y2: number): IBox
export function box(a: number, b?: number, c?: number, d?: number): IBox {
  if (a !== undefined && b !== undefined && c !== undefined && d !== undefined) {
    return { x1: a, y1: b, x2: c, y2: d }
  } else if (a !== undefined && b !== undefined) {
    return { x1: a, y1: b, x2: a, y2: b }
  } else {
    return { x1: a, y1: a, x2: a, y2: a }
  }
}

export function scaleBox(box: IBox, w: number, h: number): IBox {
  return { x1: box.x1 * w, y1: box.y1 * h, x2: box.x2 * w, y2: box.y2 * h }
}

// Scaleable direction IBox instances
export const BOX: { [key: string]: IBox } = {
  TO_SOUTH: { x1: 0, y1: 0, x2: 0, y2: 1 },
  TO_NORTH: { x1: 0, y1: 1, x2: 0, y2: 0 },
  TO_EAST: { x1: 0, y1: 0, x2: 1, y2: 0 },
  TO_WEST: { x1: 1, y1: 0, x2: 0, y2: 0 },
  TO_SE: { x1: 0, y1: 0, x2: 1, y2: 1 },
  TO_SW: { x1: 1, y1: 0, x2: 0, y2: 1 },
  TO_NW: { x1: 1, y1: 1, x2: 0, y2: 0 },
  TO_NE: { x1: 0, y1: 1, x2: 1, y2: 0 },
}
