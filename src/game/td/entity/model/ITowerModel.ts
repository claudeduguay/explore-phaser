import { IPropertyEffect } from "../../behavior/enemy/EffectsProxy"

export interface ITowerMeta {
  distribution: "linear" | "radial"  // Weapon distribution
  rotation: "target" | number        // Rotation type
}

export interface ITowerGeneral {
  level: number
  cost: number
  range: number
}

export interface ITowerEffect {
  modifier: IPropertyEffect
  duration?: number
  cooldown?: number
  name: string
}

export interface ITowerDamage {
  dps: number | [min: number, max: number]
  duration?: number
  cooldown?: number
  name: string
}

export interface ITowerModel<E = {}> {
  key: string
  name: string
  group: string
  description: string
  locked: boolean,
  meta: ITowerMeta
  general: ITowerGeneral & E
  damage: {
    effect?: ITowerEffect,
    shield: ITowerDamage & E,
    health: ITowerDamage & E
  }
}

// Implements IValueFormatter for tables (key is not used here)
export function damageFormatter(key: string, damage: ITowerDamage): string {
  const dps = Array.isArray(damage.dps) ? `${damage.dps[0]}-${damage.dps[1]}` : `${damage.dps}`
  const timing: string[] = []
  if (damage.duration) {
    timing.push(`${(damage.duration / 1000).toFixed(1)}s`)
  }
  if (damage.cooldown) {
    timing.push(`${(damage.cooldown / 1000).toFixed(1)}s`)
  }
  const times = timing.length > 0 ? ` (${timing.join(", ")})` : ``
  return `${dps}${times}`
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
      shield: { dps: 25, name: "Lazer" },
      health: { dps: 25, name: "Lazer" }
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
      shield: { dps: 25, name: "Plasma" },
      health: { dps: 25, name: "Plasma" }
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
      shield: { dps: 25, name: "Lightning" },
      health: { dps: 25, name: "Lightning" }
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
      shield: { dps: 25, name: "Flame" },
      health: { dps: 25, name: "Flame" }
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
      shield: { dps: 25, name: "Freeze" },
      health: { dps: 25, name: "Freeze" }
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
      shield: { dps: 25, name: "Force" },
      health: { dps: 25, name: "Force" }
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
      shield: { dps: 25, duration: 3000, name: "Poison" },
      health: { dps: 25, duration: 3000, name: "Poison" }
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
      shield: { dps: 25, duration: 3000, name: "Fire" },
      health: { dps: 25, duration: 3000, name: "Fire" }
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
      shield: { dps: 25, duration: 3000, name: "Smoke" },
      health: { dps: 25, duration: 3000, name: "Smoke" }
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
      shield: { dps: 25, duration: 3000, name: "Shock" },
      health: { dps: 25, duration: 3000, name: "Shock" }
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
      shield: { dps: 25, duration: 3000, name: "Ice" },
      health: { dps: 25, duration: 3000, name: "Ice" }
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
      shield: { dps: 25, name: "Rain" },
      health: { dps: 25, name: "Rain" }
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
      shield: { dps: 25, name: "Snow" },
      health: { dps: 25, name: "Snow" }
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
      effect: {
        modifier: { name: "Stun", prop: "speed", formula: (s: number) => 0 },
        duration: 1000,
        cooldown: 5000,
        name: "Slow"
      },
      shield: { dps: 0, duration: 1000, cooldown: 5000, name: "Stun" },
      health: { dps: 0, duration: 1000, cooldown: 5000, name: "Stun" }
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
      shield: { dps: 25, name: "Bullet" },
      health: { dps: 25, name: "Bullet" }
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
      shield: { dps: 25, name: "Missile" },
      health: { dps: 25, name: "Missile" }
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
      shield: { dps: 25, name: "Spike" },
      health: { dps: 25, name: "Spike" }
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
      shield: { dps: 25, name: "Rock" },
      health: { dps: 25, name: "Rock" }
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
      shield: { dps: 25, name: "Boost" },
      health: { dps: 25, name: "Boost" }
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
      effect: {
        modifier: { name: "Slow", prop: "speed", formula: (s: number) => s * 0.5 },
        name: "Stun"
      },
      shield: { dps: 0, name: "Slow" },
      health: { dps: 0, name: "Slow" }
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
