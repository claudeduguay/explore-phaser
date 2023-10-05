import { Curves, GameObjects, Scene, Time } from "phaser"
import Point from "../../../../util/Point"
import TDEnemy from "../../enemy/TDEnemy"
import { ALL_ENEMIES } from "../../model/IEnemyModel"
import TDPlayScene, { IActiveValues } from "../TDPlayScene"
import { DEFAULT_WAVES, IWaveGroup } from "./IWaveConfig"

// Create a graphics background and a line-based curve for the preview path
export function makeTimelinePreviewGraphicsAndPath(scene: Scene, prefixFraction: number, suffixFraction: number) {
  const radius = 39
  const top = 27
  const width = 600
  const left = 220
  const insetStart = left + width * prefixFraction
  const insetWidth = width * (1.0 - (prefixFraction + suffixFraction))

  // Note: Could be converted into a generated texture
  const g = scene.add.graphics()
  g.fillStyle(0x996666, 1.0)
  g.fillRoundedRect(left, top - radius / 2, width, radius, 10)
  g.fillStyle(0x666699, 1.0)
  g.fillRoundedRect(insetStart, top - radius / 2, insetWidth, radius, 10)

  // Generate path curve
  const path = new Curves.Path()
  path.moveTo(left, top)
  path.lineTo(left + width, top)
  return path
}

// Add an enemy to the main path (add/remove in group)
export function addMainPathFollower(key: string, scene: Scene, active: IActiveValues, enemyGroup: GameObjects.Group, origin: Point, path: Curves.Path, duration: number, delay: number) {
  const model = ALL_ENEMIES.find(m => m.meta.body === key)
  const follower = scene.add.enemy(origin.x, origin.y, model, path, true)
  follower.addListener("died", ({ x, y, model }: TDEnemy) => {
    follower.destroy()
    enemyGroup.remove(follower)
    if (model) {
      active.credits.adjust(model.stats.value || 0)
      TDPlayScene.createExplosionSprite(scene, x, y)
      scene.sound.play("cash")
    }
    follower.removeListener("died")
  })
  follower.startFollow({
    duration,
    delay,
    positionOnPath: true,
    from: 0.0,
    to: 1.0,
    yoyo: false,
    repeat: 0,
    rotateToPath: true,
    onStart: () => enemyGroup.add(follower),
    onComplete: () => {
      if (follower.health.compute() > 0) {
        follower.destroy()
        enemyGroup.remove(follower)
        active.health.adjust(-1)
        scene.sound.play("woe")
      }
    },
    // Test if we can change the speed of a follower on the fly
    // See: https://phaser.discourse.group/t/change-path-duration-speed-while-its-playing/9712
    onUpdate: () => {
      if (follower.health.compute() < 0.8) { // If health is getting low
        follower.pathTween.timeScale = 5
        // scene.tweens.timeScale = 5.0 // Global to all tweens
        console.log("Speed up:", follower.pathTween.timeScale)
      }
    }
  })
  enemyGroup.add(follower)
  return follower
}

// Add preview follower to the proview path, reset timeline after last is finished
export function addPreviewFollower(key: string, scene: Scene, path: Curves.Path, timeline: Time.Timeline, duration: number, isLast: boolean, twin: TDEnemy) {
  const model = ALL_ENEMIES.find(m => m.meta.body === key)
  const follower = scene.add.enemy(0, 0, model, path, false)
  twin.addListener("died", ({ x, y, model }: TDEnemy) => {
    follower.destroy()
    follower.removeListener("died")
  })
  follower.startFollow({
    duration,
    positionOnPath: true,
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
}

export function makeTimeline(scene: Scene, active: IActiveValues, enemyGroup: GameObjects.Group, origin: Point, mainPath: Curves.Path, offset: number = 0) {
  enemyGroup.clear()
  const prefixFraction = 0.15
  const suffixFraction = 0.15
  const previewPath = makeTimelinePreviewGraphicsAndPath(scene, prefixFraction, suffixFraction)

  const ONE_SECOND = 1000
  const mainPathLength = mainPath.getLength()
  const mainSpeed = 300 // (pixels per second)
  const mainDuration = mainPathLength / mainSpeed * ONE_SECOND
  const previewDuration = mainDuration + (mainDuration * prefixFraction) + (mainDuration * suffixFraction)
  const mainDelay = mainDuration * prefixFraction

  const timeline = scene.add.timeline({})
  // Build parameterized run timeline entries for both paths
  const run = (key: string, isLast: boolean = false) => () => {
    const twin = addMainPathFollower(key, scene, active, enemyGroup, origin, mainPath, mainDuration, mainDelay)
    addPreviewFollower(key, scene, previewPath, timeline, previewDuration, isLast, twin)
  }

  const config: Phaser.Types.Time.TimelineEventConfig[] = []
  const waves = DEFAULT_WAVES
  waves.forEach((group: IWaveGroup, index: number) => {
    const lastGroup = index === waves.length - 1
    for (let i = 0; i < group.count; i++) {
      const lastEntry = i === group.count - 1
      config.push({ at: group.offset + group.spacing * i, run: run(group.key, lastGroup && lastEntry) })
    }
  })
  timeline.add(config)

  timeline.play()
}

export function buildSummary(scene: Scene, x: number, y: number, w: number, h: number, waves = DEFAULT_WAVES) {
  const container = scene.add.container(x, y)
  const g = scene.add.graphics()
  g.fillStyle(0x222222, 0.75)
  g.fillRect(0, 0, w, h)
  container.add(g)
  const last = waves[waves.length - 1]
  const span = last.offset + (last.count + 1) * last.spacing
  waves.forEach((group: IWaveGroup, index: number) => {
    for (let i = 0; i < group.count; i++) {
      const pos = last.spacing + group.offset + group.spacing * i
      const f = 1.0 - (pos) / span
      console.log("Group Key:", group.key)
      const sprite = scene.add.image(x + w * f, h / 2, group.key)
      container.add(sprite)
    }
  })
  return container
}
