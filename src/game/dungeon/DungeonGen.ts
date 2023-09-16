import Phaser from 'phaser'
import Dungeon, { Room } from "@mikewesthad/dungeon"

// Code for: https://phaser.io/examples/v3/view/tilemap/dungeon-generator

//  Toggle this to disable the room hiding / layer scale, so you can see the extent of the map easily!
const debug = false

// Tile index mapping to make the code more readable
const TILES = {
  TOWER: [[186], [205]],
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
  ],
}

const CONFIG = {
  D50x50: {  // 2,500 tile test
    width: 50,
    height: 50,
    rooms: {
      width: { min: 7, max: 15, onlyOdd: true },
      height: { min: 7, max: 15, onlyOdd: true }
    }
  },
  D200x200: {  //  40,000 tile test
    width: 200,
    height: 200,
    rooms: {
      width: { min: 7, max: 20, onlyOdd: true },
      height: { min: 7, max: 20, onlyOdd: true }
    }
  },
  D500x500: {  // 250,000 tile test!
    width: 500,
    height: 500,
    rooms: {
      width: { min: 7, max: 20, onlyOdd: true },
      height: { min: 7, max: 20, onlyOdd: true }
    }
  },
  D1000x1000: {  // 1,000,000 tile test! - Warning, takes a few seconds to generate the dungeon:)
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
  home: Phaser.Input.Keyboard.Key
  plus: Phaser.Input.Keyboard.Key
  minus: Phaser.Input.Keyboard.Key
  npPlus: Phaser.Input.Keyboard.Key
  npMinus: Phaser.Input.Keyboard.Key
}

export function createZoomKeys(keyboardPlugin: Phaser.Input.Keyboard.KeyboardPlugin): IZoomKeys {
  return keyboardPlugin.addKeys({
    "home": Phaser.Input.Keyboard.KeyCodes.HOME,
    "plus": Phaser.Input.Keyboard.KeyCodes.PLUS,
    "minus": Phaser.Input.Keyboard.KeyCodes.MINUS,
    "npPlus": Phaser.Input.Keyboard.KeyCodes.NUMPAD_ADD,
    "npMinus": Phaser.Input.Keyboard.KeyCodes.NUMPAD_SUBTRACT,
  }) as IZoomKeys
}

const HOME_SCALE = 3

export interface IDungeonState {
  dungeon: Dungeon
  map: Phaser.Tilemaps.Tilemap
  layer: Phaser.Tilemaps.TilemapLayer
}

export default class DungeonGen extends Phaser.Scene {

  activeRoom!: Room
  dungeonState!: IDungeonState
  cam!: Phaser.Cameras.Scene2D.Camera
  player!: Phaser.GameObjects.Graphics
  cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys
  zoomKeys!: IZoomKeys

  lastMoveTime: number = 0
  displayScale: number = 1

  // Assigns value only if not nullish
  // (TS handles defered props via constructor assignments but we need to use create() for Phaser)
  safeAssignment<T>(prop: keyof DungeonGen, value: T) {
    if (value) {
      this[prop] = value as any
    }
  }

  preload() {
    // Credits! Michele "Buch" Bucelli (tilset artist) & Abram Connelly (tileset sponsor)
    // https://opengameart.org/content/top-down-dungeon-tileset
    this.load.image('tiles', 'assets/buch-dungeon-tileset-extruded.png')
  }

  setDisplayScale(scale: number) {
    if (!this.dungeonState) {
      return
    }
    const { map, layer } = this.dungeonState
    this.displayScale = scale
    layer.setScale(scale)
    if (this.player) {
      this.player = this.player.fillRect(0, 0, map.tileWidth * this.displayScale, map.tileHeight * this.displayScale)
    }
    if (this.cam && this.player) {
      this.cam.scrollX = this.player.x - (this.cam.width * 0.5)
      this.cam.scrollY = this.player.y - (this.cam.height * 0.5)
    }
  }

  makePlayer(playerRoom: Room) {
    const player = this.add.graphics({
      fillStyle: {
        color: 0x006600,
        alpha: 1
      }
    }).fillRect(0, 0, this.dungeonState.map.tileWidth * this.dungeonState.layer.scaleX, this.dungeonState.map.tileHeight * this.dungeonState.layer.scaleY)
    player.x = this.dungeonState.map.tileToWorldX(playerRoom.x + 1) || 0
    player.y = this.dungeonState.map.tileToWorldY(playerRoom.y + 1) || 0
    this.safeAssignment("player", player)
  }

  makeDungeon() {
    // Note: Dungeon is not a Phaser element - it's from "@mikewesthad/dungeon"
    // Generates a simple set of connected rectangular rooms that then can be turned into a tilemap

    const dungeon = new Dungeon(CONFIG.D200x200)

    // drawToConsole(this.dungeon)
    // drawToHtml(this.dungeon)

    // Creating a blank tilemap with dimensions matching the dungeon
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: dungeon.width,
      height: dungeon.height
    })

    // addTilesetImage: function (tilesetName, key, tileWidth, tileHeight, tileMargin, tileSpacing, gid)
    const tileset = map.addTilesetImage('tiles', 'tiles', 16, 16, 1, 2)
    if (!tileset) {
      throw new Error("Failed to create tileset")
    }
    const layer = map.createBlankLayer('Layer 1', tileset)
    if (!layer) {
      throw new Error("Failed to create layer")
    }
    layer.fill(20)  // Fill with black tiles

    // Use the array of rooms generated to place tiles in the map
    dungeon.rooms.forEach((room: Room) => {
      this.makeRoom(map, room)
      this.addRoomProps(layer, room)
    }, this)

    // Not exactly correct for the tileset since there are more possible floor tiles,
    // but this will do for the example.
    layer.setCollisionByExclusion([6, 7, 8, 26])

    // Hide all the rooms
    if (!debug) {
      layer.forEachTile(function (tile: any) { tile.alpha = 0 })
    }
    this.dungeonState = { dungeon, map, layer }
  }

  create() {
    this.makeDungeon()

    if (!debug) {
      this.setDisplayScale(HOME_SCALE)
    }

    // Place the player in the first room
    const playerRoom = this.dungeonState.dungeon.rooms[0]
    if (!debug) {  // Make the starting room visible
      this.setRoomAlpha(playerRoom, 1)
    }
    this.makePlayer(playerRoom)

    // Scroll to the player
    this.cam = this.cameras.main
    if (this.dungeonState) {
      this.cam.setBounds(0, 0, this.dungeonState.layer.width * this.dungeonState.layer.scaleX, this.dungeonState.layer.height * this.dungeonState.layer.scaleY)
      this.cam.scrollX = this.player.x - this.cam.width * 0.5
      this.cam.scrollY = this.player.y - this.cam.height * 0.5
    }

    if (this.input.keyboard) {
      this.safeAssignment("cursorKeys", this.input.keyboard.createCursorKeys())
      this.safeAssignment("zoomKeys", createZoomKeys(this.input.keyboard))
    }

    this.input.on("wheel", (pointer: any, gameObject: any, deltaX: number, deltaY: number, deltaZ: number) => {
      let delta = Math.sign(deltaY)
      if (delta < 0) {
        delta *= 0.1
      }
      this.displayScale -= delta
      this.displayScale = Math.min(5, Math.max(0.5, this.displayScale))
      if (this.dungeonState) {
        this.dungeonState.layer.setScale(this.displayScale)
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

  makeRoom(map: Phaser.Tilemaps.Tilemap, room: Room) {
    const { x, y, width: w, height: h } = room
    const left = x
    const right = x + (w - 1)
    const top = y
    const bottom = y + (h - 1)

    // Fill the floor with mostly clean tiles, but occasionally place a dirty tile
    // See "Weighted Randomize" example for more information on how to use weightedRandomize.
    map.weightedRandomize(TILES.FLOOR, x, y, w, h)

    // Place the room corners tiles
    map.putTileAt(TILES.TOP_LEFT_WALL, left, top)
    map.putTileAt(TILES.TOP_RIGHT_WALL, right, top)
    map.putTileAt(TILES.BOTTOM_RIGHT_WALL, right, bottom)
    map.putTileAt(TILES.BOTTOM_LEFT_WALL, left, bottom)

    // Fill the walls with mostly clean tiles, but occasionally place a dirty tile
    map.weightedRandomize(TILES.TOP_WALL, left + 1, top, w - 2, 1)
    map.weightedRandomize(TILES.BOTTOM_WALL, left + 1, bottom, w - 2, 1)
    map.weightedRandomize(TILES.LEFT_WALL, left, top + 1, 1, h - 2)
    map.weightedRandomize(TILES.RIGHT_WALL, right, top + 1, 1, h - 2)

    // Dungeons have rooms that are connected with doors. Each door has an x & y relative to the rooms location
    const doors = room.getDoorLocations()
    for (let door of doors) {
      map.putTileAt(6, x + door.x, y + door.y)
    }
  }

  addRoomProps(layer: Phaser.Tilemaps.TilemapLayer, room: Room) {
    const { x, y, width: w, height: h } = room
    const cx = Math.floor(x + w / 2)
    const cy = Math.floor(y + h / 2)
    // Place some random stuff in rooms, occasionally
    const rand = Math.random()
    if (rand <= 0.25) {  // Chest
      layer.putTileAt(166, cx, cy)
    } else if (rand <= 0.3) {   // Stairs
      layer.putTileAt(81, cx, cy)
    } else if (rand <= 0.4) {  // Trap door
      layer.putTileAt(167, cx, cy)
    } else if (rand <= 0.6) {  // Towers
      if (room.height >= 9) {   // We have room for 4 towers
        layer.putTilesAt(TILES.TOWER, cx - 1, cy + 1)
        layer.putTilesAt(TILES.TOWER, cx + 1, cy + 1)
        layer.putTilesAt(TILES.TOWER, cx - 1, cy - 2)
        layer.putTilesAt(TILES.TOWER, cx + 1, cy - 2)
      }
      else {  // We have room for 2 towers
        layer.putTilesAt(TILES.TOWER, cx - 1, cy - 1)
        layer.putTilesAt(TILES.TOWER, cx + 1, cy - 1)
      }
    }
  }

  update(time: number, delta: number): void {
    this.updatePlayerMovement(time)
    const map = this.dungeonState.map

    const playerTileX = map.worldToTileX(this.player.x) || 0
    const playerTileY = map.worldToTileY(this.player.y) || 0

    // Another helper method from the dungeon - dungeon XY (in tiles) -> room
    const room = this.dungeonState.dungeon.getRoomAt(playerTileX, playerTileY)

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
    const { map, layer } = this.dungeonState
    var tw = map.tileWidth * layer.scaleX
    var th = map.tileHeight * layer.scaleY
    var repeatMoveDelay = 100

    if (time > this.lastMoveTime + repeatMoveDelay) {

      if (this.zoomKeys.home.isDown) {
        this.setDisplayScale(HOME_SCALE)
      }
      if (this.zoomKeys.plus.isDown || this.zoomKeys.npPlus.isDown) {
        console.log("Keydown: +")
        this.setDisplayScale(this.displayScale + 0.2)
      }
      if (this.zoomKeys.minus.isDown || this.zoomKeys.npMinus.isDown) {
        console.log("Keydown: -")
        this.setDisplayScale(this.displayScale - 0.2)
      }

      // Handle North/South
      if (this.cursorKeys.down.isDown) {
        if (this.isTileOpenAt(this.player.x, this.player.y + th)) {
          this.player.y += th
          this.lastMoveTime = time
        }
      } else if (this.cursorKeys.up.isDown) {
        if (this.isTileOpenAt(this.player.x, this.player.y - th)) {
          this.player.y -= th
          this.lastMoveTime = time
        }
      }

      // Handle West/East
      if (this.cursorKeys.left.isDown) {
        if (this.isTileOpenAt(this.player.x - tw, this.player.y)) {
          this.player.x -= tw
          this.lastMoveTime = time
        }
      } else if (this.cursorKeys.right.isDown) {
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
    var tile = this.dungeonState.map.getTileAtWorldXY(worldX, worldY, true)
    return tile && !tile.collides
  }

  // Helpers functions
  setRoomAlpha(room: Room, alpha: number) {
    this.dungeonState.map.forEachTile((tile: any) => tile.alpha = alpha,
      this, room.x, room.y, room.width, room.height)
  }

}
