import Point from "../../../../util/Point"

// Minimal information model for constructing a TileMap view

export interface IMapCell {
  bits: number
  pos: Point
}

export type IMapPath = Array<IMapCell>

export interface IMapModel {
  path: IMapPath
}

export default IMapModel
