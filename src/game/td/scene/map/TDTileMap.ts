import { GameObjects, Scene, Tilemaps } from "phaser"
import Point, { IPointLike } from "../../../../util/geom/Point";
import IPathModel from "./IPathModel";
import { lerpInt } from "../../../../util/MathUtil";

export interface IMapConfig {
  cellSize: Point
  rows: number
  cols: number
}

export const DEFAULT_CONFIG = {
  cellSize: new Point(64, 64),
  rows: 6,
  cols: 8
}

export default function makeTileMap(scene: Scene, x: number, y: number, model: IPathModel, config: IMapConfig = DEFAULT_CONFIG) {
  const map = new TDTileMap(scene, x, y, config)
  map.setModel(model)
  scene.add.existing(map)
  return map
}


export class TDTileMap extends GameObjects.Container {

  map!: Tilemaps.Tilemap
  landLayer!: Tilemaps.TilemapLayer
  pathLayer!: Tilemaps.TilemapLayer
  markLayer!: Tilemaps.TilemapLayer

  path?: IPathModel

  constructor(scene: Scene, x: number, y: number, { cellSize, rows, cols }: IMapConfig) {
    super(scene, x, y)

    const map = scene.make.tilemap({
      tileWidth: cellSize.x,
      tileHeight: cellSize.y,
      width: 2 + cols * 2,
      height: 1 + rows * 2
    })
    this.map = map


    const pathTiles = map.addTilesetImage('pathTiles', 'path_tiles')
    if (!pathTiles) {
      throw new Error("Failed to create tileset")
    }

    // Start tile index offset at 16, after the path tiles
    const landTiles = map.addTilesetImage('landTiles', 'landscape', 64, 64, 0, 0, 16)
    if (!landTiles) {
      throw new Error("Failed to create landscape tileset")
    }

    // Assigning all tilemaps to each layer is a workaround for bug: 6353
    // See: https://github.com/photonstorm/phaser/issues/6353
    // Workaround: https://github.com/photonstorm/phaser/issues/5931
    const tileMaps = [pathTiles, landTiles]

    const landLayer = map.createBlankLayer('Land Layer', tileMaps, x, y)
    if (!landLayer) {
      throw new Error("Failed to create land layer")
    }
    this.landLayer = landLayer
    this.add(landLayer)

    const pathLayer = map.createBlankLayer('Path Layer', tileMaps, x, y)
    if (!pathLayer) {
      throw new Error("Failed to create path layer")
    }
    this.pathLayer = pathLayer
    this.add(pathLayer)

    // The Mark Layer is used to identify occupied tower cells for collision-detection
    // All added towers now set the corresponding tile to 0 
    // (-1 is unassigned and 0 is a blank tile from pathTiles)
    const markLayer = map.createBlankLayer('Mark Layer', tileMaps, x, y)
    if (!markLayer) {
      throw new Error("Failed to create mark layer")
    }
    this.markLayer = markLayer
    this.add(markLayer)
  }

  setModel(path: IPathModel) {
    this.path = path
    this.landLayer.fill(-1)
    this.landLayer.forEachTile(
      // This is non-deterministic and so would change each time we call setModel?
      (tile, i) => tile.index = lerpInt(16, 20, Math.random()))
    this.pathLayer.fill(-1)
    path.forEach(cell => {
      this.pathLayer.putTileAt(cell.bits, cell.pos.x + 1, cell.pos.y + 1)
    })
    this.markLayer.fill(-1)
  }

  addTowerMarkAt(pos: IPointLike) {
    const tilePos = this.map.worldToTileXY(pos.x, pos.y)
    if (tilePos) {
      this.markLayer.putTileAt(0, tilePos.x, tilePos.y)
    }
  }

  clearTowerMarkAt(pos: IPointLike) {
    const tilePos = this.map.worldToTileXY(pos.x, pos.y)
    if (tilePos) {
      this.markLayer.putTileAt(-1, tilePos.x, tilePos.y)
    }
  }

  checkCollision(pos: IPointLike) {
    const tilePos = this.map.worldToTileXY(pos.x, pos.y)
    if (tilePos) {
      return this.pathLayer.hasTileAt(tilePos.x, tilePos.y) ||
        this.markLayer.hasTileAt(tilePos.x, tilePos.y)
    }
    return false
  }

  getPathPoints() {
    if (this.path) {
      return this.path.map(cell => {
        const pos = this.map.tileToWorldXY(cell.pos.x + 1, cell.pos.y + 1) || new Point()
        return new Point(pos.x + 32, pos.y + 32)
      })
    }
    return []
  }
}
