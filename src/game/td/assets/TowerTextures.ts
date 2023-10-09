import { Display, Scene } from "phaser"
import { IColoring } from "../../../util/DrawUtil"
import { IPlatformOptions, IPlatformType } from "./PlatformFactory"
import { IWeaponOptions } from "./WeaponFactory"
import { ITurretOptions } from "./TurretFactory"
import { ITextureConfig, makeTowerPlatform, makeTowerWeapon, makeTowerTurret } from "./TextureFactory"

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
  THROW: "curve-i",
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
// WEAPON STYLES
// ------------------------------------------------------------------

export function pointWeapon(color: IColoring, ball = true): ITextureConfig<IWeaponOptions> {
  return {
    size: { x: 7, y: 32 },
    options: {
      type: "point", margin: 0, inset: 0.4, line: "white", color,
      balls: ball ? { count: 1, color, start: 0 } : undefined
    }
  }
}

export function funnelWeapon(color: IColoring): ITextureConfig<IWeaponOptions> {
  return {
    size: { x: 7, y: 32 },
    options: { type: "funnel", margin: 0, inset: 0.33, line: "white", color }
  }
}

export function rectWeapon(color: IColoring, ribs = true): ITextureConfig<IWeaponOptions> {
  return {
    size: { x: 7, y: 32 },
    options: {
      type: "rect", margin: 0, inset: 0.4, line: "white", color,
      ribs: ribs ? { count: 3, color, start: 0.08, step: 0.08 } : undefined
    }
  }
}

export function pointInsideWeapon(color: IColoring): ITextureConfig<IWeaponOptions> {
  return {
    size: { x: 7, y: 18 },
    options: { type: "point", margin: 0, inset: 0.0, line: "white", color }
  }
}

export function funnelInsideWeapon(color: IColoring, ball = true): ITextureConfig<IWeaponOptions> {
  return {
    size: { x: 7, y: 18 },
    options: {
      type: "funnel", margin: 0, inset: 0.8, line: "white", color,
      balls: ball ? { count: 1, color: "#FCF", start: 0.7 } : undefined
    }
  }
}

export function rectInsideWeapon(color: IColoring, ball = true): ITextureConfig<IWeaponOptions> {
  return {
    size: { x: 7, y: 18 },
    options: {
      type: "rect", margin: 0, inset: 0.4, line: "white", color,
      balls: ball ? { count: 1, color: ["#FCF"], start: 0 } : undefined
    }
  }
}


// ------------------------------------------------------------------
// TEXTURE CONFIGURATIONS
// ------------------------------------------------------------------

export interface ITextureConfigs {
  platform: ITextureConfig<IPlatformOptions>
  turret: ITextureConfig<ITurretOptions>
  weapon: ITextureConfig<IWeaponOptions>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TOWERS: Record<string, ITextureConfigs> = {

  // SPRAY
  FLAME: {
    platform: platformConfig(PLATFORM.SPRAY, COLORS.FLAME),
    turret: roundFrontTurret(COLORS.FLAME),
    weapon: funnelWeapon(COLORS.FLAME)
  },
  FREEZE: {
    platform: platformConfig(PLATFORM.SPRAY, COLORS.FREEZE),
    turret: roundFrontTurret(COLORS.FREEZE),
    weapon: funnelWeapon(COLORS.FREEZE)
  },
  IMPACT: {
    platform: platformConfig(PLATFORM.SPRAY, COLORS.IMPACT),
    turret: roundFrontTurret(COLORS.IMPACT),
    weapon: funnelWeapon(COLORS.IMPACT)
  },

  // CLOUD
  FIRE: {
    platform: platformConfig(PLATFORM.CLOUD, COLORS.FIRE),
    turret: roundTurret(COLORS.FIRE),
    weapon: pointInsideWeapon(COLORS.FIRE)
  },
  POISON: {
    platform: platformConfig(PLATFORM.CLOUD, COLORS.POISON),
    turret: roundTurret(COLORS.POISON),
    weapon: pointInsideWeapon(COLORS.POISON)
  },
  SMOKE: {
    platform: platformConfig(PLATFORM.CLOUD, COLORS.SMOKE),
    turret: roundTurret(COLORS.SMOKE),
    weapon: pointInsideWeapon(COLORS.SMOKE)
  },
  SHOCK: {
    platform: platformConfig(PLATFORM.CLOUD, COLORS.SHOCK),
    turret: roundTurret(COLORS.SHOCK),
    weapon: pointInsideWeapon(COLORS.SHOCK)
  },
  ICE: {
    platform: platformConfig(PLATFORM.CLOUD, COLORS.ICE),
    turret: roundTurret(COLORS.ICE),
    weapon: pointInsideWeapon(COLORS.ICE)
  },

  // FALL
  RAIN: {
    platform: platformConfig(PLATFORM.FALL, COLORS.RAIN),
    turret: roundTurret(COLORS.RAIN),
    weapon: pointInsideWeapon(COLORS.RAIN)
  },
  SNOW: {
    platform: platformConfig(PLATFORM.FALL, COLORS.SNOW),
    turret: roundTurret(COLORS.SNOW),
    weapon: pointInsideWeapon(COLORS.SNOW)
  },

  // BEAM
  LAZER: {
    platform: platformConfig(PLATFORM.BEAM, COLORS.LAZER),
    turret: smallTurret(COLORS.LAZER),
    weapon: rectWeapon(COLORS.LAZER)
  },
  PLASMA: {
    platform: platformConfig(PLATFORM.BEAM, COLORS.PLASMA),
    turret: smallTurret(COLORS.PLASMA),
    weapon: pointWeapon(COLORS.PLASMA)
  },
  LIGHTNING: {
    platform: platformConfig(PLATFORM.BEAM, COLORS.LIGHTNING),
    turret: smallTurret(COLORS.LIGHTNING),
    weapon: pointWeapon(COLORS.LIGHTNING)
  },

  // THROW
  BULLET: {
    platform: platformConfig(PLATFORM.THROW, COLORS.BULLET),
    turret: roundBackTurret(COLORS.BULLET),
    weapon: rectWeapon(COLORS.BULLET)
  },
  MISSILE: {
    platform: platformConfig(PLATFORM.THROW, COLORS.MISSILE),
    turret: roundBackTurret(COLORS.MISSILE),
    weapon: rectWeapon(COLORS.MISSILE, false)
  },

  // AREA
  BOOST: {
    platform: platformConfig(PLATFORM.AREA, COLORS.BOOST),
    turret: roundTurret(COLORS.BOOST),
    weapon: funnelInsideWeapon(COLORS.BOOST)
  },
  SLOW: {
    platform: platformConfig(PLATFORM.AREA, COLORS.SLOW),
    turret: roundTurret(COLORS.SLOW),
    weapon: rectInsideWeapon(COLORS.SLOW)
  }
}

export default function registerTowerTextures(scene: Scene) {
  for (let [key, { platform, turret, weapon }] of Object.entries(TOWERS)) {
    key = key.toLowerCase()
    makeTowerPlatform(scene, `${key}-platform`, platform)
    makeTowerTurret(scene, `${key}-turret`, turret)
    makeTowerWeapon(scene, `${key}-weapon`, weapon)
  }
}
