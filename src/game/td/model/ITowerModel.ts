
export interface ITowerProjector {
  sprite: string  // Gun or radar, etc. sprite
  emitter: string // Emitter effect type
}

export interface ITowerMeta {
  platform: string                // Base on which the turret rests
  turret: string                  // Turret form that holds projectors
  projectors: ITowerProjector[]   // 1..3 Projectors (guns, radar, etc)
  distribution?: "linear" | "radial"
}

export interface ITowerStatistics {
  range: number
  level: number
}

export interface ITowerDamage {
  lazer?: number
  bullet?: number
  missile?: number
  fire?: number
  lightning?: number
  poison?: number
  ice?: number
  boost?: number
  slow?: number
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
    platform: "lazer-platform",
    turret: "lazer-turret",
    projectors: [{
      sprite: "lazer-projector",
      emitter: "lazer-emitter"
    },
    {
      sprite: "lazer-projector",
      emitter: "lazer-emitter"
    },
    {
      sprite: "lazer-projector",
      emitter: "lazer-emitter"
    }],
    distribution: "linear",
  },
  stats: {
    range: 150,
    level: 3
  },
  damage: {
    lazer: 100,
    bullet: 0,
    missile: 0,
    fire: 0,
    lightning: 0,
    poison: 0,
    ice: 0,
    boost: 0,
    slow: 0
  }
}

export const FIRE_TOWER: ITowerModel = {
  name: "Fire Tower",
  meta: {
    platform: "fire-platform",
    turret: "fire-turret",
    projectors: [{
      sprite: "fire-projector",
      emitter: "fire-emitter"
    },
    {
      sprite: "fire-projector",
      emitter: "fire-emitter"
    },
    {
      sprite: "fire-projector",
      emitter: "fire-emitter"
    }],
    distribution: "linear",
  },
  stats: {
    range: 150,
    level: 3
  },
  damage: {
    lazer: 0,
    bullet: 0,
    missile: 0,
    fire: 100,
    lightning: 0,
    poison: 0,
    ice: 0,
    boost: 0,
    slow: 0
  }
}

export const POISON_TOWER: ITowerModel = {
  name: "Poison Tower",
  meta: {
    platform: "poison-platform",
    turret: "poison-turret",
    projectors: [{
      sprite: "poison-projector",
      emitter: "poison-emitter"
    },
    {
      sprite: "poison-projector",
      emitter: "poison-emitter"
    },
    {
      sprite: "poison-projector",
      emitter: "poison-emitter"
    }],
    distribution: "radial",
  },
  stats: {
    range: 150,
    level: 3
  },
  damage: {
    lazer: 0,
    bullet: 0,
    missile: 0,
    fire: 0,
    lightning: 0,
    poison: 100,
    ice: 0,
    boost: 0,
    slow: 0
  }
}

export const BULLET_TOWER: ITowerModel = {
  name: "Bullet Tower",
  meta: {
    platform: "bullet-platform",
    turret: "bullet-turret",
    projectors: [{
      sprite: "bullet-projector",
      emitter: "bullet-emitter"
    },
    {
      sprite: "bullet-projector",
      emitter: "bullet-emitter"
    },
    {
      sprite: "bullet-projector",
      emitter: "bullet-emitter"
    }],
    distribution: "linear",
  },
  stats: {
    range: 150,
    level: 3
  },
  damage: {
    lazer: 0,
    bullet: 100,
    missile: 0,
    fire: 0,
    lightning: 0,
    poison: 0,
    ice: 0,
    boost: 0,
    slow: 0
  }
}

export const MISSILE_TOWER: ITowerModel = {
  name: "Missile Tower",
  meta: {
    platform: "missile-platform",
    turret: "missile-turret",
    projectors: [{
      sprite: "missile-projector",
      emitter: "missile-emitter"
    },
    {
      sprite: "missile-projector",
      emitter: "missile-emitter"
    },
    {
      sprite: "missile-projector",
      emitter: "missile-emitter"
    }],
    distribution: "linear",
  },
  stats: {
    range: 150,
    level: 3
  },
  damage: {
    lazer: 0,
    bullet: 0,
    missile: 100,
    fire: 0,
    lightning: 0,
    poison: 0,
    ice: 0,
    boost: 0,
    slow: 0
  }
}

export const LIGHTNING_TOWER: ITowerModel = {
  name: "Lightning Tower",
  meta: {
    platform: "lightning-platform",
    turret: "lightning-turret",
    projectors: [{
      sprite: "lightning-projector",
      emitter: "lightning-emitter"
    },
    {
      sprite: "lightning-projector",
      emitter: "lightning-emitter"
    },
    {
      sprite: "lightning-projector",
      emitter: "lightning-emitter"
    }],
    distribution: "linear",
  },
  stats: {
    range: 150,
    level: 3
  },
  damage: {
    lazer: 0,
    bullet: 0,
    missile: 0,
    fire: 0,
    lightning: 100,
    poison: 0,
    ice: 0,
    boost: 0,
    slow: 0
  }
}

export const ICE_TOWER: ITowerModel = {
  name: "Ice Tower",
  meta: {
    platform: "ice-platform",
    turret: "ice-turret",
    projectors: [{
      sprite: "ice-projector",
      emitter: "ice-emitter"
    },
    {
      sprite: "ice-projector",
      emitter: "ice-emitter"
    },
    {
      sprite: "ice-projector",
      emitter: "ice-emitter"
    }],
    distribution: "linear",
  },
  stats: {
    range: 150,
    level: 3
  },
  damage: {
    lazer: 0,
    bullet: 0,
    missile: 0,
    fire: 0,
    lightning: 0,
    poison: 0,
    ice: 100,
    boost: 0,
    slow: 0
  }
}

export const BOOST_TOWER: ITowerModel = {
  name: "Boost Tower",
  meta: {
    platform: "boost-platform",
    turret: "boost-turret",
    projectors: [{
      sprite: "boost-projector",
      emitter: "boost-emitter"
    },
    {
      sprite: "boost-projector",
      emitter: "boost-emitter"
    },
    {
      sprite: "boost-projector",
      emitter: "boost-emitter"
    }],
    distribution: "radial",
  },
  stats: {
    range: 150,
    level: 3
  },
  damage: {
    lazer: 0,
    bullet: 0,
    missile: 0,
    fire: 0,
    lightning: 0,
    poison: 0,
    ice: 0,
    boost: 100
  }
}

export const SLOW_TOWER: ITowerModel = {
  name: "Slow Tower",
  meta: {
    platform: "slow-platform",
    turret: "slow-turret",
    projectors: [{
      sprite: "slow-projector",
      emitter: "slow-emitter"
    },
    {
      sprite: "slow-projector",
      emitter: "slow-emitter"
    },
    {
      sprite: "slow-projector",
      emitter: "slow-emitter"
    }],
    distribution: "radial",
  },
  stats: {
    range: 150,
    level: 3
  },
  damage: {
    lazer: 0,
    bullet: 0,
    missile: 0,
    fire: 0,
    lightning: 0,
    poison: 0,
    ice: 0,
    boost: 0,
    slow: 100
  }
}


export const ALL_TOWERS = [
  LAZER_TOWER,
  FIRE_TOWER,
  POISON_TOWER,
  BULLET_TOWER,
  MISSILE_TOWER,
  LIGHTNING_TOWER,
  ICE_TOWER,
  BOOST_TOWER,
  SLOW_TOWER
]