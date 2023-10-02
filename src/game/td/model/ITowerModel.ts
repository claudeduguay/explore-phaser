
export interface ITowerProjector {
  sprite: string  // Gun or radar, etc. sprite
  emitter: string // Emitter effect type
}

export interface ITowerMeta {
  key: string                     // Tower key
  // platform: string                // Base on which the turret rests
  // turret: string                  // Turret form that holds projectors
  // projector: ITowerProjector      // Projectors (guns, radar, etc) oner for each level
  distribution: "linear" | "radial"
  rotation: "target" | number
}

export interface ITowerStatistics {
  range: number
  level: number
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
    range: 150,
    level: 3
  },
  damage: {
    lazer: 1
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
    range: 150,
    level: 3
  },
  damage: {
    plasma: 1
  }
}

export const FIRE_TOWER: ITowerModel = {
  name: "Fire Tower",
  meta: {
    key: "fire",
    distribution: "linear",
    rotation: "target",
  },
  stats: {
    range: 150,
    level: 3
  },
  damage: {
    fire: 1
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
    range: 100,
    level: 3
  },
  damage: {
    posion: 1
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
    range: 100,
    level: 3
  },
  damage: {
    smoke: 1
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
    range: 100,
    level: 3
  },
  damage: {
    shock: 1
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
    range: 100,
    level: 3
  },
  damage: {
    freeze: 1
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
    range: 150,
    level: 3
  },
  damage: {
    bullet: 1
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
    range: 150,
    level: 3
  },
  damage: {
    missile: 1
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
    range: 150,
    level: 3
  },
  damage: {
    lightning: 1
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
    range: 150,
    level: 3
  },
  damage: {
    ice: 1
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
    range: 150,
    level: 3
  },
  damage: {
    boost: 1
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
    range: 150,
    level: 3
  },
  damage: {
    slow: 1
  }
}


export const ALL_TOWERS = [
  LAZER_TOWER,
  PLASMA_TOWER,
  FIRE_TOWER,
  POISON_TOWER,
  SMOKE_TOWER,
  SHOCK_TOWER,
  FREEZE_TOWER,
  BULLET_TOWER,
  MISSILE_TOWER,
  LIGHTNING_TOWER,
  ICE_TOWER,
  BOOST_TOWER,
  SLOW_TOWER
]