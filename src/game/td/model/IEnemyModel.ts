
export interface IEnemyMeta {
  key: string
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


export const ENEMY_MODELS: Record<string, IEnemyModel> = {
  WEAK: {
    name: "Weak Enemy",
    meta: {
      key: "peep_weak",
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
  },
  MODERATE: {
    name: "Moderate Enemy",
    meta: {
      key: "peep_moderate"
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
  },
  STRONG: {
    name: "Strong Enemy",
    meta: {
      key: "peep_strong"
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
}

export const ALL_ENEMIES: IEnemyModel[] = Object.values(ENEMY_MODELS)