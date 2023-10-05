import { Types, Math as PMath, Geom } from "phaser"
import Point, { IPointLike } from "../../../util/Point"
import { lerp } from "../../../util/MathUtil"

// Best docs: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/particles/
// Easing functions: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ease-function/
// Particle Assets: R:\Kenney-Assets\particles\particlePack_1.1\PNG (Transparent)

type EmitterConfig = Types.GameObjects.Particles.ParticleEmitterConfig

// ------------------------------------------------------------------
// CLOUD EMITTERS
// ------------------------------------------------------------------

export function circleEmitZone(range: number) {
  return {
    type: 'random',
    source: {
      getRandomPoint: (point: Phaser.Types.Math.Vector2Like) => {
        const a = Math.PI * 2 * Math.random()
        const r = Math.random() * range
        point.x = Math.sin(a) * r
        point.y = Math.cos(a) * r
      }
    }
  }
}

export function commonCloud(range: number = 100): Partial<EmitterConfig> {
  return {
    colorEase: PMath.Easing.Linear.name,
    advance: 0,
    lifespan: 3000,
    angle: { min: 0, max: 360 },
    rotate: { min: 0, max: 360 },
    speed: 0.1,
    blendMode: 'NORMAL',
    emitZone: circleEmitZone(range)
  }
}

export function poisonEmitter(range: number = 80): EmitterConfig {
  return {
    ...commonCloud(range),
    alpha: { start: 0.2, end: 0 },
    color: [0x009900, 0x00FF00, 0x009900],
    scale: { start: 0.25, end: 0.75, ease: 'sine.out' },
  }
}

export function smokeEmitter(range: number = 80): EmitterConfig {
  return {
    ...commonCloud(range),
    alpha: { start: 0.2, end: 0 },
    color: [0x999999, 0xCCCCCC, 0x999999],
    scale: { start: 0.25, end: 0.75, ease: 'sine.out' },
  }
}

export function fireEmitter(range: number = 80): EmitterConfig {
  return {
    ...commonCloud(range),
    alpha: { start: 0.1, end: 0 },
    color: [0xfacc22, 0xf89800, 0xf83600, 0x000000],
    scale: { start: 0.25, end: 0.75, ease: 'sine.out' },
  }
}

export function iceEmitter(range: number = 80): EmitterConfig {
  return {
    ...commonCloud(range),
    alpha: { start: 0.33, end: 0 },
    color: [0x6699ff],
    scale: { start: 0.15, end: 0.2, ease: 'sine.out' },
  }
}

export function shockEmitter(range: number = 80): EmitterConfig {
  return {
    ...commonCloud(range),
    alpha: { start: 0.33, end: 0 },
    color: [0x00ffff],
    scale: { start: 0.25, end: 0.75, ease: 'sine.out' },
  }
}

export function sleepEmitter(range: number = 80): EmitterConfig {
  return {
    ...commonCloud(range),
    alpha: { start: 0.3, end: 0 },
    color: [0xffffff, 0x999999, 0xffffff],
    scale: { start: 0.25, end: 0.75, ease: 'sine.out' },
    speed: 0.05
  }
}


// ------------------------------------------------------------------
// DROP (GRAVITY) EMITTERS
// ------------------------------------------------------------------

// Upper arc of tower's range
export function edgeEmitZone(range: number): Types.GameObjects.Particles.ParticleEmitterEdgeZoneConfig {
  return {
    type: 'edge',
    quantity: 200,
    source: {
      getPoints: (quantity: number) => {
        const points = []
        for (let i = 0; i < quantity; i++) {
          const a = lerp(Math.PI, Math.PI * 2, Math.random())
          const x = Math.cos(a) * range
          const y = Math.sin(a) * range
          points.push(new Point(x, y))
        }
        return points
      }
    }
  }
}

// Points appear to be relative to the scene, not the emitter, so this is a problem w/o access to the emitter position
// Reported at: https://github.com/photonstorm/phaser/issues/6371
export function edgeDeathZone(range: number, pos: IPointLike): Types.GameObjects.Particles.ParticleEmitterDeathZoneConfig {
  return {
    type: 'onLeave',
    source: new Geom.Circle(pos.x, pos.y, range)
    // source: {
    //   contains: (x: number, y: number) => {
    //     const point = new Point(x - cx, y - cy)
    //     const radius = point.length()
    //     console.log("Point radius:", point, radius)
    //     return radius < range
    //   }
    // }
  }
}

export function commonFall(range: number = 100, pos: IPointLike): Partial<EmitterConfig> {
  return {
    colorEase: PMath.Easing.Linear.name,
    advance: 0,
    lifespan: 3000,
    angle: 90,
    rotate: 0,
    speed: 100,
    blendMode: 'NORMAL',
    emitZone: edgeEmitZone(range),
    deathZone: edgeDeathZone(range, pos)
  }
}


export function rainEmitter(range: number = 100, pos: IPointLike): EmitterConfig {
  const speed = 100
  return {
    ...commonFall(range, pos),
    alpha: 1.0,
    color: [0x6666ff],
    speed,
    scale: 0.075,
    blendMode: 'ADD',
  }
}

export function snowEmitter(range: number = 100, pos: IPointLike): EmitterConfig {
  const speed = 100
  return {
    ...commonFall(range, pos),
    alpha: 1.0,
    color: [0xffffff],
    speed,
    scale: 0.05,
    blendMode: 'ADD',
  }
}


// ------------------------------------------------------------------
// SPRAY EMITTERS
// ------------------------------------------------------------------

export function commonSpray(range: number = 100): Partial<EmitterConfig> {
  return {
  }
}

export function flameEmitter(range: number = 100): EmitterConfig {
  const speed = 100
  const travelPerSecond = speed / 1000
  // Distance traveled is range divided by travelPerSecond
  // Note, we add 25% to range to wrap the enemy
  const lifespan = (range * 1.25) / travelPerSecond
  return {
    gravityY: 0,
    alpha: { start: 0.75, end: 0.25 },
    color: [0xfacc22, 0xf89800, 0xf83600, 0x000000],
    colorEase: PMath.Easing.Quadratic.Out.name,
    lifespan,
    speed,
    advance: 0,
    angle: { min: 5, max: -5 },  // 90 +/- 5
    rotate: { start: 0, end: 360 },
    scale: { start: 0.005, end: 0.15, ease: 'sine.out' },
    blendMode: 'ADD',
    // deathZone: {
    //   type: 'onEnter',
    //   source: {
    //     contains: (x: number, y: number): boolean => {
    //       const dist = PMath.Distance.Between(posX, posY, x, y)
    //       // console.log(`${x}, ${y}, ${dist}`)
    //       return dist > range
    //     }
    //   }
    // }
  }
}

export function freezeEmitter(range: number = 100): EmitterConfig {
  const speed = 100
  const travelPerSecond = speed / 1000
  // Distance traveled is range divided by travelPerSecond
  // Note, we add 25% to range to wrap the enemy
  const lifespan = (range * 1.25) / travelPerSecond
  return {
    gravityY: 0,
    alpha: { start: 1, end: 0 },
    color: [0x00ffff, 0x009999, 0x003333],
    colorEase: PMath.Easing.Quadratic.Out.name,
    lifespan,
    speed,
    advance: 0,
    angle: { min: 5, max: -5 },  // 90 +/- 5
    rotate: { min: 0, max: 360 },
    scale: { start: 0.01, end: 0.2, ease: 'sine.out' },
    blendMode: 'ADD',
  }
}

export function impactEmitter(range: number = 100): EmitterConfig {
  const speed = 100
  const travelPerSecond = speed / 1000
  // Distance traveled is range divided by travelPerSecond
  // Note, we add 25% to range to wrap the enemy
  const lifespan = (range * 1.25) / travelPerSecond
  return {
    gravityY: 0,
    alpha: 1.0, // { start: 0.75, end: 0.25 },
    color: [0x00ffff, 0x009999, 0x003333],
    colorEase: PMath.Easing.Quadratic.Out.name,
    lifespan,
    speed,
    advance: 0,
    angle: 0,
    rotate: 0,
    scale: { start: 0.01, end: 0.3, ease: 'sine.out' },
    blendMode: 'ADD',
  }
}


// ------------------------------------------------------------------
// SAMPLE EMITTERS
// ------------------------------------------------------------------
/*
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
*/