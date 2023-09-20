import { Scene } from "phaser"
import { SimplexNoise } from "ts-perlin-simplex"

export default function generateMap(scene: Scene) {

  const perlin = new SimplexNoise()
  const map = scene.make.tilemap({
    tileWidth: 64,
    tileHeight: 64,
    width: 18,
    height: 13
  })

  const tileset = map.addTilesetImage('height_cells', 'height_cells')
  if (!tileset) {
    throw new Error("Failed to create tileset")
  }

  const layer = map.createBlankLayer('Map Layer', tileset)
  if (!layer) {
    throw new Error("Failed to create layer")
  }
  layer.fill(20)  // Fill with black tiles
  // layer.randomize(0, 0, map.width, map.height, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  console.log(layer)
  console.log(layer.layer)
  // this.add(layer)

  // map.putTileAt(1, 0, 0)
  // const accumulated: number[] = []
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const n = (1 - perlin.noise(x, y)) / 2
      // accumulated.push(n)
      console.log(`${x}, ${y} ${n}`)
      const h = Math.floor(n * 10)
      map.putTileAt(h, x, y)
    }

    // console.log(`Min: ${Math.min(...accumulated)}, Max: ${Math.max(...accumulated)}`)
  }
}
