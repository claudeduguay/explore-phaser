import { Curves, GameObjects, Scene, Time } from "phaser"
import TDEnemy from "../../entity/enemy/TDEnemy"
import { ENEMY_INDEX, ENEMY_LIST } from "../../entity/model/IEnemyModel"
import TDPlayScene from "../TDPlayScene"
import { defaultWaveModel, IWaveGroup } from "./IWaveModel"
import ObservableValue from "../../value/ObservableValue"
import { play } from "../../../../util/SceneUtil"

// Create a graphics background and a line-based curve for the preview path
export function makeTimelinePreviewGraphics(scene: Scene, prefixFraction: number = 0.15, suffixFraction: number = 0.15) {
  const top = 6
  const left = 230
  const height = 34
  const width = 500
  const insetStart = left + width * prefixFraction
  const insetWidth = width * (1.0 - (prefixFraction + suffixFraction))

  // Note: Could be converted into a generated texture
  const g = scene.add.graphics()
  g.fillStyle(0x994444, 1.0)
  g.fillRoundedRect(left, top, width, height, 10)
  g.fillStyle(0x44AA44, 1.0)
  g.fillRect(insetStart, top, insetWidth, height)

  return g
}

export function makeTimelinePreviewPath() {
  const top = 6
  const left = 230
  const height = 34
  const width = 500

  // Generate path curve
  const path = new Curves.Path()
  path.moveTo(left, top + height / 2 - 4)
  path.lineTo(left + width, top + height / 2 - 4)
  return path
}

// Add an enemy to the main path (add/remove in group)
export function addMainPathFollower(key: string, scene: Scene,
  health: ObservableValue<number>, credits: ObservableValue<number>,
  enemyGroup: GameObjects.Group, path: Curves.Path, duration: number, delay: number) {
  let wasDestroyed = false // onComplete triggers even if destroyed, track status
  const enemy = scene.add.enemy(0, 0, ENEMY_INDEX[key], path, true)
  // enemy.barContainer.visible = false
  enemy.addListener("died", ({ x, y, model }: TDEnemy) => {
    enemy.removeListener("died")
    enemy.destroy() // Destroy before removing from group to get destroy event and clear any selection
    enemyGroup.remove(enemy)
    if (model) {
      credits.value += (model.general.value || 0)
      TDPlayScene.createExplosionSprite(scene, x, y)
      play(scene, "cash")
    }
    wasDestroyed = true
  })
  enemy.startFollow({
    duration,
    delay,
    from: 0.0,
    to: 1.0,
    yoyo: false,
    repeat: 0,
    onStart: () => {
      enemyGroup.add(enemy)
    },
    onComplete: () => {
      if (!wasDestroyed) {
        enemyGroup.remove(enemy, true, true)
        if (health.value > 1) {
          health.value -= 1
        } else {
          play(scene, "woe")
        }
      }
    },
  })
  return enemy
}

// Add preview follower to the proview path, reset timeline after last is finished
export function addPreviewFollower(key: string, scene: Scene, previewGroup: GameObjects.Group, path: Curves.Path, timeline: Time.Timeline, duration: number, isLast: boolean, twin: TDEnemy) {
  const enemy = scene.add.enemy(0, 0, ENEMY_INDEX[key], path, false)
  twin.twin = enemy // Track this enemy from it's twin
  twin.addListener("died", ({ x, y, model }: TDEnemy) => {
    enemy.removeListener("died")
    previewGroup.remove(enemy)
    enemy.destroy()
  })
  enemy.startFollow({
    duration,
    from: 0.0,
    to: 1.0,
    yoyo: false,
    repeat: 0,
    onStart: () => {
      previewGroup.add(enemy)
    },
    onComplete: () => {
      previewGroup.remove(enemy, true, true)
      if (isLast) {
        setTimeout(() => timeline.reset(), 1000)
      }
    }
  })
  return enemy
}

let previewPath: Curves.Path

export function makeTimeline(scene: Scene, hud: Scene,
  health: ObservableValue<number>, credits: ObservableValue<number>,
  enemyGroup: GameObjects.Group, previewGroup: GameObjects.Group,
  mainPath: Curves.Path, offset: number = 0) {
  enemyGroup.clear()
  const prefixFraction = 0.15
  const suffixFraction = 0.15
  if (!previewPath) { // Avoid multiple reconstructions
    previewPath = makeTimelinePreviewPath()
  }

  const enemySpeeds = ENEMY_LIST.map(e => e.general.speed)
  const maxSpeed = Math.max(...enemySpeeds) // <<< REQUIRES REFINEMENT AND MORE THOUGHT
  // const minSpeed = Math.min(...enemySpeeds)
  const ONE_SECOND = 1000
  const mainPathLength = mainPath.getLength()
  const mainSpeed = maxSpeed // 300 // (pixels per second)
  const mainDuration = mainPathLength / mainSpeed * ONE_SECOND
  const previewDuration = mainDuration + (mainDuration * prefixFraction) + (mainDuration * suffixFraction)
  const mainDelay = mainDuration * prefixFraction

  const timeline = scene.add.timeline({})
  // Build parameterized run timeline entries for both paths
  const run = (key: string, isLast: boolean = false) => () => {
    const f = ENEMY_INDEX[key].general.speed / mainSpeed  // <<< REQUIRES REFINEMENT AND MORE THOUGHT
    // console.log("Enemy duration fraction:", f)
    const twin = addMainPathFollower(key, scene, health, credits, enemyGroup, mainPath, mainDuration * f, mainDelay)
    // const preview = 
    addPreviewFollower(key, hud, previewGroup, previewPath, timeline, previewDuration * f, isLast, twin)
  }

  const config: Phaser.Types.Time.TimelineEventConfig[] = []
  const waves = defaultWaveModel()
  waves.forEach((group: IWaveGroup, index: number) => {
    const lastGroup = index === waves.length - 1
    for (let i = 0; i < group.count; i++) {
      const lastEntry = i === group.count - 1
      config.push({
        at: group.offset + group.spacing * i,
        run: run(group.key, lastGroup && lastEntry)
      })
    }
  })
  timeline.add(config)

  timeline.play()

  return timeline
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
      const sprite = scene.add.image(w * f, h / 2, group.key)
      container.add(sprite)
    }
  })
  return container
}
