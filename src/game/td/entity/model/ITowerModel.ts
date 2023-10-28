
export interface ITowerMeta {
  distribution: "linear" | "radial"  // Weapon distribution
  rotation: "target" | number        // Rotation type
}

export interface ITowerStatistics {
  level: number
  cost: number
  range: number
}

export interface IDamageSpec {
  dps: number | [min: number, max: number]
  duration?: number
}

// Need a mechanism to define timeout effect periods
// Support for literal or random range damage values
export interface ITowerDamage {
  [key: string]: { dps: number | [min: number, max: number], duration?: number }
}

export interface ITowerModel {
  key: string
  name: string
  group: string
  description: string
  locked: boolean,
  meta: ITowerMeta
  stats: ITowerStatistics
  damage: ITowerDamage
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
      lazer: { dps: 25 }
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
      plasma: { dps: 25 }
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
      lightning: { dps: 25 }
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
      flame: { dps: 25 }
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
      freeze: { dps: 25 }
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
      force: { dps: 25 }
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
      poison: { dps: 25, duration: 3000 }
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
      fire: { dps: 25, duration: 3000 }
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
      smoke: { dps: 25, duration: 3000 }
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
      shock: { dps: 25, duration: 3000 }
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
      ice: { dps: 25, duration: 3000 }
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
      rain: { dps: 25 }
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
      snow: { dps: 25 }
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
      stun: { dps: 0, duration: 1000 }
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
      bullet: { dps: 25 }
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
      missile: { dps: 25 }
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
      spike: { dps: 25 }
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
      rock: { dps: 25 }
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
      boost: { dps: 25 }
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
      slow: { dps: 0, duration: 2000 }
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
