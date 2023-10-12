
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
  [key: string]: { dps: number | [min: number, max: number] }
}

export interface ITowerModel {
  key: string                        // Tower key
  name: string
  group: string
  description: string
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

export const DEFAULT_STATS: ITowerStatistics = {
  level: 3,
  cost: 100,
  range: 100,
}


export const TOWER_INDEX: Record<string, ITowerModel> = {

  // BEAM
  lazer: {
    key: "lazer",
    group: "beam",
    name: "Lazer Tower",
    description: "Fires a lazer beam at a single enemy within range.",
    meta: {
      distribution: "linear",
      rotation: "target",
    },
    stats: DEFAULT_STATS,
    damage: {
      lazer: { dps: 10 }
    }
  },
  plasma: {
    key: "plasma",
    group: "beam",
    name: "Plasma Tower",
    description: "Fires a plasma beam at a single enemy within range.",
    meta: {
      distribution: "linear",
      rotation: "target",
    },
    stats: DEFAULT_STATS,
    damage: {
      plasma: { dps: 10 }
    }
  },
  lightning: {
    key: "lightning",
    group: "beam",
    name: "Lightning Tower",
    description: "Fires a lightning bolt at a single enemy within range.",
    meta: {
      distribution: "linear",
      rotation: "target",
    },
    stats: DEFAULT_STATS,
    damage: {
      lightning: { dps: 10 }
    }
  },
  // SPRAY
  flame: {
    key: "flame",
    group: "spray",
    name: "Flame Tower",
    description: "Targets a single enemy within range with a fire spray.",
    meta: {
      distribution: "linear",
      rotation: "target",
    },
    stats: DEFAULT_STATS,
    damage: {
      fire: { dps: 10 }
    }
  },
  freeze: {
    key: "freeze",
    group: "spray",
    name: "Freeze Tower",
    description: "Targets a single enemy within range with an ice spray.",
    meta: {
      distribution: "linear",
      rotation: "target",
    },
    stats: DEFAULT_STATS,
    damage: {
      ice: { dps: 10 }
    }
  },
  impact: {
    key: "impact",
    group: "spray",
    name: "Impact Tower",
    description: "Targets a single enemy within range with a force spray.",
    meta: {
      distribution: "linear",
      rotation: "target",
    },
    stats: DEFAULT_STATS,
    damage: {
      ice: { dps: 10 }
    }
  },
  // CLOUD
  poison: {
    key: "poison",
    group: "spray",
    name: "Poison Tower",
    description: "Targets multiple enemies within range with a cloud of poison.",
    meta: {
      distribution: "radial",
      rotation: 1,
    },
    stats: DEFAULT_STATS,
    damage: {
      posion: { dps: 10 }
    }
  },
  fire: {
    key: "fire",
    group: "cloud",
    name: "Fire Tower",
    description: "Targets multiple enemies within range with a cloud of fire.",
    meta: {
      distribution: "radial",
      rotation: 1,
    },
    stats: DEFAULT_STATS,
    damage: {
      posion: { dps: 10 }
    }
  },
  smoke: {
    key: "smoke",
    group: "cloud",
    name: "Smoke Tower",
    description: "Targets multiple enemies within range with a cloud of smoke.",
    meta: {
      distribution: "radial",
      rotation: 1,
    },
    stats: DEFAULT_STATS,
    damage: {
      smoke: { dps: 10 }
    }
  },
  shock: {
    key: "shock",
    group: "cloud",
    name: "Shock Tower",
    description: "Targets multiple enemies within range with a cloud of electricity.",
    meta: {
      distribution: "radial",
      rotation: 1,
    },
    stats: DEFAULT_STATS,
    damage: {
      shock: { dps: 10 }
    }
  },
  ice: {
    key: "ice",
    group: "cloud",
    name: "Ice Tower",
    description: "Targets multiple enemies within range with a cloud of ice.",
    meta: {
      distribution: "radial",
      rotation: 1,
    },
    stats: DEFAULT_STATS,
    damage: {
      freeze: { dps: 10 }
    }
  },
  // FALL
  rain: {
    key: "rain",
    group: "fall",
    name: "Rain Tower",
    description: "Targets multiple enemies within range with rainfall.",
    meta: {
      distribution: "radial",
      rotation: 1,
    },
    stats: DEFAULT_STATS,
    damage: {
      rain: { dps: 10 }
    }
  },
  snow: {
    key: "snow",
    group: "fall",
    name: "Snow Tower",
    description: "Targets multiple enemies within range with snowfall.",
    meta: {
      distribution: "radial",
      rotation: 1,
    },
    stats: DEFAULT_STATS,
    damage: {
      rain: { dps: 10 }
    }
  },
  // THROW
  bullet: {
    key: "bullet",
    group: "throw",
    name: "Bullet Tower",
    description: "Fires bullets at a single enemy within range.",
    meta: {
      distribution: "linear",
      rotation: "target",
    },
    stats: DEFAULT_STATS,
    damage: {
      bullet: { dps: 10 }
    }
  },
  missile: {
    key: "missile",
    group: "throw",
    name: "Missile Tower",
    description: "Fires a missile at a single enemy within range.",
    meta: {
      distribution: "linear",
      rotation: "target",
    },
    stats: DEFAULT_STATS,
    damage: {
      missile: { dps: 10 }
    }
  },
  // AREA
  boost: {
    key: "boost",
    group: "area",
    name: "Boost Tower",
    description: "Boosts other towers' damage effect, within range.",
    meta: {
      distribution: "radial",
      rotation: 4,
    },
    stats: DEFAULT_STATS,
    damage: {
      boost: { dps: 10 }
    }
  },
  slow: {
    key: "slow",
    group: "area",
    name: "Slow Tower",
    description: "Applies a slow effect on enemies within range",
    meta: {
      distribution: "radial",
      rotation: -1,
    },
    stats: DEFAULT_STATS,
    damage: {
      slow: { dps: 10 }
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

console.log("Groups:", TOWER_GROUPS)