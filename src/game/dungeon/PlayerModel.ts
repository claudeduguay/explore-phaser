import { Scene, GameObjects, Cameras } from 'phaser'
import { Room } from "@mikewesthad/dungeon"
import DungeonModel from "./DungeonModel"
import KeyMap from './KeyMap'

export default class PlayerModel {

  player!: GameObjects.Graphics
  cam!: Cameras.Scene2D.Camera
  activeRoom?: Room

  constructor(scene: Scene, public readonly dungeonModel: DungeonModel, public debug: boolean) {
    this.player = scene.add.graphics({
      fillStyle: {
        color: 0x006600,
        alpha: 1
      }
    }).fillRect(0, 0, dungeonModel.map.tileWidth * dungeonModel.layer.scaleX, dungeonModel.map.tileHeight * dungeonModel.layer.scaleY)
    const playerRoom = dungeonModel.dungeon.rooms[0]
    if (!debug) {  // Make the starting room visible
      dungeonModel.setRoomAlpha(playerRoom, 1)
    }
    this.player.x = dungeonModel.map.tileToWorldX(playerRoom.x + 1) || 0
    this.player.y = dungeonModel.map.tileToWorldY(playerRoom.y + 1) || 0

    // Scroll to the player
    this.cam = scene.cameras.main
    const { layer } = dungeonModel
    this.cam.setBounds(0, 0, layer.width * layer.scaleX, layer.height * layer.scaleY)
    this.cam.scrollX = this.player.x - this.cam.width * 0.5
    this.cam.scrollY = this.player.y - this.cam.height * 0.5

    this.activeRoom = playerRoom
  }

  isValidKeyDown(keyMap: KeyMap, key: string, x: number, y: number) {
    return keyMap.isDown(key) && this.dungeonModel.isTileOpenAt(x, y)
  }

  updateMove(keyMap: KeyMap, time: number, lastMoveTime: number) {
    const { map, layer } = this.dungeonModel
    const tw = map.tileWidth * layer.scaleX
    const th = map.tileHeight * layer.scaleY
    const { x, y } = this.player
    if (this.isValidKeyDown(keyMap, "down", x, y + th)) {
      this.player.y += th
      this.updateRoomAndFollow()
      return time
    }
    if (this.isValidKeyDown(keyMap, "up", x, y - th)) {
      this.player.y -= th
      this.updateRoomAndFollow()
      return time
    }
    if (this.isValidKeyDown(keyMap, "left", x - tw, y)) {
      this.player.x -= tw
      this.updateRoomAndFollow()
      return time
    }
    if (this.isValidKeyDown(keyMap, "right", x + tw, y)) {
      this.player.x += tw
      this.updateRoomAndFollow()
      return time
    }

    return lastMoveTime
  }

  updateRoomAndFollow() {
    this.updateActiveRoom()
    this.smoothFollow()
  }

  updateActiveRoom() {
    const { map } = this.dungeonModel
    const { player, activeRoom } = this

    const playerTileX = map.worldToTileX(player.x) || 0
    const playerTileY = map.worldToTileY(player.y) || 0

    // Another helper method from the dungeon - dungeon XY (in tiles) -> room
    const room = this.dungeonModel.dungeon.getRoomAt(playerTileX, playerTileY)

    // If the player has entered a new room, make it visible and dim the last room
    if (room && activeRoom && activeRoom !== room) {
      if (!this.debug) {
        this.dungeonModel.setRoomAlpha(room, 1)
        this.dungeonModel.setRoomAlpha(activeRoom, 0.5)
      }
    }

    if (room) {
      this.activeRoom = room
    }
  }

  smoothFollow() {
    // Smooth follow the player
    const smoothFactor = 0.9
    const { player, cam } = this
    cam.scrollX = smoothFactor * cam.scrollX + (1 - smoothFactor) * (player.x - cam.width * 0.5)
    cam.scrollY = smoothFactor * cam.scrollY + (1 - smoothFactor) * (player.y - cam.height * 0.5)
  }

}
