
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


// BEAM
export const LAZER_TOWER: ITowerModel = {
  name: "Lazer Tower",
  group: "beam",
  meta: {
    key: "lazer",
    distribution: "linear",
    rotation: "target",
  },
  stats: DEFAULT_STATS,
  damage: {
    lazer: 10
  }
}

export const PLASMA_TOWER: ITowerModel = {
  name: "Plasma Tower",
  group: "beam",
  meta: {
    key: "plasma",
    distribution: "linear",
    rotation: "target",
  },
  stats: DEFAULT_STATS,
  damage: {
    plasma: 10
  }
}

export const LIGHTNING_TOWER: ITowerModel = {
  name: "Lightning Tower",
  group: "beam",
  meta: {
    key: "lightning",
    distribution: "linear",
    rotation: "target",
  },
  stats: DEFAULT_STATS,
  damage: {
    lightning: 10
  }
}


// SPRAY
export const FLAME_TOWER: ITowerModel = {
  name: "Flame Tower",
  group: "spray",
  meta: {
    key: "flame",
    distribution: "linear",
    rotation: "target",
  },
  stats: DEFAULT_STATS,
  damage: {
    fire: 10
  }
}

export const FREEZE_TOWER: ITowerModel = {
  name: "Freeze Tower",
  group: "spray",
  meta: {
    key: "freeze",
    distribution: "linear",
    rotation: "target",
  },
  stats: DEFAULT_STATS,
  damage: {
    ice: 10
  }
}

export const IMPACT_TOWER: ITowerModel = {
  name: "Impact Tower",
  group: "spray",
  meta: {
    key: "impact",
    distribution: "linear",
    rotation: "target",
  },
  stats: DEFAULT_STATS,
  damage: {
    ice: 10
  }
}


// CLOUD
export const POISON_TOWER: ITowerModel = {
  name: "Poison Tower",
  group: "spray",
  meta: {
    key: "poison",
    distribution: "radial",
    rotation: 1,
  },
  stats: DEFAULT_STATS,
  damage: {
    posion: 10
  }
}


export const FIRE_TOWER: ITowerModel = {
  name: "Fire Tower",
  group: "cloud",
  meta: {
    key: "fire",
    distribution: "radial",
    rotation: 1,
  },
  stats: DEFAULT_STATS,
  damage: {
    posion: 10
  }
}

export const SMOKE_TOWER: ITowerModel = {
  name: "Smoke Tower",
  group: "cloud",
  meta: {
    key: "smoke",
    distribution: "radial",
    rotation: 1,
  },
  stats: DEFAULT_STATS,
  damage: {
    smoke: 10
  }
}

export const SHOCK_TOWER: ITowerModel = {
  name: "Shock Tower",
  group: "cloud",
  meta: {
    key: "shock",
    distribution: "radial",
    rotation: 1,
  },
  stats: DEFAULT_STATS,
  damage: {
    shock: 10
  }
}

export const ICE_TOWER: ITowerModel = {
  name: "Ice Tower",
  group: "cloud",
  meta: {
    key: "ice",
    distribution: "radial",
    rotation: 1,
  },
  stats: DEFAULT_STATS,
  damage: {
    freeze: 10
  }
}


// FALL
export const RAIN_TOWER: ITowerModel = {
  name: "Rain Tower",
  group: "fall",
  meta: {
    key: "rain",
    distribution: "radial",
    rotation: 1,
  },
  stats: DEFAULT_STATS,
  damage: {
    rain: 10
  }
}

export const SNOW_TOWER: ITowerModel = {
  name: "Snow Tower",
  group: "fall",
  meta: {
    key: "snow",
    distribution: "radial",
    rotation: 1,
  },
  stats: DEFAULT_STATS,
  damage: {
    rain: 10
  }
}


// THROW
export const BULLET_TOWER: ITowerModel = {
  name: "Bullet Tower",
  group: "throw",
  meta: {
    key: "bullet",
    distribution: "linear",
    rotation: "target",
  },
  stats: DEFAULT_STATS,
  damage: {
    bullet: 10
  }
}

export const MISSILE_TOWER: ITowerModel = {
  name: "Missile Tower",
  group: "throw",
  meta: {
    key: "missile",
    distribution: "linear",
    rotation: "target",
  },
  stats: DEFAULT_STATS,
  damage: {
    missile: 10
  }
}


// AREA
export const BOOST_TOWER: ITowerModel = {
  name: "Boost Tower",
  group: "area",
  meta: {
    key: "boost",
    distribution: "radial",
    rotation: 4,
  },
  stats: DEFAULT_STATS,
  damage: {
    boost: 10
  }
}

export const SLOW_TOWER: ITowerModel = {
  name: "Slow Tower",
  group: "area",
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


export const ALL_TOWERS = [
  LAZER_TOWER,
  PLASMA_TOWER,
  LIGHTNING_TOWER,
  FLAME_TOWER,
  FREEZE_TOWER,
  IMPACT_TOWER,
  POISON_TOWER,
  SMOKE_TOWER,
  SHOCK_TOWER,
  FIRE_TOWER,
  ICE_TOWER,
  RAIN_TOWER,
  SNOW_TOWER,
  BULLET_TOWER,
  MISSILE_TOWER,
  BOOST_TOWER,
  SLOW_TOWER,
]