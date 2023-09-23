
export interface ITowerProjector {
  sprite: string  // Gun or radar, etc. sprite
  emitter: string // Emitter effect type
}

export interface ITowerMeta {
  capture: string
  platform: string                // Base on which the turret rests
  turret: string                  // Turret form that holds projectors
  projectors: ITowerProjector[]   // 1..3 Projectors (guns, radar, etc)
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
    capture: "capture-lazer-tower",
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
  }
}

export const FIRE_TOWER: ITowerModel = {
  name: "Fire Tower",
  meta: {
    capture: "capture-fire-tower",
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
  }
}

export const POISON_TOWER: ITowerModel = {
  name: "Poison Tower",
  meta: {
    capture: "capture-fire-tower",
    platform: "poison-platform",
    turret: "poison-turret",
    projectors: [{
      sprite: "poison-projector",
      emitter: "poison-emitter"
    }]
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
  }
}
