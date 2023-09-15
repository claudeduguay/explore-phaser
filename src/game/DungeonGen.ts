import Phaser from 'phaser'
import Dungeon, { Room } from "@mikewesthad/dungeon"

// Code for: https://phaser.io/examples/v3/view/tilemap/dungeon-generator

//  Toggle this to disable the room hiding / layer scale, so you can see the extent of the map easily!
const debug = false

// Tile index mapping to make the code more readable
const TILES = {
  TOP_LEFT_WALL: 3,
  TOP_RIGHT_WALL: 4,
  BOTTOM_RIGHT_WALL: 23,
  BOTTOM_LEFT_WALL: 22,
  TOP_WALL: [
    { index: 39, weight: 4 },
    { index: 57, weight: 1 },
    { index: 58, weight: 1 },
    { index: 59, weight: 1 }
  ],
  LEFT_WALL: [
    { index: 21, weight: 4 },
    { index: 76, weight: 1 },
    { index: 95, weight: 1 },
    { index: 114, weight: 1 }
  ],
  RIGHT_WALL: [
    { index: 19, weight: 4 },
    { index: 77, weight: 1 },
    { index: 96, weight: 1 },
    { index: 115, weight: 1 }
  ],
  BOTTOM_WALL: [
    { index: 1, weight: 4 },
    { index: 78, weight: 1 },
    { index: 79, weight: 1 },
    { index: 80, weight: 1 }
  ],
  FLOOR: [
    { index: 6, weight: 20 },
    { index: 7, weight: 1 },
    { index: 8, weight: 1 },
    { index: 26, weight: 1 },
  ]
}

const CONFIG = {
  // 2,500 tile test
  D50x50: {
    width: 50,
    height: 50,
    rooms: {
      width: { min: 7, max: 15, onlyOdd: true },
      height: { min: 7, max: 15, onlyOdd: true }
    }
  },
  //  40,000 tile test
  D200x200: {
    width: 200,
    height: 200,
    rooms: {
      width: { min: 7, max: 20, onlyOdd: true },
      height: { min: 7, max: 20, onlyOdd: true }
    }
  },
  // 250,000 tile test!
  D500x500: {
    width: 500,
    height: 500,
    rooms: {
      width: { min: 7, max: 20, onlyOdd: true },
      height: { min: 7, max: 20, onlyOdd: true }
    }
  },
  // 1,000,000 tile test! - Warning, takes a few seconds to generate the dungeon:)
  D1000x1000: {
    width: 1000,
    height: 1000,
    rooms: {
      width: { min: 7, max: 20, onlyOdd: true },
      height: { min: 7, max: 20, onlyOdd: true }
    }
  }
}

// Debug to console
export function drawToConsole(dungeon: Dungeon) {
  dungeon.drawToConsole({
    empty: " ",
    emptyColor: "rgb(0, 0, 0)",
    wall: "#",
    wallColor: "rgb(255, 0, 0)",
    floor: "0",
    floorColor: "rgb(210, 210, 210)",
    door: "x",
    doorColor: "rgb(0, 0, 255)",
    fontSize: "8px"
  })
}

// Debug to HTML
export function drawToHtml(dungeon: Dungeon) {
  const html = dungeon.drawToHtml({
    empty: " ",
    emptyAttributes: { class: "dungeon__empty" },
    wall: "#",
    wallAttributes: { class: "dungeon__wall", style: "color: #950fe2" },
    floor: "x",
    floorAttributes: { class: "dungeon__floor", style: "color: #d2e9ef" },
    door: "*",
    doorAttributes: { class: "dungeon__door", style: "font-weight: bold; color: #f900c3" },
    containerAttributes: { class: "dungeon", style: "font-size: 15px" },
    // fontSize: "4px"
  })
  document.body.appendChild(html)
}


export interface IZoomKeys {
  plus: Phaser.Input.Keyboard.Key
  minus: Phaser.Input.Keyboard.Key
  npPlus: Phaser.Input.Keyboard.Key
  npMinus: Phaser.Input.Keyboard.Key
}

export function createZoomKeys(keyboardPlugin: Phaser.Input.Keyboard.KeyboardPlugin | null): IZoomKeys | null {
  if (!keyboardPlugin) {
    return null
  }
  return keyboardPlugin.addKeys({
    "plus": Phaser.Input.Keyboard.KeyCodes.PLUS,
    "minus": Phaser.Input.Keyboard.KeyCodes.MINUS,
    "npPlus": Phaser.Input.Keyboard.KeyCodes.NUMPAD_ADD,
    "npMinus": Phaser.Input.Keyboard.KeyCodes.NUMPAD_SUBTRACT,
  }) as IZoomKeys
}


export default class DungeonGen extends Phaser.Scene {

  activeRoom!: Room
  dungeon!: Dungeon
  map!: Phaser.Tilemaps.Tilemap
  player!: Phaser.GameObjects.Graphics
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  zoom!: IZoomKeys
  cam!: Phaser.Cameras.Scene2D.Camera
  layer!: Phaser.Tilemaps.TilemapLayer

  lastMoveTime: number = 0
  displayScale: number = 1

  preload() {
    // Credits! Michele "Buch" Bucelli (tilset artist) & Abram Connelly (tileset sponsor)
    // https://opengameart.org/content/top-down-dungeon-tileset
    this.load.image('tiles', 'assets/buch-dungeon-tileset-extruded.png')
  }

  create() {
    // Note: Dungeon is not a Phaser element - it's from "@mikewesthad/dungeon"
    // It generates a simple set of connected rectangular rooms that then we can turn into a tilemap

    this.dungeon = new Dungeon(CONFIG.D200x200)

    // drawToConsole(this.dungeon)
    // drawToHtml(this.dungeon)

    // Creating a blank tilemap with dimensions matching the dungeon
    this.map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: this.dungeon.width,
      height: this.dungeon.height
    })

    // addTilesetImage: function (tilesetName, key, tileWidth, tileHeight, tileMargin, tileSpacing, gid)
    const tileset = this.map.addTilesetImage('tiles', 'tiles', 16, 16, 1, 2)
    if (tileset) {
      const layer = this.map.createBlankLayer('Layer 1', tileset)
      if (layer) {
        this.layer = layer
        this.layer.fill(20)  // Fill with black tiles
      }
    }

    if (!debug) {
      this.displayScale = 2
      this.layer?.setScale(this.displayScale)
    }

    // Use the array of rooms generated to place tiles in the map
    this.dungeon.rooms.forEach((room: Room) => {
      this.makeRoom(room)
      this.addRoomProps(room)
    }, this)

    // Not exactly correct for the tileset since there are more possible floor tiles,
    // but this will do for the example.
    this.layer?.setCollisionByExclusion([6, 7, 8, 26])

    // Hide all the rooms
    if (!debug) {
      this.layer?.forEachTile(function (tile: any) { tile.alpha = 0 })
    }

    // Place the player in the first room
    const playerRoom = this.dungeon.rooms[0]
    if (!debug) {  // Make the starting room visible
      this.setRoomAlpha(playerRoom, 1)
    }

    if (this.layer) {
      const player = this.add.graphics({
        fillStyle: {
          color: 0x006600,
          alpha: 1
        }
      }).fillRect(0, 0, this.map.tileWidth * this.layer?.scaleX, this.map.tileHeight * this.layer.scaleY)
      if (player) {
        player.x = this.map.tileToWorldX(playerRoom.x + 1) || 0
        player.y = this.map.tileToWorldY(playerRoom.y + 1) || 0
        this.player = player
      }
    }

    // Scroll to the player
    this.cam = this.cameras.main
    if (this.layer) {
      this.cam.setBounds(0, 0, this.layer.width * this.layer.scaleX, this.layer.height * this.layer.scaleY)
      this.cam.scrollX = this.player.x - this.cam.width * 0.5
      this.cam.scrollY = this.player.y - this.cam.height * 0.5
    }

    const cursors = this.input.keyboard?.createCursorKeys()
    if (cursors) {
      this.cursors = cursors
    }
    const zoom = createZoomKeys(this.input.keyboard)
    if (zoom) {
      this.zoom = zoom
    }

    this.input.on("wheel", (pointer: any, gameObject: any, deltaX: number, deltaY: number, deltaZ: number) => {
      let delta = Math.sign(deltaY)
      if (delta < 0) {
        delta *= 0.1
      }
      this.displayScale -= delta
      this.displayScale = Math.min(5, Math.max(0.5, this.displayScale))
      if (this.layer) {
        this.layer.setScale(this.displayScale)
        // Not sure if we need to set these
        // this.cam.setBounds(0, 0, this.layer.width * this.layer.scaleX, this.layer.height * this.layer.scaleY)
        // this.cam.scrollX = this.player.x - this.cam.width * 0.5
        // this.cam.scrollY = this.player.y - this.cam.height * 0.5
      }
      console.log("Wheel:", delta, this.displayScale)
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

  makeRoom(room: Room) {
    const { x, y, width: w, height: h } = room
    const left = x
    const right = x + (w - 1)
    const top = y
    const bottom = y + (h - 1)

    // Fill the floor with mostly clean tiles, but occasionally place a dirty tile
    // See "Weighted Randomize" example for more information on how to use weightedRandomize.
    this.map.weightedRandomize(TILES.FLOOR, x, y, w, h)

    // Place the room corners tiles
    this.map.putTileAt(TILES.TOP_LEFT_WALL, left, top)
    this.map.putTileAt(TILES.TOP_RIGHT_WALL, right, top)
    this.map.putTileAt(TILES.BOTTOM_RIGHT_WALL, right, bottom)
    this.map.putTileAt(TILES.BOTTOM_LEFT_WALL, left, bottom)

    // Fill the walls with mostly clean tiles, but occasionally place a dirty tile
    this.map.weightedRandomize(TILES.TOP_WALL, left + 1, top, w - 2, 1)
    this.map.weightedRandomize(TILES.BOTTOM_WALL, left + 1, bottom, w - 2, 1)
    this.map.weightedRandomize(TILES.LEFT_WALL, left, top + 1, 1, h - 2)
    this.map.weightedRandomize(TILES.RIGHT_WALL, right, top + 1, 1, h - 2)

    // Dungeons have rooms that are connected with doors. Each door has an x & y relative to the rooms location
    const doors = room.getDoorLocations()
    for (let door of doors) {
      this.map.putTileAt(6, x + door.x, y + door.y)
    }
  }

  addRoomProps(room: Room) {
    if (!this.layer) {
      return
    }
    const { x, y, width: w, height: h } = room
    const cx = Math.floor(x + w / 2)
    const cy = Math.floor(y + h / 2)
    // Place some random stuff in rooms, occasionally
    const rand = Math.random()
    if (rand <= 0.25) {  // Chest
      this.layer.putTileAt(166, cx, cy)
    } else if (rand <= 0.3) {   // Stairs
      this.layer.putTileAt(81, cx, cy)
    } else if (rand <= 0.4) {  // Trap door
      this.layer.putTileAt(167, cx, cy)
    } else if (rand <= 0.6) {  // Towers
      if (room.height >= 9) {   // We have room for 4 towers
        this.layer.putTilesAt([[186], [205]], cx - 1, cy + 1)
        this.layer.putTilesAt([[186], [205]], cx + 1, cy + 1)
        this.layer.putTilesAt([[186], [205]], cx - 1, cy - 2)
        this.layer.putTilesAt([[186], [205]], cx + 1, cy - 2)
      }
      else {  // We have room for 2 towers
        this.layer.putTilesAt([[186], [205]], cx - 1, cy - 1)
        this.layer.putTilesAt([[186], [205]], cx + 1, cy - 1)
      }
    }
  }

  update(time: number, delta: number): void {
    this.updatePlayerMovement(time)

    const playerTileX = this.map.worldToTileX(this.player.x) || 0
    const playerTileY = this.map.worldToTileY(this.player.y) || 0

    // Another helper method from the dungeon - dungeon XY (in tiles) -> room
    const room = this.dungeon.getRoomAt(playerTileX, playerTileY)

    // If the player has entered a new room, make it visible and dim the last room
    if (room && this.activeRoom && this.activeRoom !== room) {
      if (!debug) {
        this.setRoomAlpha(room, 1)
        this.setRoomAlpha(this.activeRoom, 0.5)
      }
    }

    if (room) {
      this.activeRoom = room
    }

    // Smooth follow the player
    const smoothFactor = 0.9
    this.cam.scrollX = smoothFactor * this.cam.scrollX + (1 - smoothFactor) * (this.player.x - this.cam.width * 0.5)
    this.cam.scrollY = smoothFactor * this.cam.scrollY + (1 - smoothFactor) * (this.player.y - this.cam.height * 0.5)
  }

  updatePlayerMovement(time: any) {
    if (!this.layer) {
      return
    }
    var tw = this.map.tileWidth * this.layer.scaleX
    var th = this.map.tileHeight * this.layer.scaleY
    var repeatMoveDelay = 100

    if (time > this.lastMoveTime + repeatMoveDelay) {

      if (this.zoom) {
        if (this.zoom.plus.isDown || this.zoom.npPlus.isDown) {
          console.log("Keydown: +")
        }
        if (this.zoom.minus.isDown || this.zoom.npMinus.isDown) {
          console.log("Keydown: -")
        }
      }
      // Handle North/South
      if (this.cursors.down.isDown) {
        if (this.isTileOpenAt(this.player.x, this.player.y + th)) {
          this.player.y += th
          this.lastMoveTime = time
        }
      } else if (this.cursors.up.isDown) {
        if (this.isTileOpenAt(this.player.x, this.player.y - th)) {
          this.player.y -= th
          this.lastMoveTime = time
        }
      }

      // Handle West/East
      if (this.cursors.left.isDown) {
        if (this.isTileOpenAt(this.player.x - tw, this.player.y)) {
          this.player.x -= tw
          this.lastMoveTime = time
        }
      } else if (this.cursors.right.isDown) {
        if (this.isTileOpenAt(this.player.x + tw, this.player.y)) {
          this.player.x += tw
          this.lastMoveTime = time
        }
      }
    }
  }

  isTileOpenAt(worldX: any, worldY: any) {
    // nonNull = true, don't return null for empty tiles. This means null will be returned only for
    // tiles outside of the bounds of the map.
    var tile = this.map.getTileAtWorldXY(worldX, worldY, true)

    if (tile && !tile.collides) {
      return true
    }
    else {
      return false
    }
  }

  // Helpers functions
  setRoomAlpha(room: any, alpha: any) {
    this.map.forEachTile(function (tile: any) {
      tile.alpha = alpha
    }, this, room.x, room.y, room.width, room.height)
  }

}
