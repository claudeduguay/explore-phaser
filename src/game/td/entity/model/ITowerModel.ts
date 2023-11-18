import { IPropertyEffect } from "./EffectsProxy"
import { IDamageType, IDeliveryType, DAMAGE_DATA, DELIVERY_DATA } from "./ITowerData"

export interface ITowerMeta {
  distribution: "linear" | "radial"  // Weapon distribution
  rotation: "target" | number        // Rotation type (aim at target or rotate +/- clockwise each frame)
}

export interface ITowerOrganize {
  effect?: "range" | "time"
  delivery: IDeliveryType
  damage: IDamageType
}

export interface ITowerGeneral {
  level: number
  cost: number
  range: number
}

// All effects nay have optional duration and cooldown values
export interface ITowerBaseEffect {
  delay?: number
  duration?: number
  cooldown?: number
}

// Modifiers are proxied IPropertyEffects with optional base effect properties
export interface ITowerModifier extends ITowerBaseEffect, IPropertyEffect {
  type: "prop"
}

// Tower Damage is the common damage effect specfication, with otional base properties
export interface ITowerDamage extends ITowerBaseEffect {
  type: "health" | "shield"
  dps: number | [min: number, max: number]
  name: string
}

// Tower effects can be either Damage or Modifier effects
export type ITowerEffect = ITowerDamage | ITowerModifier

export interface ITowerModel<E = {}> {
  key: string
  name: string
  group: string
  description: string
  locked: boolean
  meta: ITowerMeta
  organize: ITowerOrganize
  general: ITowerGeneral & E
  damage: ITowerEffect
}

export default ITowerModel

export interface ITowerGroups {
  [key: string]: ITowerModel[]
}


// ------------------------------------------------------------------
// UTILITIES
// ------------------------------------------------------------------

export function isDPSDamage(effect: ITowerEffect): effect is ITowerDamage {
  return ["health", "shield"].includes(effect.type)
}

export function isPropDamage(effect: ITowerEffect): effect is ITowerModifier {
  return effect.type === "prop"
}

// Implements IValueFormatter for tables (key is not used here)
export function effectFormatter(key: string, effect: ITowerEffect): string {
  const timing: string[] = []
  if (effect.duration) {
    timing.push(`${(effect.duration / 1000).toFixed(1)}s`)
  }
  if (effect.cooldown) {
    timing.push(`${(effect.cooldown / 1000).toFixed(1)}s`)
  }
  const times = timing.length > 0 ? ` (${timing.join(", ")})` : ``
  if (isDPSDamage(effect)) {
    const dps = Array.isArray(effect.dps) ? `${effect.dps[0]}-${effect.dps[1]}` : `${effect.dps}`
    return `${dps}${times}`
  }
  if (effect.type === "prop") {
    return `${effect.prop.toString()}${times}`
  }
  return JSON.stringify(effect)
}

export const prefixKey = ({ damage, delivery }: ITowerOrganize) => `${damage}-${delivery}`.toLowerCase()
export const platformKey = (organize: ITowerOrganize) => `${prefixKey(organize)}-platform`.toLowerCase()
export const turretKey = (organize: ITowerOrganize) => `${prefixKey(organize)}-turret`.toLowerCase()
export const weaponKey = (organize: ITowerOrganize) => `${prefixKey(organize)}-weapon`.toLowerCase()


// ------------------------------------------------------------------
// GENERATOR
// ------------------------------------------------------------------

export const RADIAL: IDeliveryType[] = ["Pulse", "Burst", "Vortex", "Cloud", "Sweep", "Fall", "Rise", "Pull", "Push"]

export function modelGenerator(organize: ITowerOrganize): ITowerModel {
  const { damage, delivery } = organize
  return {
    key: prefixKey(organize),
    group: delivery.toLowerCase(),
    name: `${damage} ${delivery}`,
    description: "Fires a lazer beam at a single enemy within range.",
    locked: true,
    meta: {
      distribution: RADIAL.includes(delivery) ? "radial" : "linear",
      rotation: RADIAL.includes(delivery) ? RADIAL.indexOf(delivery) - 1 : "target",
    },
    organize,
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, name: damage }
  }
}


export const GENERATED_LIST: ITowerModel[] = []
export const GENERATED_INDEX: Record<string, ITowerModel> = {}
export const GENERATED_GROUPS: Record<string, ITowerModel[]> = {}

Object.keys(DAMAGE_DATA).forEach((damage: IDamageType) =>
  Object.keys(DELIVERY_DATA).forEach((delivery: IDeliveryType) => {
    const model = modelGenerator({ damage, delivery })
    GENERATED_LIST.push(model)
    GENERATED_INDEX[model.key] = model
    if (!GENERATED_GROUPS[model.group]) {
      GENERATED_GROUPS[model.group] = []
    }
    GENERATED_GROUPS[model.group].push(model)
    return model
  }))


// ------------------------------------------------------------------
// INSTANCES
// ------------------------------------------------------------------

export const TOWER_INDEX: Record<string, ITowerModel> = {

  // BEAM
  lazer: {
    key: "lazer",
    group: "beam",
    name: "Lazer",
    description: "Fires a lazer beam at a single enemy within range.",
    locked: true,
    meta: {
      distribution: "linear",
      rotation: "target",
    },
    organize: {
      damage: "Force",
      delivery: "Beam",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, name: "Lazer" }
  },
  plasma: {
    key: "plasma",
    group: "beam",
    name: "Plasma",
    description: "Fires a plasma beam at a single enemy within range.",
    locked: true,
    meta: {
      distribution: "linear",
      rotation: "target",
    },
    organize: {
      damage: "Plasma",
      delivery: "Beam",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, name: "Plasma" }
  },
  lightning: {
    key: "lightning",
    group: "beam",
    name: "Lightning",
    description: "Fires a lightning bolt at a single enemy within range.",
    locked: true,
    meta: {
      distribution: "linear",
      rotation: "target",
    },
    organize: {
      damage: "Electric",
      delivery: "Beam",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, name: "Lightning" }
  },

  // SPRAY
  flame: {
    key: "flame",
    group: "spray",
    name: "Flame",
    description: "Targets a single enemy within range with a spray of fire.",
    locked: true,
    meta: {
      distribution: "linear",
      rotation: "target",
    },
    organize: {
      damage: "Fire",
      delivery: "Spray",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, name: "Flame" }
  },
  freeze: {
    key: "freeze",
    group: "spray",
    name: "Freeze",
    description: "Targets a single enemy within range with an spray of ice.",
    locked: true,
    meta: {
      distribution: "linear",
      rotation: "target",
    },
    organize: {
      damage: "Ice",
      delivery: "Spray",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, name: "Freeze" }
  },
  force: {
    key: "force",
    group: "spray",
    name: "Force",
    description: "Targets a single enemy within range with a spray of force.",
    locked: true,
    meta: {
      distribution: "linear",
      rotation: "target",
    },
    organize: {
      damage: "Force",
      delivery: "Spray",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, name: "Force" }
  },

  // CLOUD
  poison: {
    key: "poison",
    group: "cloud",
    name: "Poison",
    description: "Targets multiple enemies within range with a cloud of poison.",
    locked: true,
    meta: {
      distribution: "radial",
      rotation: 1,
    },
    organize: {
      damage: "Poison",
      delivery: "Cloud",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, duration: 3000, name: "Poison" }
  },
  fire: {
    key: "fire",
    group: "cloud",
    name: "Fire",
    description: "Targets multiple enemies within range with a cloud of fire.",
    locked: true,
    meta: {
      distribution: "radial",
      rotation: 1,
    },
    organize: {
      damage: "Fire",
      delivery: "Cloud",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, duration: 3000, name: "Fire" }
  },
  smoke: {
    key: "smoke",
    group: "cloud",
    name: "Smoke",
    description: "Targets multiple enemies within range with a cloud of smoke.",
    locked: true,
    meta: {
      distribution: "radial",
      rotation: 1,
    },
    organize: {
      damage: "Dark",
      delivery: "Cloud",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, duration: 3000, name: "Smoke" }
  },
  shock: {
    key: "shock",
    group: "cloud",
    name: "Shock",
    description: "Targets multiple enemies within range with a cloud of electricity.",
    locked: true,
    meta: {
      distribution: "radial",
      rotation: 1,
    },
    organize: {
      damage: "Electric",
      delivery: "Cloud",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, duration: 3000, name: "Shock" }
  },
  ice: {
    key: "ice",
    group: "cloud",
    name: "Ice",
    description: "Targets multiple enemies within range with a cloud of ice.",
    locked: true,
    meta: {
      distribution: "radial",
      rotation: 1,
    },
    organize: {
      damage: "Ice",
      delivery: "Cloud",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, duration: 3000, name: "Ice" }
  },

  // VERTICAL
  rain: {
    key: "rain",
    group: "vertical",
    name: "Rain",
    description: "Targets multiple enemies within range with rainfall.",
    locked: true,
    meta: {
      distribution: "radial",
      rotation: 1,
    },
    organize: {
      damage: "Water",
      delivery: "Fall",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, name: "Rain" }
  },
  snow: {
    key: "snow",
    group: "vertical",
    name: "Snow",
    description: "Targets multiple enemies within range with snowfall.",
    locked: true,
    meta: {
      distribution: "radial",
      rotation: 1,
    },
    organize: {
      damage: "Ice",
      delivery: "Fall",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, name: "Snow" }
  },

  // THROW
  bullet: {
    key: "bullet",
    group: "eject",
    name: "Bullet",
    description: "Fires bullets at a single enemy within range.",
    locked: false,
    meta: {
      distribution: "linear",
      rotation: "target",
    },
    organize: {
      damage: "Kinetic",
      delivery: "Bullet",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, name: "Kinetic" }
  },
  missile: {
    key: "missile",
    group: "eject",
    name: "Missile",
    description: "Fires missiles at a single enemy within range.",
    locked: true,
    meta: {
      distribution: "linear",
      rotation: "target",
    },
    organize: {
      damage: "Force",
      delivery: "Missile",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, name: "Missile" }
  },

  // EXPAND
  spike: {
    key: "spike",
    group: "expand",
    name: "Spike",
    description: "Fires spikes at multiple enemies within range.",
    locked: true,
    meta: {
      distribution: "radial",
      rotation: 1,
    },
    organize: {
      damage: "Kinetic",
      delivery: "Burst",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, name: "Spike" }
  },
  rock: {
    key: "rock",
    group: "expand",
    name: "Rock",
    description: "Fires rocks at multiple enemies within range.",
    locked: true,
    meta: {
      distribution: "radial",
      rotation: 1,
    },
    organize: {
      damage: "Earth",
      delivery: "Burst",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, name: "Rock" }
  },

  // AREA
  boost: {
    key: "boost",
    group: "area",
    name: "Boost",
    description: "Boosts other towers' damage effect, within range.",
    locked: true,
    meta: {
      distribution: "radial",
      rotation: 4,
    },
    organize: {
      damage: "Value",
      delivery: "Sweep",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: { type: "health", dps: 25, name: "Boost" }
  },
  slow: {
    key: "slow",
    group: "area",
    name: "Slow",
    description: "Applies a timed slowing effect whenever enemies enter the tower's range",
    locked: true,
    meta: {
      distribution: "radial",
      rotation: -1,
    },
    organize: {
      damage: "Speed",
      delivery: "Pulse",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      type: "prop",
      prop: "speed",
      formula: v => v * 0.5,
      duration: 2000,
      name: "Slow"
    }
  },
  stun: {
    key: "stun",
    group: "area",
    name: "Stun",
    description: "Targets multiple enemies within range with stun effect.",
    locked: true,
    meta: {
      distribution: "radial",
      rotation: 1,
    },
    organize: {
      damage: "Ice",
      delivery: "Pulse",
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      type: "prop",
      prop: "speed",
      formula: (v: number) => 0,
      delay: 250,
      duration: 1000,
      cooldown: 3000,
      name: "Stun"
    }
  },

}

export const TOWER_LIST = Object.values(TOWER_INDEX)

export const TOWER_GROUPS = TOWER_LIST.reduce((groups: ITowerGroups, tower: ITowerModel) => {
  if (!groups[tower.group]) {
    groups[tower.group] = []
  }
  groups[tower.group].push(tower)
  return groups
}, {} as ITowerGroups)
