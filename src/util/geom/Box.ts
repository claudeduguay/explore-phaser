// ----------------------------------------------------------------------------
// BOX DEFINITIONS, ALLOWS SCALING TO COMMON DIRECTIONS, USED BY colorStyle
// ----------------------------------------------------------------------------

export interface IBox {
  type: "fraction" | "pixel"
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
    return { type: "fraction", x1: a, y1: b, x2: c, y2: d }
  } else if (a !== undefined && b !== undefined) {
    return { type: "fraction", x1: a, y1: b, x2: a, y2: b }
  }
  return { type: "fraction", x1: a, y1: a, x2: a, y2: a }
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
  const isFraction = box.type === "fraction"
  const x1 = box.x1 * (isFraction ? w : 1)
  const y1 = box.y1 * (isFraction ? h : 1)
  const x2 = box.x2 * (isFraction ? w : 1)
  const y2 = box.y2 * (isFraction ? h : 1)
  const ww = w - (x1 + x2)
  const hh = h - (y1 + y2)
  const cx = x + x1 + ww / 2
  const cy = y + y1 + hh / 2
  const r = x + x1 + ww
  const b = y + y1 + hh
  return { type: "pixel", x1, y1, x2, y2, w: ww, h: hh, cx, cy, r, b }
}

// Scaleable direction IBox instances
export const BOX: { [key: string]: IBox } = {
  TO_SOUTH: { type: "fraction", x1: 0, y1: 0, x2: 0, y2: 1 },
  TO_NORTH: { type: "fraction", x1: 0, y1: 1, x2: 0, y2: 0 },
  TO_EAST: { type: "fraction", x1: 0, y1: 0, x2: 1, y2: 0 },
  TO_WEST: { type: "fraction", x1: 1, y1: 0, x2: 0, y2: 0 },
  TO_SE: { type: "fraction", x1: 0, y1: 0, x2: 1, y2: 1 },
  TO_SW: { type: "fraction", x1: 1, y1: 0, x2: 0, y2: 1 },
  TO_NW: { type: "fraction", x1: 1, y1: 1, x2: 0, y2: 0 },
  TO_NE: { type: "fraction", x1: 0, y1: 1, x2: 1, y2: 0 },
}
