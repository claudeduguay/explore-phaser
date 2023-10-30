
import TDGameScene from "./TDGameScene"
import TDNavScene from "./TDNavScene"
import { ILevelModel, computeHardestWave, computeLongestMap, generateLevel } from "./map/ILevelModel"
import { DEFAULT_CONFIG, IMapConfig, TDTileMap } from "./map/TDTileMap";
import { evaluateWaveDifficulty } from "./map/IWaveModel"
import { sceneSize, transitionTo } from "../../../util/SceneUtil"
import { buildSummary } from "./map/TDTimeline"
import Button from "../gui/Button"
import { addLabel } from "../../../util/TextUtil"

export function generateAndSortLevels(count = 20): ILevelModel[] {
  const levels: ILevelModel[] = []
  const config: IMapConfig = DEFAULT_CONFIG
  for (let i = 0; i < count; i++) {
    levels.push(generateLevel(config.rows, config.cols))
  }
  // console.log(JSON.stringify(levels[0], null, 2))

  // Get max boundaries
  const longestMap = computeLongestMap(levels)
  const hardestWave = computeHardestWave(levels)
  // Difficulty is relative path length (normalized) + normalized wave difficulty
  const evaluateLevelDifficulty = (level: ILevelModel) => {
    return (level.path.length / longestMap) +
      (evaluateWaveDifficulty(level.waves) / hardestWave)
  }
  // Sort by inverse normalized difficulty (easiest first)
  const inverseDifficulty = (a: ILevelModel, b: ILevelModel): number => {
    return evaluateLevelDifficulty(a) - evaluateLevelDifficulty(b)
  }
  levels.sort(inverseDifficulty)
  return levels
}

export default class TDMapsScene extends TDNavScene {
  constructor(public readonly main: TDGameScene) {
    super("maps", main)
  }

  makeLevelButton(i: number, x: number, y: number, ux: number, uy: number, level: ILevelModel) {
    console.log("X,Y:", x, y)

    const button = new Button(this, x, y, ux, uy)
    button.onClick = () => transitionTo(this, "play")

    const summary = buildSummary(this, 22 - ux / 2, 10 - uy / 2, ux * 3, 50, level.waves)
    summary.scale = 0.26
    button.add(summary)
    button.bringToTop(summary)

    const mx = x - ux / 2 + ux / 8
    const my = y - uy / 2 + uy / 6
    const map = new TDTileMap(this, mx, my, DEFAULT_CONFIG)
    map.setModel(level.path)
    map.pathLayer.scale = 0.13
    map.landLayer.scale = 0.13
    button.add(map)

    const label = addLabel(this, 0, uy / 2 - 28, `Level ${i + 1}`).setOrigin(0.5, 0)
    button.add(label)

    return button
  }

  create() {
    const { w, h } = sceneSize(this)

    const home = this.add.button(w - 100, 50, 80, 30, "Home")
    home.onClick = () => transitionTo(this, "home")

    this.addHeader("Game Levels", 48, 64)

    const levels = generateAndSortLevels(20)
    const cols = 5
    const rows = 4
    const ux = w / cols
    const uy = h / rows
    levels.forEach((level, i) => {
      const x = 40 + (i % cols) * (ux - 20) + ux / 2
      const y = 90 + Math.floor(i / cols) * (uy - 30) + uy / 2
      const button = this.makeLevelButton(i, x, y, ux - 30, uy - 40, level)
      this.add.existing(button)
    })

  }
}
