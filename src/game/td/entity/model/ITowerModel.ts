import { IPropertyEffect } from "./EffectsProxy"

export const TYPES_DELIVERY = ["Projectile", "Beam", "Spray", "Cloud", "Burst", "Area", "Missile", "Mine", "Grenade"]
export const TYPES_DAMAGE = ["Arrow", "Bullet", "Light", "Dark", "Force", "Fire", "Water", "Earth", "Air", "Poison", "Electric", "Health", "Shield", "Speed", "Value"]

export type IDeliveryType = typeof TYPES_DELIVERY[number]
export type IDamageType = typeof TYPES_DAMAGE[number]

export const deliveryDescriptions: { [key: string]: string } = {
  Projectile: "A narrow, single-target, emission of particles, firing at a spaced out interval.",
  Beam: "A narrow, single-target continous beam of particles.",
  Spray: "A cone, single-target, but affects other targets within the cone.",
  Cloud: "A multi-target cloud, covering the tower's range.",
  Burst: "Outward burst of multiple particles, multi-target within the tower's range",
  Area: "Invisible effect that multi-target within the tower's range",
  Missile: "A single-target missile that explodes on impact (causing range damage)",
  Mine: "Thrown to a path-target ahead. Explodes (causing range damage) when the first enemy crosses its center.",
  Grenade: "Thrown  to a path-target ahead. Explodes (causing range damage) when the trigger time elapses.",
}

export const damageColors: { [key: string]: { name: string, color: number } } = {
  Arrow: { name: "MAGENTA", color: 0x990099 },
  Bullet: { name: "SLATEGRAY", color: 0x778899 },
  Light: { name: "YELLOW", color: 0x999900 },
  Dark: { name: "BLACKISH", color: 0x333333 },
  Force: { name: "WHITEISH", color: 0x999999 },
  Fire: { name: "RED", color: 0x990000 },
  Water: { name: "BLUE", color: 0x000099 },
  Earth: { name: "SADDLEBROWN", color: 0x8B4513 },
  Air: { name: "WHITE", color: 0x999999 },
  Poison: { name: "GREEN", color: 0x009900 },
  Electric: { name: "CYAN", color: 0x009999 },
  Health: { name: "REDISH/GREEN", color: 0x990000 },
  Shield: { name: "REDISH/ORANGE", color: 0x990000 },
  Speed: { name: "REDISH/WHITE", color: 0x990000 },
  Value: { name: "GREENISH", color: 0x990000 }
}

export const damageDescriptions: { [key: string]: string } = {
  Arrow: "Arrow damage (low impact)",
  Bullet: "Bullet damage (high impact)",
  Light: "Bright damage (light, shine, radiant)",
  Dark: "Dark damage (shadow, smoke)",
  Force: "Force damage is an impact hit but uses non-physical emissions.",
  Fire: "Fire damage (fire, flame),",
  Water: "Water (liquid, steam, rain, snow, ice, freeze, frost),",
  Earth: "Eath (rocks, dirt, sand),",
  Air: "Wind effects (blow, breeze, storm),",
  Poison: "Poison damage (timed effect),",
  Electric: "Electrical damage (lightning, shock, electrocute),",
  Health: "Modify target's Health property down, for a limited time",
  Shield: "Modify target's Sheuld property down, for a limited time",
  Speed: "Modify target's Speed property down, for a limited time",
  Value: "Modify target's Value property up, for a limited time"
}

export interface ITowerMeta {
  distribution: "linear" | "radial"  // Weapon distribution
  rotation: "target" | number        // Rotation type (aim at target or rotate +/- clockwise each frame)
}

export interface ITowerOrganize {
  effect: "range" | "time"
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
  posponed?: number
  duration?: number
  cooldown?: number
}

// Modifiers are proxied IPropertyEffects with optional base effect properties
export interface ITowerModifier extends ITowerBaseEffect, IPropertyEffect {
  type: "modifier"
}

// Tower Damage is the common damage effect specfication, with otional base properties
export interface ITowerDamage extends ITowerBaseEffect {
  type: "damage"
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
  organize?: ITowerOrganize
  general: ITowerGeneral & E
  damage: {
    shield: ITowerEffect,
    health: ITowerEffect
  }
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
  if (effect.type === "damage") {
    const dps = Array.isArray(effect.dps) ? `${effect.dps[0]}-${effect.dps[1]}` : `${effect.dps}`
    return `${dps}${times}`
  }
  if (effect.type === "modifier") {
    return `${effect.prop.toString()}${times}`
  }
  return JSON.stringify(effect)
}

export default ITowerModel

export interface ITowerGroups {
  [key: string]: ITowerModel[]
}

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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 25, name: "Lazer" },
      health: { type: "damage", dps: 25, name: "Lazer" }
    }
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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 25, name: "Plasma" },
      health: { type: "damage", dps: 25, name: "Plasma" }
    }
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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 25, name: "Lightning" },
      health: { type: "damage", dps: 25, name: "Lightning" }
    }
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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 25, name: "Flame" },
      health: { type: "damage", dps: 25, name: "Flame" }
    }
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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 25, name: "Freeze" },
      health: { type: "damage", dps: 25, name: "Freeze" }
    }
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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 25, name: "Force" },
      health: { type: "damage", dps: 25, name: "Force" }
    }
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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 25, duration: 3000, name: "Poison" },
      health: { type: "damage", dps: 25, duration: 3000, name: "Poison" }
    }
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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 25, duration: 3000, name: "Fire" },
      health: { type: "damage", dps: 25, duration: 3000, name: "Fire" }
    }
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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 25, duration: 3000, name: "Smoke" },
      health: { type: "damage", dps: 25, duration: 3000, name: "Smoke" }
    }
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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 25, duration: 3000, name: "Shock" },
      health: { type: "damage", dps: 25, duration: 3000, name: "Shock" }
    }
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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 25, duration: 3000, name: "Ice" },
      health: { type: "damage", dps: 25, duration: 3000, name: "Ice" }
    }
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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 25, name: "Rain" },
      health: { type: "damage", dps: 25, name: "Rain" }
    }
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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 25, name: "Snow" },
      health: { type: "damage", dps: 25, name: "Snow" }
    }
  },
  stun: {
    key: "stun",
    group: "vertical",
    name: "Stun",
    description: "Targets multiple enemies within range with stun effect.",
    locked: true,
    meta: {
      distribution: "radial",
      rotation: 1,
    },
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 0, duration: 1000, cooldown: 5000, name: "Stun" },
      health: {
        type: "modifier",
        prop: "speed",
        formula: (v: number) => 0,
        duration: 1000,
        cooldown: 5000,
        name: "Stun"
      },
    }
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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 25, name: "Bullet" },
      health: { type: "damage", dps: 25, name: "Bullet" }
    }
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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 25, name: "Missile" },
      health: { type: "damage", dps: 25, name: "Missile" }
    }
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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 25, name: "Spike" },
      health: { type: "damage", dps: 25, name: "Spike" }
    }
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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 25, name: "Rock" },
      health: { type: "damage", dps: 25, name: "Rock" }
    }
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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 25, name: "Boost" },
      health: { type: "damage", dps: 25, name: "Boost" }
    }
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
    general: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { type: "damage", dps: 0, name: "Slow" },
      health: {
        type: "modifier",
        prop: "speed",
        formula: v => v * 0.5,
        duration: 2000,
        name: "Slow"
      }
    }
  }
}

export const TOWER_LIST = Object.values(TOWER_INDEX)

export const TOWER_GROUPS = TOWER_LIST.reduce((groups: ITowerGroups, tower: ITowerModel) => {
  if (!groups[tower.group]) {
    groups[tower.group] = []
  }
  groups[tower.group].push(tower)
  return groups
}, {} as ITowerGroups)


function generatePermutations() {
  // const effectTypes = ["In-Range", "Timed"]
  const permutations: any[] = []
  TYPES_DELIVERY.forEach((delivery: IDeliveryType) => {
    TYPES_DAMAGE.forEach((damage: IDamageType) => {
      permutations.push({
        type: `${damage} ${delivery}`,
        color: damageColors[damage].name,
        damage: damageDescriptions[damage],
        delivery: deliveryDescriptions[delivery]
      })
    })
  })
  return permutations
}

export const PERMUTATIONS = generatePermutations()
console.log("Permutation count:", PERMUTATIONS.length)
console.log(JSON.stringify(PERMUTATIONS, null, 2))
