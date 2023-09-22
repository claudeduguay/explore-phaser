
export interface IEnemyStatistics {
  health: number
  shield: number
  speed: number
}

export interface IEnemyDamage {
  lazer?: number
  bullet?: number
  missile?: number
  fire?: number
  lightning?: number
  poison?: number
}

export interface IEnemyModel {
  name: string
  stats: IEnemyStatistics
  damage: IEnemyDamage
}

export default IEnemyModel
