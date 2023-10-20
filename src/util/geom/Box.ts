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
  }
  return { x1: a, y1: a, x2: a, y2: a }
}

export interface IComputed {
  w: number
  h: number
  cx: number
  cy: number
  r: number
  b: number
}

// As insets pulls in the righgt/bottom scaling, else we treat coordinates as w/h values
export function scaleBox(box: IBox, w: number, h: number, x: number = 0, y: number = 0): IBox & IComputed {
  const x1 = box.x1 * w
  const y1 = box.y1 * h
  const x2 = box.x2 * w
  const y2 = box.y2 * h
  const ww = w - (x1 + x2)
  const hh = h - (y1 + y2)
  const cx = x + x1 + ww / 2
  const cy = y + y1 + hh / 2
  const r = x1 + ww
  const b = y1 + hh
  return { x1, y1, x2, y2, w: ww, h: hh, cx, cy, r, b }
}

// Scaleable direction IBox instances
export const BOX = {
  TO_SOUTH: { x1: 0, y1: 0, x2: 0, y2: 1 },
  TO_NORTH: { x1: 0, y1: 1, x2: 0, y2: 0 },
  TO_EAST: { x1: 0, y1: 0, x2: 1, y2: 0 },
  TO_WEST: { x1: 1, y1: 0, x2: 0, y2: 0 },
  TO_SE: { x1: 0, y1: 0, x2: 1, y2: 1 },
  TO_SW: { x1: 1, y1: 0, x2: 0, y2: 1 },
  TO_NW: { x1: 1, y1: 1, x2: 0, y2: 0 },
  TO_NE: { x1: 0, y1: 1, x2: 1, y2: 0 },
}
