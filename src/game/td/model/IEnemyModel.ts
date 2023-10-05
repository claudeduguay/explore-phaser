
export interface IEnemyMeta {
  body: string
}

export interface IEnemyStatistics {
  level: number
  health: number
  shield: number
  speed: number
  value: number
}

export interface IEnemyResistance {
  default: number
  [key: string]: number
}

export interface IEnemyModel {
  name: string
  meta: IEnemyMeta
  stats: IEnemyStatistics
  resistance: IEnemyResistance
}

export default IEnemyModel


export const WEAK_ENEMY: IEnemyModel = {
  name: "Weak Enemy",
  meta: {
    body: "path-green"
  },
  stats: {
    level: 1,
    health: 50,
    shield: 100,
    speed: 100,
    value: 10
  },
  resistance: {
    default: 0
  }
}

export const MODERATE_ENEMY: IEnemyModel = {
  name: "Moderate Enemy",
  meta: {
    body: "path-blue"
  },
  stats: {
    level: 2,
    health: 100,
    shield: 100,
    speed: 100,
    value: 15
  },
  resistance: {
    default: 0
  }
}

export const STRONG_ENEMY: IEnemyModel = {
  name: "Strong Enemy",
  meta: {
    body: "path-red"
  },
  stats: {
    level: 3,
    health: 200,
    shield: 100,
    speed: 100,
    value: 20
  },
  resistance: {
    default: 0
  }
}

export const ALL_ENEMIES: IEnemyModel[] = [
  WEAK_ENEMY,
  MODERATE_ENEMY,
  STRONG_ENEMY
]