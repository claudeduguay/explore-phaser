import { Curves, GameObjects, Scene, Time } from "phaser"
import Point from "../../../../util/Point"
import TDEnemy from "../../enemy/TDEnemy"
import { ALL_ENEMIES } from "../../model/IEnemyModel"
import TDPlayScene, { IActiveValues } from "../TDPlayScene"

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
export function addMainPathFollower(key: string, scene: Scene, active: IActiveValues, enemyGroup: GameObjects.Group, origin: Point, path: Curves.Path, offset: number = 0) {
  const pixelsPerSecond = 64 * 2
  const length = path.getLength()
  const model = ALL_ENEMIES.find(m => m.meta.body === key)
  const follower = new TDEnemy(scene, path, origin.x, origin.y, key, model, true)
  follower.addListener("died", ({ x, y, model }: TDEnemy) => {
    follower.destroy()
    if (model) {
      active.credits.adjust(model.stats.value || 0)
      TDPlayScene.createExplosionSprite(scene, x, y)
    }
  })
  follower.startFollow({
    positionOnPath: true,
    duration: length * 1000 / pixelsPerSecond,
    from: 0.0,
    to: 1.0,
    yoyo: false,
    repeat: 0,
    rotateToPath: true,
    onStart: () => enemyGroup.add(follower),
    onComplete: () => {
      follower.destroy()
      enemyGroup.remove(follower)
      active.health.adjust(-1)
      // scene.sound.play("woe")
    },
    // onUpdate: () => {
    //   if (!follower.health) { // If health is zero
    //     console.log("Enemy died.")
    //   }
    // }
  }, offset)
  scene.add.existing(follower)
  return follower
}

// Add preview follower to the proview path, reset timeline after last is finished
export function addPreviewFollower(key: string, scene: Scene, path: Curves.Path, timeline: Time.Timeline, isLast: boolean, twin: TDEnemy) {
  const follower = new TDEnemy(scene, path, 0, 0, key)
  twin.addListener("died", ({ x, y, model }: TDEnemy) => {
    follower.destroy()
  })
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

export function makeTimelinePreview(scene: Scene, active: IActiveValues, enemyGroup: GameObjects.Group, origin: Point, mainPath: Curves.Path, offset: number = 0) {
  const previewPath = makeTimelinePreviewGraphicsAndPath(scene)

  const timeline = scene.add.timeline({})
  // Build parameterized run timeline entries for both paths
  const run = (key: string = "path-blue", isLast: boolean = false) => () => {
    const twin = addMainPathFollower(key, scene, active, enemyGroup, origin, mainPath)
    addPreviewFollower(key, scene, previewPath, timeline, isLast, twin)
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
