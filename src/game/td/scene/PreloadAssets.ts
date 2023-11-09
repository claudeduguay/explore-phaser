import { Loader, Scene } from "phaser"
import { makeArrow, makeHeightRects, makeLandscapeTile, makeNineSlice, makePathTiles, makeMissile, makeMine, makeBullet, makeGrenade, makeCone, makeIcon } from "../assets/TextureFactory"
import { generateEnemies } from "../entity/model/IEnemyModel"
import FontFaceObserver from "fontfaceobserver"
import { makeButtonTextures, registerButtonFactory } from "../gui/Button"
import { registerLabelFactory } from "../gui/Label"
import { registerLayoutFactory } from "../gui/layout/LayoutContainer"
import { registerTowerFactory } from "../entity/tower/TDTower"
import { registerEnemyFactory } from "../entity/enemy/TDEnemy"
import { registerIconFactory } from "../gui/Icon"
import { makePanelTextures, registerPanelFactory } from "../gui/Panel"
import { registerStateMachineFactory } from "../../../util/StateMachine"
import { registerParagraphFactory } from "../gui/Paragraph"

// Intreresting repo: https://github.com/samme/phaser-plugin-loader
// Also interesting repo: https://phaserplugins.com/

// Adapt and modernize FontFaceObserver-based WebFont loader
// See: https://github.com/mozdevs/webfont-preloading/blob/master/preloading.js
export class WebFontLoader extends Loader.LoaderPlugin {

  webfont(key: string, fontName: string) {
    // fontName is stored in file's `url` property for use in addFile
    this.addFile(new Loader.File(this, { type: "webfont", key, url: fontName }))
    return this;
  }

  addFile(file: Loader.File) {
    super.addFile(file) // Not loadFile?
    if (file.type === 'webfont' && typeof file.url === "string") {
      // note: file.url contains font name
      const font = new FontFaceObserver(file.url)
      font.load(null, 10000).then(() => this.fileProcessComplete(file))
    }
  }
}

export default function preloadAssets(scene: Scene) {
  registerObjectFactories()
  preloadWebFont(scene)
  preloadAudio(scene)
  preloadImages(scene)
  preloadTextures(scene)
}

export function registerObjectFactories() {

  // GUI Objects
  registerLayoutFactory()
  registerPanelFactory()
  registerButtonFactory()
  registerParagraphFactory()
  registerLabelFactory()
  registerIconFactory()

  // Game Objects
  registerTowerFactory()
  registerEnemyFactory()

  registerStateMachineFactory()
}

export function preloadWebFont(scene: Scene) {
  scene.plugins.installScenePlugin("WebFontLoader", WebFontLoader, "webfont", scene)
  // @ts-ignore - Note: This should be accesible via the load manager but works like this
  scene.webfont.webfont("material-icons-outline", "Material Icons Outlined")
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
  scene.load.image('stun', 'assets/particles/star_01.png')
  scene.load.image('spike', 'assets/particles/trace_01.png')
  scene.load.image('rock', 'assets/particles/dirt_01.png')
  scene.load.image('spark', 'assets/particles/spark_04.png')
  scene.load.image('slash', 'assets/particles/slash_03.png')
  scene.load.image('muzzle', 'assets/particles/muzzle_01.png')
  scene.load.image('light', 'assets/particles/light_01.png')
  scene.load.image('circle', 'assets/particles/circle_01.png')
  scene.load.image('kinetic', 'assets/particles/scorch_01.png')
  scene.load.image('water', 'assets/particles/flame_02.png')
  scene.load.image('earth', 'assets/particles/dirt_02.png')
  scene.load.image('burst', 'assets/particles/star_09.png')
  scene.load.image('beam', 'assets/particles/trace_06.png')
  scene.load.image('cloud', 'assets/particles/circle_05.png')
  scene.load.image('area', 'assets/particles/star_09.png')

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
  makeIcon(scene, "heart", { size: { x: 32, y: 32 }, options: { color: "white", code: 0xe87d } })
  makeCone(scene, "spray-default", { size: { x: 10, y: 16 }, options: { color: "white" } })
  makeArrow(scene, "arrow-default", { size: { x: 10, y: 16 }, options: { color: "white" } })
  makeBullet(scene, "bullet-default", { size: { x: 7, y: 16 }, options: { color: "white" } })
  makeMissile(scene, "missile-default", { size: { x: 15, y: 30 }, options: { color: "white" } })
  makeMine(scene, "mine-default", { size: { x: 16, y: 16 }, options: { color: "white", center: "black" } })
  makeGrenade(scene, "grenade-default", { size: { x: 12, y: 16 }, options: { color: "white", top: "black" } })
  makePathTiles(scene, "path_tiles", 64, 64)
  makeHeightRects(scene, "height_cells", 64, 64, 10)
  makeLandscapeTile(scene, "landscape", { size: { x: 64, y: 64 }, options: { type: "grass" } })

  generateEnemies(scene)

  makeNineSlice(scene, "nine_slice", { size: { x: 100, y: 100 }, options: { margin: 0.2 } })

  makeButtonTextures(scene)
  makePanelTextures(scene)
}

