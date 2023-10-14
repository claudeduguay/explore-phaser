import { Scene } from "phaser"
import { makeHeightRects, makeLandscapeTile, makeNineSlice, makePathTiles } from "../assets/TextureFactory"
import { generateEnemies } from "../entity/model/IEnemyModel"

export default function preloadAssets(scene: Scene) {
  preloadAudio(scene)
  preloadImages(scene)
  preloadTextures(scene)
}

export function preloadAudio(scene: Scene) {
  scene.load.audio('click', "assets/audio/click3.ogg")
  scene.load.audio('boop', "assets/audio/drop_003.ogg")
  scene.load.audio('cash', "assets/audio/dropmetalthing.ogg")
  scene.load.audio('explosion', "assets/audio/explosionCrunch_004.ogg")
  scene.load.audio('gun', "assets/audio/GunShot.wav")
  scene.load.audio('tick', "assets/audio/impactMetal_medium_002.ogg")
  scene.load.audio('woe', "assets/audio/lowDown.ogg")
  scene.load.audio('three', "assets/audio/lowThreeTone.ogg")
  scene.load.audio('beboop', "assets/audio/pepSound1.ogg")
  scene.load.audio('bip', "assets/audio/tone1.ogg")
  scene.load.audio('lose', "assets/audio/you_lose.ogg")
  scene.load.audio('win', "assets/audio/you_win.ogg")
  scene.load.audio('plop', "assets/audio/impactPlate_heavy_004.ogg")
  scene.load.audio('fail', "assets/audio/back_001.ogg")
}

export function preloadImages(scene: Scene) {
  scene.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json')
  scene.load.image('fire', 'assets/particles/fire_01.png')
  scene.load.image('smoke', 'assets/particles/smoke_01.png')
  scene.load.image('ice', 'assets/particles/star_08.png')
  scene.load.image('rain', 'assets/particles/trace_01.png')
  scene.load.image('snow', 'assets/particles/star_05.png')
  scene.load.image('spark', 'assets/particles/spark_04.png')
  scene.load.image('slash', 'assets/particles/slash_03.png')
  scene.load.image('muzzle', 'assets/particles/muzzle_01.png')

  // First Explosion image is 583x536, but they are not all the same size
  // Todo: Consider making a (smaller, already capturing frames) tilesheet
  for (let i = 0; i < 8; i++) {
    const key = `explosion0${i}`
    const asset = `assets/explosion/${key}.png`
    scene.load.image(key, asset)
  }
}

// Note: Tower textures need to be loaded by TPlayScene
export function preloadTextures(scene: Scene) {
  makePathTiles(scene, "path_tiles", 64, 64)
  makeHeightRects(scene, "height_cells", 64, 64, 10)
  makeLandscapeTile(scene, "grass", { size: { x: 64, y: 64 }, options: { type: "grass" } })

  generateEnemies(scene)

  makeNineSlice(scene, "nine_slice", { size: { x: 100, y: 100 }, options: { margin: 0.2 } })
}
