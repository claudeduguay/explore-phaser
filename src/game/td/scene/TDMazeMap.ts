import { Scene, Curves, GameObjects } from "phaser"
import Maze from "../../../maze/Maze";
import Point from "../../../util/Point";
import Cell from "../../../maze/Cell";
import { BITS_EAST, BITS_NORTH, BITS_SOUTH, BITS_WEST } from "../../../util/Cardinal";
import TDEnemy from "../enemy/TDEnemy";
import { WEAK_ENEMY } from "../model/IEnemyModel";

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

  // Add a head cell
  const head = new Cell(-1, path[0].pos.y)
  head.parent = path[0]
  head.rechain(head)
  path.unshift(head)

  // Add a tail cell
  const last = path.length - 1
  const tail = new Cell(path[last].pos.x + 1, path[last].pos.y)
  path[last].parent = tail
  head.rechain(tail)
  path.push(tail)

  return { path, maze }
}

export default function generateMap(scene: Scene, enemyGroup: GameObjects.Group,
  usePath: boolean = true, showMaze: boolean = true) {

  const origin = new Point(0, 46)
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
  const { curve, points } = renderPath(scene, enemyGroup, path, origin, cellSize)

  makeTimelinePreview(scene, enemyGroup, origin, curve, 0)
  return points
}

function addFollower(key: string, scene: Scene, enemyGroup: GameObjects.Group, origin: Point, path: Curves.Path, offset: number = 0) {
  const length = path.getLength()
  // console.log("Path length:", length)
  const follower = new TDEnemy(scene, path, origin.x, origin.y, key, WEAK_ENEMY, true)
  scene.add.existing(follower)
  follower.startFollow({
    positionOnPath: true,
    duration: length * 5,
    from: 0.0,
    to: 1.0,
    yoyo: false,
    // repeat: -1,
    rotateToPath: true,
    onStart: () => enemyGroup.add(follower),
    onComplete: () => {
      follower.destroy()
      enemyGroup.remove(follower)
    },
    // onUpdate: (tween: any, target: any) => {
    //   const pos = path.getPoint(target.value)
    //   console.log(`Update "${name})":`, pos)
    // }
  }, offset)

}

// Since we skip grid rows/cols we need to mid-points for a full set of path points
function interpolateMidPoints(points: Point[]) {
  const results: Point[] = []
  const half = new Point(2, 2)
  for (let i = 0; i < points.length; i++) {
    if (i > 0) {
      const diff = points[i].minus(points[i - 1]).div(half)
      results.push(points[i - 1].plus(diff))
    }
    results.push(points[i])
  }
  return results
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
  return { curve, points: interpolateMidPoints(points) }

}

function makeTimelinePreview(scene: Scene, enemyGroup: GameObjects.Group, origin: Point, curve: Curves.Path, offset: number = 0) {
  const radius = 39
  const top = 27
  const left = 220
  const width = 615
  const path = new Curves.Path()
  path.moveTo(left, top)
  path.lineTo(left + width, top)
  const g = scene.add.graphics()
  g.fillStyle(0x996666, 1.0)
  g.fillRoundedRect(left, top - radius / 2, width, radius, 10)
  g.fillStyle(0x666699, 1.0)
  g.fillRoundedRect(left + 100, top - radius / 2, width - 200, radius, 10)

  const timeline = scene.add.timeline({})
  const run = (key: string = "path-blue", isLast: boolean = false) => () => {
    addFollower(key, scene, enemyGroup, origin, curve)
    const follower = new TDEnemy(scene, path, 0, 0, key)
    follower.startFollow({
      positionOnPath: true,
      duration: path.getLength() * 50,
      from: 0.0,
      to: 1.0,
      yoyo: false,
      repeat: 0,
      rotateToPath: true,
      // onStart: () => enemyGroup.add(follower),
      onComplete: () => {
        follower.destroy()
        if (isLast) {
          setTimeout(() => timeline.reset(), 1000)
        }
      }
    })
    scene.add.existing(follower)
  }

  const config: Phaser.Types.Time.TimelineEventConfig[] = []
  for (let i = 1; i <= 3; i++) {
    config.push({ at: 250 * i, run: run("path-green") })
  }
  for (let i = 1; i <= 3; i++) {
    config.push({ at: 1500 + 250 * i, run: run("path-blue") })
  }
  for (let i = 1; i <= 3; i++) {
    config.push({ at: 3000 + 250 * i, run: run("path-red", i === 3) })
  }
  timeline.add(config)

  timeline.play()
}

