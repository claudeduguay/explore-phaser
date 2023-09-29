import { Curves, GameObjects, Scene, Time } from "phaser"
import Point from "../../../../util/Point"
import TDEnemy from "../../enemy/TDEnemy"
import { WEAK_ENEMY } from "../../model/IEnemyModel"

// Create a graphics background and a line-based curve for the preview path
export function makeTimelinePreviewGraphicsAndPath(scene: Scene) {
  const radius = 39
  const top = 27
  const left = 220
  const width = 615

  const path = new Curves.Path()
  path.moveTo(left, top)
  path.lineTo(left + width, top)

  // NOte: Could be converted into a generated texture
  const g = scene.add.graphics()
  g.fillStyle(0x996666, 1.0)
  g.fillRoundedRect(left, top - radius / 2, width, radius, 10)
  g.fillStyle(0x666699, 1.0)
  g.fillRoundedRect(left + 100, top - radius / 2, width - 200, radius, 10)
  return path
}

// Add an enemy to the main path (add/remove in group)
export function addFollower(key: string, scene: Scene, enemyGroup: GameObjects.Group, origin: Point, path: Curves.Path, offset: number = 0) {
  const length = path.getLength()
  // console.log("Path length:", length)
  const follower = new TDEnemy(scene, path, origin.x, origin.y, WEAK_ENEMY.meta.body, WEAK_ENEMY, true)
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

// Add preview follower to the proview path, reset timeline after last is finished
export function addPreviewFollower(key: string, scene: Scene, path: Curves.Path, timeline: Time.Timeline, isLast: boolean) {
  const follower = new TDEnemy(scene, path, 0, 0, key)
  follower.startFollow({
    positionOnPath: true,
    duration: path.getLength() * 50,
    from: 0.0,
    to: 1.0,
    yoyo: false,
    repeat: 0,
    rotateToPath: true,
    onComplete: () => {
      follower.destroy()
      if (isLast) {
        setTimeout(() => timeline.reset(), 1000)
      }
    }
  })
  scene.add.existing(follower)

}

export function makeTimelinePreview(scene: Scene, enemyGroup: GameObjects.Group, origin: Point, mainPath: Curves.Path, offset: number = 0) {
  const previewPath = makeTimelinePreviewGraphicsAndPath(scene)

  const timeline = scene.add.timeline({})
  // Build parameterized run timeline entries for both paths
  const run = (key: string = "path-blue", isLast: boolean = false) => () => {
    addFollower(key, scene, enemyGroup, origin, mainPath)
    addPreviewFollower(key, scene, previewPath, timeline, isLast)
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

