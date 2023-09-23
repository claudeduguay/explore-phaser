
export interface ITowerMeta {
  key: string
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
    key: "lazer-tower",
    platform: "",
    turret: "",
    emitters: [],
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
