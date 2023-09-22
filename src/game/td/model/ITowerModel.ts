
export interface ITowerMeta {
  key: string
  base: string
  turret: string
  gun: string
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
