
export interface ITowerProjector {
  sprite: string  // Gun or radar, etc. sprite
  emitter: string // Emitter effect type
}

export interface ITowerMeta {
  key: string                     // Tower key
  distribution: "linear" | "radial"
  rotation: "target" | number
}

export interface ITowerStatistics {
  cost: number
  level: number
  range: number
}

export interface ITowerDamage {
  [key: string]: number
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
  LAZER: {
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
      lazer: 10
    }
  },
  PLASMA: {
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
      plasma: 10
    }
  },
  LIGHTNING: {
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
      lightning: 10
    }
  },
  // SPRAY
  FLAME: {
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
      fire: 10
    }
  },
  FREEZE: {
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
      ice: 10
    }
  },
  IMPACT: {
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
      ice: 10
    }
  },
  // CLOUD
  POISON_: {
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
      posion: 10
    }
  },
  FIRE: {
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
      posion: 10
    }
  }, SMOKE: {
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
      smoke: 10
    }
  },
  SHOCK: {
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
      shock: 10
    }
  },
  ICE: {
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
      freeze: 10
    }
  },
  // FALL
  RAIN: {
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
      rain: 10
    }
  },
  SNOW: {
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
      rain: 10
    }
  },
  // THROW
  BULLET: {
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
      bullet: 10
    }
  },
  MISSILE: {
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
      missile: 10
    }
  },
  // AREA
  BOOST: {
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
      boost: 10
    }
  },
  SLOW: {
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
      slow: 10
    }
  }
}

export const ALL_TOWERS = Object.values(TOWER_MODELS)
