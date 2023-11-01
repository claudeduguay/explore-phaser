
export interface ITowerMeta {
  distribution: "linear" | "radial"  // Weapon distribution
  rotation: "target" | number        // Rotation type
}

export interface ITowerStatistics {
  level: number
  cost: number
  range: number
}

export interface ITowerDamage {
  dps: number | [min: number, max: number]
  duration?: number
  type: string
}

// Need a mechanism to define timeout effect periods
// Support for literal or random range damage values
// export interface ITowerDamage {
//   [key: string]: IDamageSpec
// }

export interface ITowerModel {
  key: string
  name: string
  group: string
  description: string
  locked: boolean,
  meta: ITowerMeta
  stats: ITowerStatistics
  damage: {
    shield: ITowerDamage,
    health: ITowerDamage
  }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 25, type: "Lazer" },
      health: { dps: 25, type: "Lazer" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 25, type: "Plasma" },
      health: { dps: 25, type: "Plasma" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 25, type: "Lightning" },
      health: { dps: 25, type: "Lightning" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 25, type: "Flame" },
      health: { dps: 25, type: "Flame" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 25, type: "Freeze" },
      health: { dps: 25, type: "Freeze" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 25, type: "Force" },
      health: { dps: 25, type: "Force" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 25, duration: 3000, type: "Poison" },
      health: { dps: 25, duration: 3000, type: "Poison" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 25, duration: 3000, type: "Fire" },
      health: { dps: 25, duration: 3000, type: "Fire" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 25, duration: 3000, type: "Smoke" },
      health: { dps: 25, duration: 3000, type: "Smoke" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 25, duration: 3000, type: "Shock" },
      health: { dps: 25, duration: 3000, type: "Shock" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 25, duration: 3000, type: "Ice" },
      health: { dps: 25, duration: 3000, type: "Ice" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 25, type: "Rain" },
      health: { dps: 25, type: "Rain" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 25, type: "Snow" },
      health: { dps: 25, type: "Snow" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 0, duration: 1000, type: "Stun" },
      health: { dps: 0, duration: 1000, type: "Stun" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 25, type: "Bullet" },
      health: { dps: 25, type: "Bullet" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 25, type: "Missile" },
      health: { dps: 25, type: "Missile" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 25, type: "Spike" },
      health: { dps: 25, type: "Spike" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 25, type: "Rock" },
      health: { dps: 25, type: "Rock" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 25, type: "Boost" },
      health: { dps: 25, type: "Boost" }
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
    stats: {
      level: 3,
      cost: 100,
      range: 100,
    },
    damage: {
      shield: { dps: 0, duration: 2000, type: "Slow" },
      health: { dps: 0, duration: 2000, type: "Slow" }
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
