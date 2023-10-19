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
  backgroundLayer!: Tilemaps.TilemapLayer
  mainLayer!: Tilemaps.TilemapLayer

  constructor(scene: Scene, x: number, y: number, { cellSize, rows, cols }: IMapConfig) {
    super(scene, x, y)

    const map = scene.make.tilemap({
      tileWidth: cellSize.x,
      tileHeight: cellSize.y,
      width: cols * 2,
      height: rows * 2
    })
    this.map = map

    const tileset = map.addTilesetImage('path_tiles', 'path_tiles')
    if (!tileset) {
      throw new Error("Failed to create tileset")
    }
    // console.log("Tileset index:", map.getTilesetIndex("path_tiles"))

    const backgroundLayer = map.createBlankLayer('Background', tileset, x, y)
    if (!backgroundLayer) {
      throw new Error("Failed to create layer")
    }
    this.backgroundLayer = backgroundLayer
    this.add(backgroundLayer)

    const mainLayer = map.createBlankLayer('Path Layer', tileset, x, y)
    if (!mainLayer) {
      throw new Error("Failed to create layer")
    }
    this.mainLayer = mainLayer
    this.add(mainLayer)
  }

  setModel(path: IPathModel) {
    // This is non-deterministic and so maybe updates each time?
    this.backgroundLayer.forEachTile(
      (tile, i) => tile.index = lerpInt(16, 20, Math.random()))
    path.forEach(cell => {
      this.map.putTileAt(cell.bits, cell.pos.x, cell.pos.y)
    })
  }
}
