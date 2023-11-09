import { Display, Scene } from "phaser"
import { IColoring } from "../../../util/DrawUtil"
import { IPlatformOptions, IPlatformType, ICorners, corners, ICornerType, edges } from "./PlatformFactory"
import { IWeaponOptions } from "./WeaponFactory"
import { ITurretOptions } from "./TurretFactory"
import { ITextureConfig, makePlatform, makeWeapon, makeTurret } from "./TextureFactory"
import { box } from "../../../util/geom/Box"
import { TOWER_LIST, GENERATED_LIST, ITowerOrganize } from "../entity/model/ITowerModel"
import { DAMAGE_DATA, IDeliveryType } from "../entity/model/ITowerData"

// ------------------------------------------------------------------
// OLD COLOR STYLES
// ------------------------------------------------------------------

export function colors(h: number, s: number = 1, l: number = 0.1) {
  const color = Display.Color.HSLToColor(h, s, l)
  return [
    color.clone().brighten(30).rgba,
    color.rgba,
    color.clone().darken(10).rgba
  ]
}

export const COLORS: { [key: string]: IColoring } = {
  // Spray
  FLAME: colors(0.0),
  FREEZE: colors(0.5),
  FORCE: colors(0.15),
  // Cloud
  POISON: colors(0.3),
  FIRE: colors(0.95),
  SMOKE: colors(0, 1.0, 0),
  SHOCK: colors(0.5),
  ICE: colors(0.7),
  // Fall
  RAIN: colors(0.55),
  SNOW: colors(0, 0, 0.35),
  STUN: colors(0.45),
  // Expand
  SPIKE: colors(0.1),
  ROCK: colors(0.8),
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
// OLD PLATFORM STYLES
// ------------------------------------------------------------------

interface ITypeAndCorners {
  type: IPlatformType
  corners: ICorners
}

export const PLATFORM: Record<string, ITypeAndCorners> = {
  SPRAY: { type: "box", corners: corners("angle") },
  CLOUD: { type: "box", corners: corners("curve-o") },
  VERTICAL: { type: "ntagon", corners: corners("angle") },
  EXPAND: { type: "ntagon", corners: corners("angle") },
  BEAM: { type: "box", corners: corners("curve-i") },
  THROW: { type: "box", corners: corners("curve-i") },
  AREA: { type: "box", corners: corners("box-o") }
}

// ------------------------------------------------------------------
// PLATFORM CONFIG GENERATION
// ------------------------------------------------------------------

export function platformConfig({ type, corners }: ITypeAndCorners, color?: IColoring, divisions: number = 8) {
  return {
    size: { x: 64, y: 64 },
    options: { type, corners, divisions, color }
  }
}


// ------------------------------------------------------------------
// TURRET CONFIG GENERATION
// ------------------------------------------------------------------

export function smallTurret(color?: IColoring) {
  return {
    size: { x: 48, y: 30 },
    options: { ratio: 0.6, topSeg: 3, botSeg: 10, color }

  }
}

export function roundTurret(color?: IColoring) {
  return {
    size: { x: 38, y: 38 },
    options: { ratio: 0.5, topSeg: 10, botSeg: 10, color }
  }
}

export function roundFrontTurret(color?: IColoring) {
  return {
    size: { x: 42, y: 36 },
    options: { ratio: 0.33, topSeg: 10, botSeg: 3, color }
  }
}

export function roundBackTurret(color?: IColoring) {
  return {
    size: { x: 42, y: 36 },
    options: { ratio: 0.66, topSeg: 3, botSeg: 10, color }
  }
}


// ------------------------------------------------------------------
// WEAPON CONFIG GENERATION
// ------------------------------------------------------------------

export function pointWeapon(color?: IColoring, ball = true): ITextureConfig<IWeaponOptions> {
  return {
    size: { x: 7, y: 32 },
    options: {
      type: "point", inset: box(0.4), line: "white", color,
      balls: ball ? { count: 1, color: "#FCF", start: 0.02 } : undefined
    }
  }
}

export function funnelWeapon(color?: IColoring): ITextureConfig<IWeaponOptions> {
  return {
    size: { x: 7, y: 32 },
    options: { type: "funnel", inset: box(0.33), line: "white", color }
  }
}

export function rectWeapon(color?: IColoring, ribs = true, rails = false): ITextureConfig<IWeaponOptions> {
  return {
    size: { x: 7, y: 32 },
    options: {
      type: "rect", inset: box(0.4), line: "white", color,
      ribs: ribs ? { count: 3, color: "white", start: 0.1, step: 0.1 } : undefined,
      rails: rails ? { color: "white" } : undefined
    }
  }
}

export function pointInsideWeapon(color?: IColoring): ITextureConfig<IWeaponOptions> {
  return {
    size: { x: 7, y: 18 },
    options: { type: "point", inset: box(0.0), line: "white", color }
  }
}

export function funnelInsideWeapon(color?: IColoring, ball = true): ITextureConfig<IWeaponOptions> {
  return {
    size: { x: 7, y: 18 },
    options: {
      type: "funnel", inset: box(0.8), line: "white", color,
      balls: ball ? { count: 1, color: "#FCF", start: 0.7 } : undefined
    }
  }
}

export function rectInsideWeapon(color?: IColoring, ball = true): ITextureConfig<IWeaponOptions> {
  return {
    size: { x: 7, y: 18 },
    options: {
      type: "rect", inset: box(0.4), line: "white", color,
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
  FORCE: {
    platform: platformConfig(PLATFORM.SPRAY, COLORS.FORCE),
    turret: roundFrontTurret(COLORS.FORCE),
    weapon: funnelWeapon(COLORS.FORCE)
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
    platform: platformConfig(PLATFORM.VERTICAL, COLORS.RAIN),
    turret: roundTurret(COLORS.RAIN),
    weapon: pointInsideWeapon(COLORS.RAIN)
  },
  SNOW: {
    platform: platformConfig(PLATFORM.VERTICAL, COLORS.SNOW),
    turret: roundTurret(COLORS.SNOW),
    weapon: pointInsideWeapon(COLORS.SNOW)
  },
  STUN: {
    platform: platformConfig(PLATFORM.VERTICAL, COLORS.STUN),
    turret: roundTurret(COLORS.STUN),
    weapon: pointInsideWeapon(COLORS.STUN)
  },

  // Expand
  SPIKE: {
    platform: platformConfig(PLATFORM.EXPAND, COLORS.SPIKE),
    turret: roundTurret(COLORS.SPIKE),
    weapon: pointInsideWeapon(COLORS.SPIKE)
  },
  ROCK: {
    platform: platformConfig(PLATFORM.EXPAND, COLORS.ROCK),
    turret: roundTurret(COLORS.ROCK),
    weapon: pointInsideWeapon(COLORS.ROCK)
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

export function registerTowerTexturesOld(scene: Scene) {
  for (let [key, { platform, turret, weapon }] of Object.entries(TOWERS)) {
    key = key.toLowerCase()
    makePlatform(scene, `${key}-platform`, platform)
    makeTurret(scene, `${key}-turret`, turret)
    makeWeapon(scene, `${key}-weapon`, weapon)
  }
}


// ------------------------------------------------------------------
// NEW APPROACH (BASED ON DELIVERY SHAPES AND DAMAGE COLORS)
// ------------------------------------------------------------------

export function rgbStringToColors(rgba: number) {
  const color = Display.Color.IntegerToColor(rgba)
  return [
    color.clone().brighten(30).rgba,
    color.rgba,
    color.clone().darken(10).rgba
  ]
}

function typeAndCorners(type: IPlatformType, cornerType: ICornerType, special: Partial<IPlatformOptions> = {}) {
  return {
    size: { x: 64, y: 64 },
    options: {
      type,
      corners: corners(cornerType),
      ...special
    }
  }
}

export const PLATFORM_CONFIG: Record<IDeliveryType, ITextureConfig<IPlatformOptions>> = {
  Arrow: typeAndCorners("box", "angle"),
  Bullet: typeAndCorners("box", "angle", { edges: edges("curve") }),
  Beam: typeAndCorners("box", "curve-i"),
  Spray: typeAndCorners("box", "curve-o"),
  Cloud: typeAndCorners("ntagon", "curve-o", { divisions: 8 }),
  Burst: typeAndCorners("ntagon", "angle", { divisions: 10 }),
  Vertical: typeAndCorners("ntagon", "angle", { divisions: 12 }),
  Area: typeAndCorners("ntagon", "angle", { divisions: 30 }),
  Missile: typeAndCorners("box", "box-o", { edges: edges("curve") }),
  Mine: typeAndCorners("box", "angle", { edges: edges("curve") }),
  Grenade: typeAndCorners("box", "curve-o", { edges: edges("wave") }),
}

export const TURRET_CONFIG: Record<IDeliveryType, ITextureConfig<ITurretOptions>> = {
  Arrow: smallTurret(),
  Bullet: roundBackTurret(),
  Beam: smallTurret(),
  Spray: roundFrontTurret(),
  Cloud: roundTurret(),
  Burst: roundTurret(),
  Vertical: roundTurret(),
  Area: roundTurret(),
  Missile: smallTurret(),
  Mine: smallTurret(),
  Grenade: smallTurret(),
}

export const WEAPON_CONFIG: Record<IDeliveryType, ITextureConfig<IWeaponOptions>> = {
  Arrow: pointWeapon(undefined, false),
  Bullet: rectWeapon(),
  Beam: pointWeapon(),
  Spray: funnelWeapon(),
  Cloud: pointInsideWeapon(),
  Burst: rectInsideWeapon(undefined, false),
  Vertical: funnelInsideWeapon(),
  Area: funnelInsideWeapon(undefined, false),
  Missile: rectWeapon(undefined, false, true),
  Mine: funnelWeapon(),
  Grenade: pointWeapon(undefined, false),
}


export function registerTower(scene: Scene, key: string, { damage, delivery }: ITowerOrganize) {
  console.log("Damage:", damage, ", Delivery:", delivery)
  const color = rgbStringToColors(DAMAGE_DATA[damage].color.value)

  const platform = PLATFORM_CONFIG[delivery]
  platform.options.color = color
  makePlatform(scene, `${key.toLowerCase()}-platform`, platform)

  const turret = TURRET_CONFIG[delivery]
  turret.options.color = color
  makeTurret(scene, `${key.toLowerCase()}-turret`, turret)

  const weapon = WEAPON_CONFIG[delivery]
  weapon.options.color = color
  makeWeapon(scene, `${key.toLowerCase()}-weapon`, weapon)
}

export default function registerTowerTextures(scene: Scene) {
  // We generate based on defined ITowerModels in TOWER_INDEX
  for (let { key, organize } of TOWER_LIST) {
    registerTower(scene, key, organize)
  }

  // >>> Likely wasteful since not all permutations may be needed
  for (let { key, name, organize } of GENERATED_LIST) {
    console.log(`Generate texture for: ${name} (${key})`)
    registerTower(scene, key, organize)
  }
}
