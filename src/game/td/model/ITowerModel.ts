
export interface ITowerMeta {
  capture: string
  platform: string
  turret: string
  emitters: string[]
}

export interface ITowerStatistics {
  range: number
  emitters: number
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
    emitters: ["lazer-gun", "lazer-gun", "lazer-gun"],
  },
  stats: {
    range: 150,
    emitters: 3
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
