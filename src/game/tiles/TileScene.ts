import { Scene } from "phaser"

export const TILE_SET = "assets/buch-dungeon-tileset-extruded.png"

export default class TilesManager extends Scene {

  preload() {
    // Credits! Michele "Buch" Bucelli (tilset artist) & Abram Connelly (tileset sponsor)
    // https://opengameart.org/content/top-down-dungeon-tileset
    this.load.image('tiles', TILE_SET)
  }

  create() {

    // Creat blank tilemap with dimensions matching the tilesheet
    const map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: 19,
      height: 14
    })

    const tileset = map.addTilesetImage('tiles', 'tiles', 16, 16, 1, 2)
    if (!tileset) {
      throw new Error("Failed to create tileset")
    }

    const layer = map.createBlankLayer('Tiles Layer', tileset)
    if (!layer) {
      throw new Error("Failed to create layer")
    }
    const scale = 3
    layer.setScale(scale)
    layer.fill(20)  // Fill with black tiles
    // Place tiles to reflect the tile sheet positions
    for (let y = 0; y < map.height - 1; y++) {
      for (let x = 0; x < map.width - 1; x++) {
        const i = y * map.width + x
        layer.putTileAt(i, x + 1, y + 1)
        this.addLabel((x + 1) * 16 * scale, (y + 1) * 16 * scale, `${i}`)
      }
    }

    const help = this.add.text(10, 10, "Displaying individual tiles with index", {
      fontSize: '18px',
      padding: { x: 5, y: 5 },
      backgroundColor: '#ffffff',
      color: '#000000'
    })
    help.setScrollFactor(0)

  }

  addLabel(x: number, y: number, label: string) {
    const shadowOffset = 1
    this.add.text(x + shadowOffset, y + shadowOffset, label, {
      fontSize: '18px',
      padding: { x: 5, y: 5 },
      backgroundColor: 'transparent',
      color: '#000000'
    })
    this.add.text(x, y, label, {
      fontSize: '18px',
      padding: { x: 5, y: 5 },
      backgroundColor: 'transparent',
      color: '#FFFFFF'
    })
  }

  update(time: number, delta: number): void {
  }

}
