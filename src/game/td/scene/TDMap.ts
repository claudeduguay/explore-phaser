import { Scene } from "phaser"
import { SimplexNoise } from "ts-perlin-simplex"
import Graph from "graphology"
import { bidirectional } from 'graphology-shortest-path';

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

  const graph = new Graph()

  const nodeKey = (x: Number, y: number) => `${x},${y}`

  // Construct nodes and map tiles
  for (let x = 0; x < map.width; x++) {
    for (let y = 0; y < map.height; y++) {
      const current = nodeKey(x, y)
      const n = (1 - perlin.noise(x, y)) / 2 // Normalize
      graph.addNode(current, { height: n })
      // const weight = graph.getNodeAttribute(current, "height")
      // console.log(`Weight(${current}):`, weight)
      const h = Math.floor(n * 10)
      map.putTileAt(h, x, y)
    }
  }

  // Construct edges based on height deltas
  for (let y = 0; y < map.height - 1; y++) {
    for (let x = 0; x < map.width - 1; x++) {
      const current = nodeKey(x, y)
      const east = nodeKey(x + 1, y)
      const south = nodeKey(x, y + 1)
      const currentHeight = graph.getNodeAttribute(current, 'height')
      const eastHeight = graph.getNodeAttribute(east, 'height')
      const southHeight = graph.getNodeAttribute(south, 'height')
      graph.addEdge(current, east, { weight: Math.abs(currentHeight - eastHeight) })
      graph.addEdge(current, south, { weight: Math.abs(currentHeight - southHeight) })
    }
  }

  const path = bidirectional(graph,
    nodeKey(0, Math.floor(Math.random() * map.height)),
    nodeKey(map.width - 1, Math.floor(Math.random() * map.height)))
  console.log("Path:", path)

  // console.log(`Min: ${Math.min(...accumulated)}, Max: ${Math.max(...accumulated)}`)
}
