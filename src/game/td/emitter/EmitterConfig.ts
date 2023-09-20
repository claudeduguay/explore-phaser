import { Types, Math as PMath } from "phaser"

// Best docs: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/particles/
// Easing functions: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ease-function/

type EmitterConfig = Types.GameObjects.Particles.ParticleEmitterConfig

export const cloudEmitter: EmitterConfig = {
  alpha: 0.25,
  color: [0x009900, 0x00FF00, 0x009900, 0x000000],
  colorEase: PMath.Easing.Quadratic.Out.name,
  lifespan: 1000,
  advance: 0,
  angle: { min: 0, max: 360 },
  rotate: { min: 0, max: 360 },
  scale: { start: 0.5, end: 0.8, ease: 'sine.out' },
  speed: 1,
  blendMode: 'NORMAL',
}

export const fireEmitter: EmitterConfig = {
  color: [0xffffff, 0xfacc22, 0xf89800, 0xf83600],
  colorEase: PMath.Easing.Quadratic.Out.name,
  lifespan: 3000,
  advance: 5000,
  angle: { min: 5, max: -5 },  // 90 +/- 5
  rotate: { start: 0, end: 360 },
  scale: { start: 0.01, end: 0.1, ease: 'sine.out' },
  speed: 100,
  blendMode: 'ADD',
}

export const flameEmitter: EmitterConfig = {
  frame: 'white',
  color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
  colorEase: 'quad.out',
  lifespan: 2400,
  angle: { min: -100, max: -80 },
  scale: { start: 0.70, end: 0, ease: 'sine.out' },
  speed: 100,
  advance: 2000,
  blendMode: 'ADD'
}

export const wispEmitter: EmitterConfig = {
  frame: 'white',
  color: [0x96e0da, 0x937ef3],
  colorEase: 'quart.out',
  lifespan: 1500,
  angle: { min: -100, max: -80 },
  scale: { start: 1, end: 0, ease: 'sine.in' },
  speed: { min: 250, max: 350 },
  advance: 2000,
  blendMode: 'ADD'
}

export const smokeyEmitter: EmitterConfig = {
  frame: 'white',
  color: [0x040d61, 0xfacc22, 0xf89800, 0xf83600, 0x9f0404, 0x4b4a4f, 0x353438, 0x040404],
  lifespan: 1500,
  angle: { min: -100, max: -80 },
  scale: 0.75,
  speed: { min: 200, max: 300 },
  advance: 2000,
  blendMode: 'ADD'
}
