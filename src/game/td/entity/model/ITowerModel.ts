
export interface ITowerMeta {
  key: string                        // Tower key
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
  name: string
  group: string
  description: string
  meta: ITowerMeta
  stats: ITowerStatistics
  damage: ITowerDamage
}

export default ITowerModel


// ------------------------------------------------------------------
// INSTANCES
// ------------------------------------------------------------------

export const DEFAULT_STATS: ITowerStatistics = {
  level: 3,
  cost: 100,
  range: 100,
}


export const TOWER_MODELS: Record<string, ITowerModel> = {

  // BEAM
  lazer: {
    name: "Lazer Tower",
    group: "beam",
    description: "Fires a lazer beam at a single enemy within range.",
    meta: {
      key: "lazer",
      distribution: "linear",
      rotation: "target",
    },
    stats: DEFAULT_STATS,
    damage: {
      lazer: { dps: 10 }
    }
  },
  plasma: {
    name: "Plasma Tower",
    group: "beam",
    description: "Fires a plasma beam at a single enemy within range.",
    meta: {
      key: "plasma",
      distribution: "linear",
      rotation: "target",
    },
    stats: DEFAULT_STATS,
    damage: {
      plasma: { dps: 10 }
    }
  },
  lightning: {
    name: "Lightning Tower",
    group: "beam",
    description: "Fires a lightning bolt at a single enemy within range.",
    meta: {
      key: "lightning",
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
    name: "Flame Tower",
    group: "spray",
    description: "Targets a single enemy within range with a fire spray.",
    meta: {
      key: "flame",
      distribution: "linear",
      rotation: "target",
    },
    stats: DEFAULT_STATS,
    damage: {
      fire: { dps: 10 }
    }
  },
  freeze: {
    name: "Freeze Tower",
    group: "spray",
    description: "Targets a single enemy within range with an ice spray.",
    meta: {
      key: "freeze",
      distribution: "linear",
      rotation: "target",
    },
    stats: DEFAULT_STATS,
    damage: {
      ice: { dps: 10 }
    }
  },
  impact: {
    name: "Impact Tower",
    group: "spray",
    description: "Targets a single enemy within range with a force spray.",
    meta: {
      key: "impact",
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
    name: "Poison Tower",
    group: "spray",
    description: "Targets multiple enemies within range with a cloud of poison.",
    meta: {
      key: "poison",
      distribution: "radial",
      rotation: 1,
    },
    stats: DEFAULT_STATS,
    damage: {
      posion: { dps: 10 }
    }
  },
  fire: {
    name: "Fire Tower",
    group: "cloud",
    description: "Targets multiple enemies within range with a cloud of fire.",
    meta: {
      key: "fire",
      distribution: "radial",
      rotation: 1,
    },
    stats: DEFAULT_STATS,
    damage: {
      posion: { dps: 10 }
    }
  },
  smoke: {
    name: "Smoke Tower",
    group: "cloud",
    description: "Targets multiple enemies within range with a cloud of smoke.",
    meta: {
      key: "smoke",
      distribution: "radial",
      rotation: 1,
    },
    stats: DEFAULT_STATS,
    damage: {
      smoke: { dps: 10 }
    }
  },
  shock: {
    name: "Shock Tower",
    group: "cloud",
    description: "Targets multiple enemies within range with a cloud of electricity.",
    meta: {
      key: "shock",
      distribution: "radial",
      rotation: 1,
    },
    stats: DEFAULT_STATS,
    damage: {
      shock: { dps: 10 }
    }
  },
  ice: {
    name: "Ice Tower",
    group: "cloud",
    description: "Targets multiple enemies within range with a cloud of ice.",
    meta: {
      key: "ice",
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
    name: "Rain Tower",
    group: "fall",
    description: "Targets multiple enemies within range with rainfall.",
    meta: {
      key: "rain",
      distribution: "radial",
      rotation: 1,
    },
    stats: DEFAULT_STATS,
    damage: {
      rain: { dps: 10 }
    }
  },
  snow: {
    name: "Snow Tower",
    group: "fall",
    description: "Targets multiple enemies within range with snowfall.",
    meta: {
      key: "snow",
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
    name: "Bullet Tower",
    group: "throw",
    description: "Fires bullets at a single enemy within range.",
    meta: {
      key: "bullet",
      distribution: "linear",
      rotation: "target",
    },
    stats: DEFAULT_STATS,
    damage: {
      bullet: { dps: 10 }
    }
  },
  missile: {
    name: "Missile Tower",
    group: "throw",
    description: "Fires a missile at a single enemy within range.",
    meta: {
      key: "missile",
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
    name: "Boost Tower",
    group: "area",
    description: "Boosts other towers' damage effect, within range.",
    meta: {
      key: "boost",
      distribution: "radial",
      rotation: 4,
    },
    stats: DEFAULT_STATS,
    damage: {
      boost: { dps: 10 }
    }
  },
  slow: {
    name: "Slow Tower",
    group: "area",
    description: "Applies a slow effect on enemies within range",
    meta: {
      key: "slow",
      distribution: "radial",
      rotation: -1,
    },
    stats: DEFAULT_STATS,
    damage: {
      slow: { dps: 10 }
    }
  }
}

export const ALL_TOWERS = Object.values(TOWER_MODELS)
