
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
  meta: ITowerMeta
  stats: ITowerStatistics
  damage: ITowerDamage
}

export default ITowerModel

// ------------------------------------------------------------------
// INSTANCES
// ------------------------------------------------------------------

export const LAZER_TOWER: ITowerModel = {
  name: "Lazer Tower",
  meta: {
    key: "lazer",
    distribution: "linear",
    rotation: "target",
  },
  stats: {
    level: 3,
    cost: 100,
    range: 150,
  },
  damage: {
    lazer: 10
  }
}

export const PLASMA_TOWER: ITowerModel = {
  name: "Plasma Tower",
  meta: {
    key: "plasma",
    distribution: "linear",
    rotation: "target",
  },
  stats: {
    level: 3,
    cost: 100,
    range: 150,
  },
  damage: {
    plasma: 10
  }
}

export const FLAME_TOWER: ITowerModel = {
  name: "Flame Tower",
  meta: {
    key: "flame",
    distribution: "linear",
    rotation: "target",
  },
  stats: {
    level: 3,
    cost: 100,
    range: 150,
  },
  damage: {
    fire: 10
  }
}

export const POISON_TOWER: ITowerModel = {
  name: "Poison Tower",
  meta: {
    key: "poison",
    distribution: "radial",
    rotation: 1,
  },
  stats: {
    level: 3,
    cost: 100,
    range: 100,
  },
  damage: {
    posion: 10
  }
}

export const SMOKE_TOWER: ITowerModel = {
  name: "Smoke Tower",
  meta: {
    key: "smoke",
    distribution: "radial",
    rotation: 1,
  },
  stats: {
    level: 3,
    cost: 100,
    range: 100,
  },
  damage: {
    smoke: 10
  }
}

export const SHOCK_TOWER: ITowerModel = {
  name: "Shock Tower",
  meta: {
    key: "shock",
    distribution: "radial",
    rotation: 1,
  },
  stats: {
    level: 3,
    cost: 100,
    range: 100,
  },
  damage: {
    shock: 10
  }
}

export const FREEZE_TOWER: ITowerModel = {
  name: "Freeze Tower",
  meta: {
    key: "freeze",
    distribution: "radial",
    rotation: 1,
  },
  stats: {
    level: 3,
    cost: 100,
    range: 100,
  },
  damage: {
    freeze: 10
  }
}

export const RAIN_TOWER: ITowerModel = {
  name: "Rain Tower",
  meta: {
    key: "rain",
    distribution: "radial",
    rotation: 1,
  },
  stats: {
    level: 3,
    cost: 100,
    range: 100,
  },
  damage: {
    rain: 10
  }
}

export const SNOW_TOWER: ITowerModel = {
  name: "Snow Tower",
  meta: {
    key: "snow",
    distribution: "radial",
    rotation: 1,
  },
  stats: {
    level: 3,
    cost: 100,
    range: 100,
  },
  damage: {
    rain: 10
  }
}

export const BULLET_TOWER: ITowerModel = {
  name: "Bullet Tower",
  meta: {
    key: "bullet",
    distribution: "linear",
    rotation: "target",
  },
  stats: {
    level: 3,
    cost: 100,
    range: 150,
  },
  damage: {
    bullet: 10
  }
}

export const MISSILE_TOWER: ITowerModel = {
  name: "Missile Tower",
  meta: {
    key: "missile",
    distribution: "linear",
    rotation: "target",
  },
  stats: {
    level: 3,
    cost: 100,
    range: 150,
  },
  damage: {
    missile: 10
  }
}

export const LIGHTNING_TOWER: ITowerModel = {
  name: "Lightning Tower",
  meta: {
    key: "lightning",
    distribution: "linear",
    rotation: "target",
  },
  stats: {
    level: 3,
    cost: 100,
    range: 150,
  },
  damage: {
    lightning: 10
  }
}

export const ICE_TOWER: ITowerModel = {
  name: "Ice Tower",
  meta: {
    key: "ice",
    distribution: "linear",
    rotation: "target",
  },
  stats: {
    level: 3,
    cost: 100,
    range: 150,
  },
  damage: {
    ice: 10
  }
}

export const BOOST_TOWER: ITowerModel = {
  name: "Boost Tower",
  meta: {
    key: "boost",
    distribution: "radial",
    rotation: 4,
  },
  stats: {
    level: 3,
    cost: 100,
    range: 150,
  },
  damage: {
    boost: 10
  }
}

export const SLOW_TOWER: ITowerModel = {
  name: "Slow Tower",
  meta: {
    key: "slow",
    distribution: "radial",
    rotation: -1,
  },
  stats: {
    level: 3,
    cost: 100,
    range: 150,

  },
  damage: {
    slow: 10
  }
}


export const ALL_TOWERS = [
  LAZER_TOWER,
  PLASMA_TOWER,
  LIGHTNING_TOWER,
  FLAME_TOWER,
  ICE_TOWER,
  BULLET_TOWER,
  POISON_TOWER,
  SMOKE_TOWER,
  SHOCK_TOWER,
  FREEZE_TOWER,
  RAIN_TOWER,
  SNOW_TOWER,
  MISSILE_TOWER,
  BOOST_TOWER,
  SLOW_TOWER,
]