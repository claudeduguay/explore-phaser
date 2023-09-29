
export interface IEnemyMeta {
  body: string
}

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
  meta: IEnemyMeta
  stats: IEnemyStatistics
  damage: IEnemyDamage
}

export default IEnemyModel


export const WEAK_ENEMY: IEnemyModel = {
  name: "Weak Enemy",
  meta: {
    body: "path-green"
  },
  stats: {
    health: 100,
    shield: 100,
    speed: 100
  },
  damage: {
    lazer: 1,
    bullet: 1,
    missile: 1,
    fire: 1,
    lightning: 1,
    poison: 1
  }
}

export const MODERATE_ENEMY: IEnemyModel = {
  name: "Moderate Enemy",
  meta: {
    body: "path-blue"
  },
  stats: {
    health: 100,
    shield: 100,
    speed: 100
  },
  damage: {
    lazer: 1,
    bullet: 1,
    missile: 1,
    fire: 1,
    lightning: 1,
    poison: 1
  }
}

export const STRONG_ENEMY: IEnemyModel = {
  name: "Moderate Enemy",
  meta: {
    body: "path-red"
  },
  stats: {
    health: 100,
    shield: 100,
    speed: 100
  },
  damage: {
    lazer: 1,
    bullet: 1,
    missile: 1,
    fire: 1,
    lightning: 1,
    poison: 1
  }
}