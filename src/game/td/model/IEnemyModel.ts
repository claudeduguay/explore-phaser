
export interface IEnemyStatistics {
  health: number
  speed: number
}

export interface IEnemyModel {
  name: string
  stats: IEnemyStatistics
}

export default IEnemyModel
