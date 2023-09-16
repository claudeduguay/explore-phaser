import { Scene } from 'phaser'
import DungeonModel, { HOME_SCALE } from "./DungeonModel"
import KeyMap from './KeyMap'
import PlayerModel from './PlayerModel'

// Code for: https://phaser.io/examples/v3/view/tilemap/dungeon-generator

//  Toggle this to disable the room hiding / layer scale, so you can see the extent of the map easily!
const debug = false

export default class DungeonGen extends Scene {

  lastInputTime: number = 0
  dungeonModel!: DungeonModel
  playerModel!: PlayerModel
  keyMap!: KeyMap

  preload() {
    // Credits! Michele "Buch" Bucelli (tilset artist) & Abram Connelly (tileset sponsor)
    // https://opengameart.org/content/top-down-dungeon-tileset
    this.load.image('tiles', 'assets/buch-dungeon-tileset-extruded.png')
  }

  create() {
    this.dungeonModel = new DungeonModel(this, debug)

    if (!debug) {
      this.dungeonModel.setDisplayScale(HOME_SCALE, this.playerModel)
    }

    this.playerModel = new PlayerModel(this, this.dungeonModel, debug)

    if (this.input.keyboard) {
      this.keyMap = new KeyMap(this.input.keyboard)
    }

    this.input.on("wheel", (pointer: any, gameObject: any, deltaX: number, deltaY: number, deltaZ: number) => {
      let delta = Math.sign(deltaY)
      if (delta < 0) {
        delta *= 0.1
      }
      let scale = this.dungeonModel.scale
      scale -= delta
      scale = Math.min(5, Math.max(0.5, scale))
      if (this.dungeonModel) {
        this.dungeonModel.layer.setScale(scale)
      }
      console.log("Wheel:", delta, scale)
    })

    const help = this.add.text(16, 16, 'Use arrows keys to move', {
      fontSize: '18px',
      padding: { x: 10, y: 5 },
      backgroundColor: '#ffffff',
      color: '#000000'
    })
    help.setScrollFactor(0)

    // var gui = new dat.GUI()

    // gui.addFolder('Camera')
    // gui.add(this.cam, 'scrollX').listen()
    // gui.add(this.cam, 'scrollY').listen()
    // gui.add(this.cam, 'zoom', 0.1, 4).step(0.1)
    // gui.add(this.cam, 'rotation').step(0.01)
    // gui.add(this.layer, 'skipCull').listen()
    // gui.add(this.layer, 'cullPaddingX').step(1)
    // gui.add(this.layer, 'cullPaddingY').step(1)
    // gui.add(this.layer, 'tilesDrawn').listen()
    // gui.add(this.layer, 'tilesTotal').listen()
  }

  update(time: number, delta: number): void {
    this.updateInput(time)

    // Smooth follow the player
    const smoothFactor = 0.9
    const { player, cam } = this.playerModel
    cam.scrollX = smoothFactor * cam.scrollX + (1 - smoothFactor) * (player.x - cam.width * 0.5)
    cam.scrollY = smoothFactor * cam.scrollY + (1 - smoothFactor) * (player.y - cam.height * 0.5)
  }

  updateInput(time: number) {
    const repeatDelay = 100
    if (time > this.lastInputTime + repeatDelay) {
      this.dungeonModel.updateZoom(this.keyMap, this.playerModel)
      this.lastInputTime = this.playerModel.updateMove(this.keyMap, time, this.lastInputTime, this.dungeonModel)
    }
  }

}
