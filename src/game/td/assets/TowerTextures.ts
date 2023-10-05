import { Display, Scene } from "phaser"
import { IColoring } from "../../../util/DrawUtil"
import { IPlatformOptions, IPlatformType } from "./PlatformFactory"
import { IProjectorOptions } from "./ProjectorFactory"
import { ITurretOptions } from "./TurretFactory"
import { ITextureConfig, makeTowerPlatform, makeTowerProjector, makeTowerTurret } from "./TextureFactory"

// ------------------------------------------------------------------
// COLOR STYLES
// ------------------------------------------------------------------

export function colors(h: number, s: number = 1, l: number = 0.1) {
  const color = Display.Color.HSLToColor(h, s, l)
  return [
    color.brighten(25).rgba,
    color.rgba,
    color.darken(25).rgba
  ]
}

export const COLORS: { [key: string]: IColoring } = {
  // Spray
  FLAME: colors(0.0),
  FREEZE: colors(0.5),
  IMPACT: colors(0.15),
  // Cloud
  POISON: colors(0.3),
  FIRE: colors(0.95),
  SMOKE: colors(0, 1.0, 0),
  SHOCK: colors(0.5),
  ICE: colors(0.7),
  // Fall
  RAIN: colors(0.55),
  SNOW: colors(0, 0, 0.35),
  // Beam
  LAZER: colors(0.6),
  PLASMA: colors(0.65),
  LIGHTNING: colors(0.7),
  // Throw
  BULLET: colors(0.2),
  MISSILE: colors(0.4),
  // Area
  BOOST: colors(0.9),
  SLOW: colors(0.8),
}


// ------------------------------------------------------------------
// PLATFORM STYLES
// ------------------------------------------------------------------

const PLATFORM: Record<string, IPlatformType> = {
  SPRAY: "angle",
  CLOUD: "curve-o",
  FALL: "ntagon",
  BEAM: "curve-i",
  THROW: "box-i",
  AREA: "box-o"
}

export function platformConfig(type: IPlatformType, color: IColoring, divisions: number = 8) {
  return {
    size: { x: 64, y: 64 },
    options: { type, divisions, color }
  }
}

// ------------------------------------------------------------------
// TURRET STYLES
// ------------------------------------------------------------------

export function smallTurret(color: IColoring) {
  return {
    size: { x: 48, y: 30 },
    options: { ratio: 0.6, topSeg: 3, botSeg: 10, color }

  }
}

export function roundTurret(color: IColoring) {
  return {
    size: { x: 38, y: 38 },
    options: { ratio: 0.5, topSeg: 10, botSeg: 10, color }
  }
}

export function roundFrontTurret(color: IColoring) {
  return {
    size: { x: 42, y: 36 },
    options: { ratio: 0.33, topSeg: 10, botSeg: 3, color }
  }
}

export function roundBackTurret(color: IColoring) {
  return {
    size: { x: 42, y: 36 },
    options: { ratio: 0.66, topSeg: 3, botSeg: 10, color }
  }
}

// ------------------------------------------------------------------
// PROJECTOR STYLES
// ------------------------------------------------------------------

export function funnelShortProjector(color: IColoring): ITextureConfig<IProjectorOptions> {
  return {
    size: { x: 7, y: 22 },
    options: { type: "point", margin: 0, inset: 0.0, line: "white", color }
  }
}

export function funnelOutProjector(color: IColoring): ITextureConfig<IProjectorOptions> {
  return {
    size: { x: 7, y: 32 },
    options: { type: "funnel", margin: 0, inset: 0.33, line: "white", color }
  }
}

export function gunProjector(color: IColoring, ribs = true): ITextureConfig<IProjectorOptions> {
  return {
    size: { x: 7, y: 32 },
    options: {
      type: "rect", margin: 0, inset: 0.4, line: "white", color,
      ribs: ribs ? { count: 3, color, start: 0.08, step: 0.08 } : undefined
    }
  }
}

export function funnelInProjector(color: IColoring, ball = true): ITextureConfig<IProjectorOptions> {
  return {
    size: { x: 7, y: 32 },
    options: {
      type: "point", margin: 0, inset: 0.4, line: "white", color,
      balls: ball ? { count: 1, color, start: 0 } : undefined
    }
  }
}

// ------------------------------------------------------------------
// TEXTURE CONFIGURATIONS
// ------------------------------------------------------------------

export interface ITextureConfigs {
  platform: ITextureConfig<IPlatformOptions>
  turret: ITextureConfig<ITurretOptions>
  projector: ITextureConfig<IProjectorOptions>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TOWERS: Record<string, ITextureConfigs> = {

  // SPRAY
  FLAME: {
    platform: platformConfig(PLATFORM.SPRAY, COLORS.FLAME),
    turret: roundFrontTurret(COLORS.FLAME),
    projector: funnelOutProjector(COLORS.FLAME)
  },
  FREEZE: {
    platform: platformConfig(PLATFORM.SPRAY, COLORS.FREEZE),
    turret: roundFrontTurret(COLORS.FREEZE),
    projector: funnelOutProjector(COLORS.FREEZE)
  },
  IMPACT: {
    platform: platformConfig(PLATFORM.SPRAY, COLORS.IMPACT),
    turret: roundFrontTurret(COLORS.IMPACT),
    projector: funnelOutProjector(COLORS.FREEZE)
  },

  // CLOUD
  FIRE: {
    platform: platformConfig(PLATFORM.CLOUD, COLORS.FIRE),
    turret: roundTurret(COLORS.FIRE),
    projector: funnelShortProjector(COLORS.FIRE)
  },
  POISON: {
    platform: platformConfig(PLATFORM.CLOUD, COLORS.POISON),
    turret: roundTurret(COLORS.POISON),
    projector: funnelShortProjector(COLORS.POISON)
  },
  SMOKE: {
    platform: platformConfig(PLATFORM.CLOUD, COLORS.SMOKE),
    turret: roundTurret(COLORS.SMOKE),
    projector: funnelShortProjector(COLORS.SMOKE)
  },
  SHOCK: {
    platform: platformConfig(PLATFORM.CLOUD, COLORS.SHOCK),
    turret: roundTurret(COLORS.SHOCK),
    projector: funnelShortProjector(COLORS.SHOCK)
  },
  ICE: {
    platform: platformConfig(PLATFORM.CLOUD, COLORS.ICE),
    turret: roundTurret(COLORS.ICE),
    projector: funnelShortProjector(COLORS.ICE)
  },

  // FALL
  RAIN: {
    platform: platformConfig(PLATFORM.FALL, COLORS.RAIN),
    turret: roundTurret(COLORS.RAIN),
    projector: funnelShortProjector(COLORS.RAIN)
  },
  SNOW: {
    platform: platformConfig(PLATFORM.FALL, COLORS.SNOW),
    turret: roundTurret(COLORS.SNOW),
    projector: funnelShortProjector(COLORS.SNOW)
  },

  // BEAM
  LAZER: {
    platform: platformConfig(PLATFORM.BEAM, COLORS.LAZER),
    turret: smallTurret(COLORS.LAZER),
    projector: gunProjector(COLORS.LAZER)
  },
  PLASMA: {
    platform: platformConfig(PLATFORM.BEAM, COLORS.PLASMA),
    turret: smallTurret(COLORS.PLASMA),
    projector: funnelInProjector(COLORS.PLASMA)
  },
  LIGHTNING: {
    platform: platformConfig(PLATFORM.BEAM, COLORS.LIGHTNING),
    turret: smallTurret(COLORS.LIGHTNING),
    projector: funnelInProjector(COLORS.LIGHTNING)
  },

  // THROW
  BULLET: {
    platform: platformConfig(PLATFORM.THROW, COLORS.BULLET),
    turret: roundBackTurret(COLORS.BULLET),
    projector: gunProjector(COLORS.BULLET)
  },
  MISSILE: {
    platform: platformConfig(PLATFORM.THROW, COLORS.MISSILE),
    turret: roundBackTurret(COLORS.MISSILE),
    projector: gunProjector(COLORS.MISSILE, false)
  },

  // AREA
  BOOST: {
    platform: platformConfig(PLATFORM.AREA, COLORS.BOOST),
    turret: {
      size: {
        x: 42,
        y: 42
      },
      options: {
        ratio: 0.5,
        topSeg: 10,
        botSeg: 10,
        color: COLORS.BOOST
      }
    },
    projector: {
      size: {
        x: 7,
        y: 18
      },
      options: {
        type: "funnel",
        margin: 0,
        inset: 0.8,
        color: COLORS.BOOST,
        balls: { count: 1, color: ["#FCF"], start: 0.7 },
        line: "white"
      },
    }
  },
  SLOW: {
    platform: platformConfig(PLATFORM.AREA, COLORS.SLOW),
    turret: {
      size: {
        x: 42,
        y: 42
      },
      options: {
        ratio: 0.5,
        topSeg: 10,
        botSeg: 10,
        color: COLORS.SLOW
      }
    },
    projector: {
      size: {
        x: 7,
        y: 18
      },
      options: {
        type: "rect",
        margin: 0,
        inset: 0.4,
        color: COLORS.SLOW,
        balls: { count: 1, color: ["#FCF"], start: 0 },
        line: "white"
      }
    }
  }

}

export default function registerTowerTextures(scene: Scene) {
  for (let [key, { platform, turret, projector }] of Object.entries(TOWERS)) {
    key = key.toLowerCase()
    makeTowerPlatform(scene, `${key}-platform`, platform)
    makeTowerTurret(scene, `${key}-turret`, turret)
    makeTowerProjector(scene, `${key}-projector`, projector)
  }
}
