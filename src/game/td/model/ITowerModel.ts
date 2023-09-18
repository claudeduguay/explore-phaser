
export interface ITowerDamage {
  type: "laser" | "bullet" | "missile"
  damage: number
}

export interface ITowerStatistics {
  range: number
  guns: number
}

export interface ITowerModel {
  name: string
  stats: ITowerStatistics
}

export default ITowerModel
