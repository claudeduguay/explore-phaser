import { Types, Math as PMath, Geom } from "phaser"
import Point, { IPointLike } from "../../../util/Point"
import { lerp } from "../../../util/MathUtil"

// Best docs: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/particles/
// Easing functions: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ease-function/
// Particle Assets: R:\Kenney-Assets\particles\particlePack_1.1\PNG (Transparent)

export type IEmitterConfig = Types.GameObjects.Particles.ParticleEmitterConfig
export type IEmitterConfigBuilder = (range: number, pos: IPointLike) => IEmitterConfig
export type IEmitterDeathZoneConfig = Types.GameObjects.Particles.ParticleEmitterDeathZoneConfig
export type IEmitterRandomeZoneConfig = Types.GameObjects.Particles.ParticleEmitterRandomZoneConfig
export type IEmitterEdgeZoneConfig = Types.GameObjects.Particles.ParticleEmitterEdgeZoneConfig

// ------------------------------------------------------------------
// EMIT AND DEATH ZONES
// ------------------------------------------------------------------

export const circleEmitZone =
  (range: number, pos: IPointLike): IEmitterRandomeZoneConfig => {
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

// Upper arc of tower's range
export const edgeEmitZone =
  (range: number, pos: IPointLike): IEmitterEdgeZoneConfig => {
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
export const rangeDeathZone =
  (range: number, pos: IPointLike): IEmitterDeathZoneConfig => {
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


// ------------------------------------------------------------------
// CLOUD EMITTERS
// ------------------------------------------------------------------

export const commonCloud: IEmitterConfigBuilder =
  (range: number = 100, pos: IPointLike): IEmitterConfig => {
    return {
      colorEase: PMath.Easing.Linear.name,
      advance: 0,
      lifespan: 3000,
      angle: { min: 0, max: 360 },
      rotate: { min: 0, max: 360 },
      speed: 0.1,
      blendMode: 'NORMAL',
      emitZone: circleEmitZone(range, pos),
      deathZone: rangeDeathZone(range, pos)
    }
  }

export const poisonEmitter: IEmitterConfigBuilder =
  (range: number = 80, pos: IPointLike): IEmitterConfig => {
    return {
      ...commonCloud(range, pos),
      alpha: { start: 0.2, end: 0 },
      color: [0x009900, 0x00FF00, 0x009900],
      scale: { start: 0.25, end: 0.75, ease: 'sine.out' },
    }
  }

export const smokeEmitter: IEmitterConfigBuilder =
  (range: number = 80, pos: IPointLike): IEmitterConfig => {
    return {
      ...commonCloud(range, pos),
      alpha: { start: 0.2, end: 0 },
      color: [0x999999, 0xCCCCCC, 0x999999],
      scale: { start: 0.25, end: 0.75, ease: 'sine.out' },
    }
  }

export const fireEmitter: IEmitterConfigBuilder =
  (range: number = 80, pos: IPointLike): IEmitterConfig => {
    return {
      ...commonCloud(range, pos),
      alpha: { start: 0.1, end: 0 },
      color: [0xfacc22, 0xf89800, 0xf83600, 0x000000],
      scale: { start: 0.25, end: 0.75, ease: 'sine.out' },
    }
  }

export const iceEmitter: IEmitterConfigBuilder =
  (range: number = 80, pos: IPointLike): IEmitterConfig => {
    return {
      ...commonCloud(range, pos),
      alpha: { start: 0.33, end: 0 },
      color: [0x6699ff],
      scale: { start: 0.15, end: 0.2, ease: 'sine.out' },
    }
  }

export const shockEmitter: IEmitterConfigBuilder =
  (range: number = 80, pos: IPointLike): IEmitterConfig => {
    return {
      ...commonCloud(range, pos),
      alpha: { start: 0.33, end: 0 },
      color: [0x00ffff],
      scale: { start: 0.25, end: 0.75, ease: 'sine.out' },
    }
  }

export const sleepEmitter: IEmitterConfigBuilder =
  (range: number = 80, pos: IPointLike): IEmitterConfig => {
    return {
      ...commonCloud(range, pos),
      alpha: { start: 0.3, end: 0 },
      color: [0xffffff, 0x999999, 0xffffff],
      scale: { start: 0.25, end: 0.75, ease: 'sine.out' },
      speed: 0.05
    }
  }


// ------------------------------------------------------------------
// DROP (GRAVITY) EMITTERS
// ------------------------------------------------------------------

export const commonFall: IEmitterConfigBuilder =
  (range: number = 100, pos: IPointLike): IEmitterConfig => {
    return {
      colorEase: PMath.Easing.Linear.name,
      advance: 0,
      lifespan: 3000,
      angle: 90,
      rotate: 0,
      speed: 100,
      blendMode: 'NORMAL',
      emitZone: edgeEmitZone(range, pos),
      deathZone: rangeDeathZone(range, pos)
    }
  }


export const rainEmitter: IEmitterConfigBuilder =
  (range: number = 100, pos: IPointLike): IEmitterConfig => {
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

export const snowEmitter: IEmitterConfigBuilder =
  (range: number = 100, pos: IPointLike): IEmitterConfig => {
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

export const commonSpray: IEmitterConfigBuilder =
  (range: number = 100, pos: IPointLike): IEmitterConfig => {
    const speed = 100
    const travelPerSecond = speed / 1000
    const lifespan = (range * 1.25) / travelPerSecond
    return {
      advance: 0,
      lifespan,
      speed,
      colorEase: PMath.Easing.Quadratic.Out.name,
      angle: { min: 5, max: -5 },  // 90 +/- 5
      rotate: { min: 0, max: 360 },
      blendMode: 'ADD',
      deathZone: rangeDeathZone(range, pos)
    }
  }

export const flameEmitter: IEmitterConfigBuilder =
  (range: number = 100, pos: IPointLike): IEmitterConfig => {
    return {
      ...commonSpray(range, pos),
      alpha: { start: 0.75, end: 0.25 },
      color: [0x0000FF, 0xfacc22, 0xf89800, 0xf83600, 0x000000],
      scale: { start: 0.005, end: 0.15, ease: 'sine.out' },
    }
  }

export const freezeEmitter: IEmitterConfigBuilder =
  (range: number = 100, pos: IPointLike): IEmitterConfig => {
    return {
      ...commonSpray(range, pos),
      alpha: { start: 1, end: 0 },
      color: [0x00ffff, 0x009999, 0x003333],
      scale: { start: 0.01, end: 0.2, ease: 'sine.out' },
    }
  }

export const forceEmitter: IEmitterConfigBuilder =
  (range: number = 100, pos: IPointLike): IEmitterConfig => {
    return {
      ...commonSpray(range, pos),
      speed: 300,
      alpha: 1.0, // { start: 0.75, end: 0.25 },
      color: [0xffffff],
      angle: { min: -2, max: 2 },
      rotate: 0,
      scale: { start: 0.01, end: 0.5, ease: 'sine.out' },
      blendMode: 'NORMAL',
    }
  }

// Considering the use of an emitter for bullet trails
export const bulletEmitter: IEmitterConfigBuilder =
  (range: number = 100, pos: IPointLike): IEmitterConfig => {
    return {
      ...commonSpray(range, pos),
      speed: 400,
      alpha: 1.0, // { start: 0.75, end: 0.25 },
      color: [0x00ffff, 0x009999, 0x003333],
      angle: 0,
      rotate: 0,
      scale: { start: 0.01, end: 0.3, ease: 'sine.out' },
      blendMode: 'ADD',
    }
  }


// ------------------------------------------------------------------
// EMITTER SAMPLES
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