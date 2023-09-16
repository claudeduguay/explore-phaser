import { Scene, Tilemaps } from 'phaser'
import Dungeon, { Room } from "@mikewesthad/dungeon"
import PlayerModel from './PlayerModel'
import KeyMap from './KeyMap'

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

export const DUNGEON_CONFIG = {
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

export const HOME_SCALE = 3

export default class DungeonModel {

  dungeon: Dungeon
  map: Tilemaps.Tilemap
  layer: Tilemaps.TilemapLayer
  scale: number = 1
  activeRoom?: Room

  constructor(scene: Scene, public debug: boolean) {
    // Note: Dungeon is not a Phaser element - it's from "@mikewesthad/dungeon"
    // Generates a simple set of connected rectangular rooms that then can be turned into a tilemap

    this.dungeon = new Dungeon(DUNGEON_CONFIG.D200x200)

    // drawToConsole(this.dungeon)
    // drawToHtml(this.dungeon)

    // Creating a blank tilemap with dimensions matching the dungeon
    this.map = scene.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: this.dungeon.width,
      height: this.dungeon.height
    })

    // addTilesetImage: function (tilesetName, key, tileWidth, tileHeight, tileMargin, tileSpacing, gid)
    const tileset = this.map.addTilesetImage('tiles', 'tiles', 16, 16, 1, 2)
    if (!tileset) {
      throw new Error("Failed to create tileset")
    }
    const layer = this.map.createBlankLayer('Layer 1', tileset)
    if (!layer) {
      throw new Error("Failed to create layer")
    }
    this.layer = layer
    this.layer.fill(20)  // Fill with black tiles

    // Use the array of rooms generated to place tiles in the map
    this.dungeon.rooms.forEach((room: Room) => {
      this.makeRoom(this.map, room)
      this.addRoomProps(this.layer, room)
    }, this)

    // Not exactly correct for the tileset since there are more possible floor tiles,
    // but this will do for the example.
    this.layer.setCollisionByExclusion([6, 7, 8, 26])

    // Hide all the rooms
    if (!this.debug) {
      this.layer.forEachTile(function (tile: any) { tile.alpha = 0 })
    }
  }

  makeRoom(map: Tilemaps.Tilemap, room: Room) {
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

  addRoomProps(layer: Tilemaps.TilemapLayer, room: Room) {
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

  isTileOpenAt(worldX: number, worldY: number) {
    // nonNull = true, don't return null for empty tiles. This means null will be returned only for
    // tiles outside of the bounds of the map.
    var tile = this.map.getTileAtWorldXY(worldX, worldY, true)
    return tile && !tile.collides
  }

  // Helpers functions
  setRoomAlpha(room: Room, alpha: number) {
    this.map.forEachTile((tile: any) => tile.alpha = alpha,
      this, room.x, room.y, room.width, room.height)
  }

  setDisplayScale(scale: number, playerModel: PlayerModel) {
    this.scale = scale
    const { map, layer } = this
    layer.setScale(scale)
    if (playerModel) {
      const { cam, player } = playerModel
      playerModel.player = player.fillRect(0, 0, map.tileWidth * scale, map.tileHeight * scale)
      cam.setBounds(0, 0, layer.width * layer.scaleX, layer.height * layer.scaleY)
      cam.scrollX = player.x - (cam.width * 0.5)
      cam.scrollY = player.y - (cam.height * 0.5)
    }
  }

  updateZoom(keyMap: KeyMap, playerModel: PlayerModel) {
    if (keyMap.isDown("home")) {
      this.setDisplayScale(HOME_SCALE, playerModel)
    }
    if (keyMap.isDown("plus")) {
      this.setDisplayScale(this.scale + 0.2, playerModel)
    }
    if (keyMap.isDown("minus")) {
      this.setDisplayScale(this.scale - 0.2, playerModel)
    }
  }


  // Debug to console
  drawToConsole() {
    this.dungeon.drawToConsole({
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
  drawToHtml() {
    const html = this.dungeon.drawToHtml({
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

}
