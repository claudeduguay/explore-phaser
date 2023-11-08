// Adapted From: https://codepen.io/satya4satyanm/pen/YzRMXGd

import { GameObjects, Scene } from "phaser"
const { Between, FloatBetween } = Phaser.Math;
const { GetRandom } = Phaser.Utils.Array;

const hexColors = {
  aqua: 0x7fdbff,
  black: 0x111111,
  blue: 0x0074d9,
  fuchsia: 0xf012be,
  gray: 0xaaaaaa,
  green: 0x2ecc40,
  lime: 0x01ff70,
  maroon: 0x85144b,
  navy: 0x001f3f,
  olive: 0x3d9970,
  orange: 0xff851b,
  purple: 0xb10dc9,
  red: 0xff4136,
  silver: 0xdddddd,
  teal: 0x39cccc,
  white: 0xffffff,
  yellow: 0xffdc00
}

const {
  red,
  orange,
  yellow,
  lime,
  green,
  aqua,
  blue,
  fuchsia,
  purple
} = hexColors

const tints = [
  red,
  orange,
  yellow,
  lime,
  green,
  aqua,
  blue,
  fuchsia,
  purple
]

const emitterConfig: any = {
  alpha: { start: 1, end: 0, ease: "Quad.easeOut" },
  angle: { start: 0, end: 360, steps: 100 },
  blendMode: "SCREEN",
  emitting: false,
  frequency: -1,
  gravityY: 200,
  lifespan: 1500,
  quantity: 500,
  reserve: 500,
  rotate: { min: 0, max: 45 },
  speed: { min: 0, max: 256 }
}

export class Fireworks extends Scene {

  renderTexture: any
  emitters: GameObjects.Particles.ParticleEmitter[] = []

  constructor() {
    super("fireworks")
  }

  init() {
    this.textures.generate("rocket", {
      data: ["0123..."],
      // @ts-ignore
      palette: {
        0: "#fff2",
        1: "#fff4",
        2: "#fff8",
        3: "#ffff"
      },
      pixelWidth: 4
    })
  }

  addEmitter(): GameObjects.Particles.ParticleEmitter {
    const emitter = this.make.particles({ key: "rocket", config: emitterConfig }, false)
    const freq = 1000 + 2000 * Math.random()
    this.time.addEvent({
      delay: freq,
      startAt: Between(0, freq),
      repeat: -1,
      callback: () => {
        this.updateEmitter(emitter)
      }
    })
    return emitter
  }

  create() {
    const { width, height } = this.scale
    this.renderTexture = this.add.renderTexture(0, 0, width, height)
      .setOrigin(0, 0)
      .setBlendMode("ADD");

    this.emitters = []
    const emitterCount = 3
    for (let i = 0; i < emitterCount; i++) {
      this.emitters.push(this.addEmitter())
    }
  }

  update(time: number, delta: number) {
    this.renderTexture
      .fill(0, 0.005 * delta)
      .draw(this.emitters);
  }

  updateEmitter(emitter: GameObjects.Particles.ParticleEmitter) {
    const { width, height } = this.scale
    emitter
      .setPosition(width * FloatBetween(0.25, 0.75), height * FloatBetween(0.25, 0.75))
      .setParticleTint(GetRandom(tints))
      .explode()
  }
}
