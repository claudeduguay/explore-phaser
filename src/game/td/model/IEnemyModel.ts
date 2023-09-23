
export interface IEnemyMeta {
  capture: string
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
  stats: IEnemyStatistics
  damage: IEnemyDamage
}

export default IEnemyModel


export const WEAK_ENEMY = {
  name: "Weak Enemy",
  meta: {
    capture: "capture-enemy-weak",
    body: "weak-enemy-body"
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

export const MODERATE_ENEMY = {
  name: "Moderate Enemy",
  meta: {
    capture: "capture-enemy-weak",
    body: "body-enemy-weak"
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

export const STRONG_ENEMY = {
  name: "Moderate Enemy",
  meta: {
    capture: "capture-enemy-strong",
    body: "body-enemy-strong"
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