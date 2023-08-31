import Phaser from 'phaser'
import Dungeon from "@mikewesthad/dungeon"

// Code for: https://phaser.io/examples/v3/view/tilemap/dungeon-generator

//  Toggle this to disable the room hiding / layer scale, so you can see the extent of the map easily!
const debug = true

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

export default class DungeonGen extends Phaser.Scene {
  activeRoom: any
  dungeon: any
  map: any
  player: any
  cursors: any
  cam: any
  layer: any
  lastMoveTime = 0

  displayScale = 1

  preload() {
    // Credits! Michele "Buch" Bucelli (tilset artist) & Abram Connelly (tileset sponsor)
    // https://opengameart.org/content/top-down-dungeon-tileset
    this.load.image('tiles', 'assets/buch-dungeon-tileset-extruded.png')
  }

  create() {
    // Note: Dungeon is not a Phaser element - it's from "@mikewesthad/dungeon"
    // It generates a simple set of connected rectangular rooms that then we can turn into a tilemap

    //  2,500 tile test
    // dungeon = new Dungeon({
    //     width: 50,
    //     height: 50,
    //     rooms: {
    //         width: { min: 7, max: 15, onlyOdd: true },
    //         height: { min: 7, max: 15, onlyOdd: true }
    //     }
    // })

    //  40,000 tile test
    this.dungeon = new Dungeon({
      width: 200,
      height: 200,
      rooms: {
        width: { min: 7, max: 20, onlyOdd: true },
        height: { min: 7, max: 20, onlyOdd: true }
      }
    })

    //  250,000 tile test!
    // dungeon = new Dungeon({
    //     width: 500,
    //     height: 500,
    //     rooms: {
    //         width: { min: 7, max: 20, onlyOdd: true },
    //         height: { min: 7, max: 20, onlyOdd: true }
    //     }
    // })

    //  1,000,000 tile test! - Warning, takes a few seconds to generate the dungeon :)
    // dungeon = new Dungeon({
    //     width: 1000,
    //     height: 1000,
    //     rooms: {
    //         width: { min: 7, max: 20, onlyOdd: true },
    //         height: { min: 7, max: 20, onlyOdd: true }
    //     }
    // })

    // this.dungeon.drawToConsole({
    //   empty: " ",
    //   emptyColor: "rgb(0, 0, 0)",
    //   wall: "#",
    //   wallColor: "rgb(255, 0, 0)",
    //   floor: "0",
    //   floorColor: "rgb(210, 210, 210)",
    //   door: "x",
    //   doorColor: "rgb(0, 0, 255)",
    //   fontSize: "8px"
    // })

    // const html = this.dungeon.drawToHtml({
    //   empty: " ",
    //   emptyAttributes: { class: "dungeon__empty" },
    //   wall: "#",
    //   wallAttributes: { class: "dungeon__wall", style: "color: #950fe2" },
    //   floor: "x",
    //   floorAttributes: { class: "dungeon__floor", style: "color: #d2e9ef" },
    //   door: "*",
    //   doorAttributes: { class: "dungeon__door", style: "font-weight: bold; color: #f900c3" },
    //   containerAttributes: { class: "dungeon", style: "font-size: 15px" },
    //   fontSize: "4px"
    // })
    // document.body.appendChild(html)

    // Creating a blank tilemap with dimensions matching the dungeon
    this.map = this.make.tilemap({ tileWidth: 16, tileHeight: 16, width: this.dungeon.width, height: this.dungeon.height })

    // addTilesetImage: function (tilesetName, key, tileWidth, tileHeight, tileMargin, tileSpacing, gid)

    var tileset = this.map.addTilesetImage('tiles', 'tiles', 16, 16, 1, 2)

    this.layer = this.map.createBlankLayer('Layer 1', tileset)

    if (!debug) {
      this.layer.setScale(3)
    }

    // Fill with black tiles
    this.layer.fill(20)

    // Use the array of rooms generated to place tiles in the map
    const self: any = this
    this.dungeon.rooms.forEach(function (room: any) {
      var x = room.x
      var y = room.y
      var w = room.width
      var h = room.height
      var cx = Math.floor(x + w / 2)
      var cy = Math.floor(y + h / 2)
      var left = x
      var right = x + (w - 1)
      var top = y
      var bottom = y + (h - 1)

      // Fill the floor with mostly clean tiles, but occasionally place a dirty tile
      // See "Weighted Randomize" example for more information on how to use weightedRandomize.
      self.map.weightedRandomize(TILES.FLOOR, x, y, w, h)

      // Place the room corners tiles
      self.map.putTileAt(TILES.TOP_LEFT_WALL, left, top)
      self.map.putTileAt(TILES.TOP_RIGHT_WALL, right, top)
      self.map.putTileAt(TILES.BOTTOM_RIGHT_WALL, right, bottom)
      self.map.putTileAt(TILES.BOTTOM_LEFT_WALL, left, bottom)

      // Fill the walls with mostly clean tiles, but occasionally place a dirty tile
      self.map.weightedRandomize(TILES.TOP_WALL, left + 1, top, w - 2, 1)
      self.map.weightedRandomize(TILES.BOTTOM_WALL, left + 1, bottom, w - 2, 1)
      self.map.weightedRandomize(TILES.LEFT_WALL, left, top + 1, 1, h - 2)
      self.map.weightedRandomize(TILES.RIGHT_WALL, right, top + 1, 1, h - 2)

      // Dungeons have rooms that are connected with doors. Each door has an x & y relative to the rooms location
      var doors = room.getDoorLocations()

      for (var i = 0; i < doors.length; i++) {
        self.map.putTileAt(6, x + doors[i].x, y + doors[i].y)
      }

      // Place some random stuff in rooms occasionally
      var rand = Math.random()
      if (rand <= 0.25) {
        self.layer.putTileAt(166, cx, cy) // Chest
      }
      else if (rand <= 0.3) {
        self.layer.putTileAt(81, cx, cy) // Stairs
      }
      else if (rand <= 0.4) {
        self.layer.putTileAt(167, cx, cy) // Trap door
      }
      else if (rand <= 0.6) {
        if (room.height >= 9) {
          // We have room for 4 towers
          self.layer.putTilesAt([
            [186],
            [205]
          ], cx - 1, cy + 1)

          self.layer.putTilesAt([
            [186],
            [205]
          ], cx + 1, cy + 1)

          self.layer.putTilesAt([
            [186],
            [205]
          ], cx - 1, cy - 2)

          self.layer.putTilesAt([
            [186],
            [205]
          ], cx + 1, cy - 2)
        }
        else {
          self.layer.putTilesAt([
            [186],
            [205]
          ], cx - 1, cy - 1)

          self.layer.putTilesAt([
            [186],
            [205]
          ], cx + 1, cy - 1)
        }
      }
    }, this)

    // Not exactly correct for the tileset since there are more possible floor tiles, but this will
    // do for the example.
    this.layer.setCollisionByExclusion([6, 7, 8, 26])

    // Hide all the rooms
    if (!debug) {
      this.layer.forEachTile(function (tile: any) { tile.alpha = 0 })
    }

    // Place the player in the first room
    var playerRoom = this.dungeon.rooms[0]

    this.player = this.add.graphics({
      fillStyle: {
        color: 0x006600,
        alpha: 1
      }
    })
      .fillRect(0, 0, this.map.tileWidth * this.layer.scaleX, this.map.tileHeight * this.layer.scaleY)

    this.player.x = this.map.tileToWorldX(playerRoom.x + 1)
    this.player.y = this.map.tileToWorldY(playerRoom.y + 1)

    if (!debug) {
      this.setRoomAlpha(playerRoom, 1) // Make the starting room visible
    }

    // Scroll to the player
    this.cam = this.cameras.main

    this.cam.setBounds(0, 0, this.layer.width * this.layer.scaleX, this.layer.height * this.layer.scaleY)
    this.cam.scrollX = this.player.x - this.cam.width * 0.5
    this.cam.scrollY = this.player.y - this.cam.height * 0.5

    this.cursors = self.input.keyboard.createCursorKeys()
    self.input.on("wheel", (pointer: any, gameObject: any, deltaX: number, deltaY: number, deltaZ: number) => {
      let delta = Math.sign(deltaY)
      if (delta < 0) {
        delta *= 0.1
      }
      this.displayScale -= delta
      this.displayScale = Math.min(5, Math.max(0.5, this.displayScale))
      this.layer.setScale(this.displayScale)
      console.log("Wheel:", delta, this.displayScale)
    })

    var help = this.add.text(16, 16, 'Arrows keys to move', {
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

  update(time: any, delta: any) {
    this.updatePlayerMovement(time)

    var playerTileX = this.map.worldToTileX(this.player.x)
    var playerTileY = this.map.worldToTileY(this.player.y)

    // Another helper method from the dungeon - dungeon XY (in tiles) -> room
    var room = this.dungeon.getRoomAt(playerTileX, playerTileY)

    // If the player has entered a new room, make it visible and dim the last room
    if (room && this.activeRoom && this.activeRoom !== room) {
      if (!debug) {
        this.setRoomAlpha(room, 1)
        this.setRoomAlpha(this.activeRoom, 0.5)
      }
    }

    this.activeRoom = room

    // Smooth follow the player
    var smoothFactor = 0.9

    this.cam.scrollX = smoothFactor * this.cam.scrollX + (1 - smoothFactor) * (this.player.x - this.cam.width * 0.5)
    this.cam.scrollY = smoothFactor * this.cam.scrollY + (1 - smoothFactor) * (this.player.y - this.cam.height * 0.5)
  }

  // Helpers functions
  setRoomAlpha(room: any, alpha: any) {
    this.map.forEachTile(function (tile: any) {
      tile.alpha = alpha
    }, this, room.x, room.y, room.width, room.height)
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

  updatePlayerMovement(time: any) {
    var tw = this.map.tileWidth * this.layer.scaleX
    var th = this.map.tileHeight * this.layer.scaleY
    var repeatMoveDelay = 100

    if (time > this.lastMoveTime + repeatMoveDelay) {
      if (this.cursors.down.isDown) {
        if (this.isTileOpenAt(this.player.x, this.player.y + th)) {
          this.player.y += th
          this.lastMoveTime = time
        }
      }
      else if (this.cursors.up.isDown) {
        if (this.isTileOpenAt(this.player.x, this.player.y - th)) {
          this.player.y -= th
          this.lastMoveTime = time
        }
      }

      if (this.cursors.left.isDown) {
        if (this.isTileOpenAt(this.player.x - tw, this.player.y)) {
          this.player.x -= tw
          this.lastMoveTime = time
        }
      }
      else if (this.cursors.right.isDown) {
        if (this.isTileOpenAt(this.player.x + tw, this.player.y)) {
          this.player.x += tw
          this.lastMoveTime = time
        }
      }
    }
  }


}
