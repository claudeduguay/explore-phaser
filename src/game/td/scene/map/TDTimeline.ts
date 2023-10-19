import { Curves, GameObjects, Scene, Time } from "phaser"
import Point from "../../../../util/geom/Point"
import TDEnemy from "../../entity/enemy/TDEnemy"
import { ENEMY_INDEX } from "../../entity/model/IEnemyModel"
import TDPlayScene, { IActiveValues } from "../TDPlayScene"
import { defaultWaveModel, IWaveGroup } from "./IWaveModel"

// Create a graphics background and a line-based curve for the preview path
export function makeTimelinePreviewGraphicsAndPath(scene: Scene, prefixFraction: number, suffixFraction: number) {
  const radius = 39
  const top = 23
  const width = 500
  const left = 270
  const insetStart = left + width * prefixFraction
  const insetWidth = width * (1.0 - (prefixFraction + suffixFraction))

  // Note: Could be converted into a generated texture
  const g = scene.add.graphics()
  g.fillStyle(0x993333, 1.0)
  g.fillRoundedRect(left, top - radius / 2, width, radius, 10)
  g.fillStyle(0x339933, 1.0)
  g.fillRoundedRect(insetStart, top - radius / 2, insetWidth, radius, 10)

  // Generate path curve
  const path = new Curves.Path()
  path.moveTo(left, top)
  path.lineTo(left + width, top)
  return path
}

// Add an enemy to the main path (add/remove in group)
export function addMainPathFollower(key: string, scene: Scene, active: IActiveValues, enemyGroup: GameObjects.Group, origin: Point, path: Curves.Path, duration: number, delay: number) {
  let wasDestroyed = false // onComplete triggers even if destroyed, track status
  const model = ENEMY_INDEX[key]
  const enemy = scene.add.enemy(origin.x, origin.y, model, path, true)
  enemy.addListener("died", ({ x, y, model }: TDEnemy) => {
    enemy.destroy()
    enemyGroup.remove(enemy)
    if (model) {
      active.credits.value += (model.stats.value || 0)
      TDPlayScene.createExplosionSprite(scene, x, y)
      if (scene.sound.get("cash")) {
        scene.sound.play("cash")
      }
    }
    enemy.removeListener("died")
    wasDestroyed = true
  })
  enemy.startFollow({
    duration,
    delay,
    positionOnPath: true,
    from: 0.0,
    to: 1.0,
    yoyo: false,
    repeat: 0,
    rotateToPath: true,
    onStart: () => enemyGroup.add(enemy),
    onComplete: () => {
      if (!wasDestroyed && enemy.health.value > 0) {
        enemy.destroy()
        enemyGroup.remove(enemy)
        if (active.health.value > 1) {
          active.health.value -= 1
        }
        if (scene.sound.get("woe")) {
          scene.sound.play("woe")
        }
      }
    },
  })
  enemyGroup.add(enemy)
  return enemy
}

// Add preview follower to the proview path, reset timeline after last is finished
export function addPreviewFollower(key: string, scene: Scene, path: Curves.Path, timeline: Time.Timeline, duration: number, isLast: boolean, twin: TDEnemy) {
  const model = ENEMY_INDEX[key]
  const enemy = scene.add.enemy(0, 0, model, path, false)
  twin.twin = enemy // Track this enemy from it's twin
  twin.addListener("died", ({ x, y, model }: TDEnemy) => {
    enemy.destroy()
    enemy.removeListener("died")
  })
  enemy.startFollow({
    duration,
    positionOnPath: true,
    from: 0.0,
    to: 1.0,
    yoyo: false,
    repeat: 0,
    rotateToPath: false,
    onComplete: () => {
      enemy.destroy()
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
  const waves = defaultWaveModel()
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

export function buildSummary(scene: Scene, x: number, y: number, w: number, h: number, waves = defaultWaveModel()) {
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
      const sprite = scene.add.image(x + w * f, h / 2, group.key)
      container.add(sprite)
    }
  })
  return container
}
