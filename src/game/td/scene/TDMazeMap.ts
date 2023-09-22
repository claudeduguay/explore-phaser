import { Scene, Curves, GameObjects } from "phaser"
import Maze from "../../../maze/Maze";
import Point from "../../../util/Point";
import Cell from "../../../maze/Cell";
import BITS_MAP, { BITS_EAST, BITS_NORTH, BITS_SOUTH, BITS_WEST } from "../../../util/Cardinal";

export function makeTileMap(scene: Scene, cells: Cell[], origin: Point, cellSize: Point, rows: number, cols: number) {

  const map = scene.make.tilemap({
    tileWidth: cellSize.x,
    tileHeight: cellSize.y,
    width: cols * 2,
    height: rows * 2
  })

  const tileset = map.addTilesetImage('path_tiles', 'path_tiles')
  if (!tileset) {
    throw new Error("Failed to create tileset")
  }

  const layer = map.createBlankLayer('Map Layer', tileset)
  if (!layer) {
    throw new Error("Failed to create layer")
  }
  layer.fill(20)  // Fill with black tiles
  layer.setPosition(origin.x, origin.y)

  cells.forEach(cell => {
    map.putTileAt(cell.connectionsBits(), cell.pos.x * 2, cell.pos.y * 2)
    if (cell.links.get(Point.SOUTH) !== null) {
      map.putTileAt(BITS_NORTH + BITS_SOUTH, cell.pos.x * 2, cell.pos.y * 2 + 1)
    }
    if (cell.links.get(Point.NORTH) !== null) {
      map.putTileAt(BITS_NORTH + BITS_SOUTH, cell.pos.x * 2, cell.pos.y * 2 - 1)
    }
    if (cell.links.get(Point.EAST) != null) {
      map.putTileAt(BITS_WEST + BITS_EAST, cell.pos.x * 2 + 1, cell.pos.y * 2)
    }
    if (cell.links.get(Point.WEST) != null) {
      map.putTileAt(BITS_WEST + BITS_EAST, cell.pos.x * 2 - 1, cell.pos.y * 2)
    }
  })
}

export function generateLevel(rows: number, cols: number) {
  const maze = new Maze(rows, cols)
  const random = (x: number) => new Point(x, Math.floor(Math.random() * (rows - 1)))
  const left = maze.cell_atv(random(0))
  const right = maze.cell_atv(random(cols - 1))
  maze.generate(right)
  const path = maze.get_path_to(left)
  return { path, maze }
}

export default function generateMap(scene: Scene, enemyGroup: GameObjects.Group,
  usePath: boolean = true, showMaze: boolean = true) {

  const origin = new Point(6, 50)
  const cellSize = new Point(64, 64)
  const rows = 6
  const cols = 9

  const { path, maze } = generateLevel(rows, cols)
  if (usePath) {
    path.forEach((cell: Cell) => cell.parent?.rechain(cell))
  }

  if (showMaze) {
    if (usePath) {
      makeTileMap(scene, path, origin, cellSize, rows, cols)
    } else {
      makeTileMap(scene, maze.grid.array, origin, cellSize, rows, cols)
    }
  }
  renderPath(scene, enemyGroup, path, origin, cellSize)
}

function addFollower(name: string, scene: Scene, enemyGroup: GameObjects.Group, origin: Point, path: Curves.Path, offset: number = 0) {
  const length = path.getLength()
  console.log("Path length:", length)
  const follower = new GameObjects.PathFollower(scene, path, origin.x, origin.y, "path")
  scene.add.existing(follower)
  follower.startFollow({
    positionOnPath: true,
    duration: length * 7,
    from: 0.0,
    to: 1.0,
    yoyo: true,
    repeat: -1,
    rotateToPath: true,
    onStart: () => enemyGroup.add(follower),
    onComplete: () => enemyGroup.remove(follower),
    // onUpdate: (tween: any, target: any) => {
    //   const pos = path.getPoint(target.value)
    //   console.log(`Update "${name})":`, pos)
    // }
  }, offset)

}

function renderPath(scene: Scene, enemyGroup: GameObjects.Group, path: Cell[], origin: Point, cellSize: Point) {
  const centering = new Point(32, 32)
  const points = path.map(cell => cell.pos.times(new Point(2, 2)).times(cellSize).plus(origin).plus(centering))
  const curve = new Curves.Path()
  points.unshift(points[0].plus(new Point(-64, 0)))
  const last = points.length - 1
  points.push(points[last].plus(new Point(64, 0)))
  for (let i = 0; i < points.length; i++) {
    const p = points[i]
    if (i === 0) {
      curve.moveTo(p.x, p.y)
    } else {
      curve.lineTo(p.x, p.y)
    }
  }
  const radius = 44
  const g = scene.add.graphics({ lineStyle: { color: 0x00FF00, alpha: 1.0, width: radius } })
  //  curve.draw(g)
  // Round corners overlay
  // for (let i = 0; i < points.length; i++) {
  //   const p = points[i]
  //   scene.add.ellipse(p.x, p.y, radius, radius, 0x00FF00)
  // }
  addFollower("enemy-1", scene, enemyGroup, origin, curve)
  addFollower("enemy-2", scene, enemyGroup, origin, curve, 0.01)
  addFollower("enemy-3", scene, enemyGroup, origin, curve, 0.02)

}
