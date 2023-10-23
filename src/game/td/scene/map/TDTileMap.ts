import { Scene, Tilemaps } from "phaser"
import Point from "../../../../util/geom/Point";
import IPathModel from "./IPathModel";
import BehaviorContainer from "../../behavior/core/BehaviorContainer";
import { lerpInt } from "../../../../util/MathUtil";

export interface IMapConfig {
  cellSize: Point
  rows: number
  cols: number
}

export const DEFAULT_CONFIG = {
  cellSize: new Point(64, 64),
  rows: 6,
  cols: 9
}

export default function makeTileMap(scene: Scene, x: number, y: number, model: IPathModel, config: IMapConfig = DEFAULT_CONFIG) {
  const map = new TDTileMap(scene, x, y, config)
  map.setModel(model)
  scene.add.existing(map)
}


export class TDTileMap extends BehaviorContainer {

  map!: Tilemaps.Tilemap
  landLayer!: Tilemaps.TilemapLayer
  pathLayer!: Tilemaps.TilemapLayer

  constructor(scene: Scene, x: number, y: number, { cellSize, rows, cols }: IMapConfig) {
    super(scene, x, y)

    const map = scene.make.tilemap({
      tileWidth: cellSize.x,
      tileHeight: cellSize.y,
      width: cols * 2,
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

    const landLayer = map.createBlankLayer('landscape', [pathTiles, landTiles], x, y)
    if (!landLayer) {
      throw new Error("Failed to create layer")
    }
    this.landLayer = landLayer
    this.add(landLayer)

    const pathLayer = map.createBlankLayer('Path Layer', [pathTiles, landTiles], x, y)
    if (!pathLayer) {
      throw new Error("Failed to create layer")
    }
    this.pathLayer = pathLayer
    this.add(pathLayer)

    console.log("TileSets:", map.tilesets)
  }

  setModel(path: IPathModel) {
    // This is non-deterministic and so may update each time?
    this.landLayer.forEachTile(
      (tile, i) => tile.index = lerpInt(16, 20, Math.random()))
    path.forEach(cell => {
      this.pathLayer.putTileAt(cell.bits, cell.pos.x, cell.pos.y + 1)
    })
  }
}
