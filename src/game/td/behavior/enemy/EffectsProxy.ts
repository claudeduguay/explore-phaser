import { IEnemyGeneral } from "../../entity/model/IEnemyModel"

export const TRACE = true

export interface IEffect {
  name: string
  prop: string | symbol
  formula: (value: number) => number
}

export interface IProxyExtensions {
  getEffects(): Map<string | symbol, Set<IEffect>>
  getEffectsSet(prop: string | symbol): Set<IEffect>
  addEffect(effect: IEffect): void
  deleteEffect(effect: IEffect): void
}

export default class EffectsProxy<T extends Record<string | symbol, any>> {

  effects = new Map<string | symbol, Set<IEffect>>()

  // Presence of this method appears to be critical to avoiding type error
  // Type 'T' is not assignable to type 'T & IProxyExtensions' in "new Proxy: call
  apply(target: any, thisArg: any, args: any[]) {
  }

  get(target: T, p: string | symbol, receiver: any): any {
    if (p === "getEffects") {
      return () => this.effects
    }
    if (p === "getEffectsSet") {
      return (prop: string | symbol) => this.effects.get(prop)
    }
    if (p === "addEffect") {
      return (effect: IEffect) => {
        if (!this.effects.has(effect.prop)) {
          this.effects.set(effect.prop, new Set<IEffect>())
        }
        console.log(`Add Effect "${effect.name}" to "${effect.prop.toString()}" property using formula: ${effect.formula}`)
        this.effects.get(effect.prop)!.add(effect)
      }
    }
    if (p === "deleteEffect") {
      return (effect: IEffect) => {
        console.log(`Remove Effect "${effect.name}" to "${effect.prop.toString()}" property using formula: ${effect.formula}`)
        this.effects.get(effect.prop)?.delete(effect)
      }
    }
    if (this.effects.has(p)) {
      let value = target[p]
      this.effects.get(p)?.forEach(effect => {
        if (TRACE) {
          console.log(`Apply "${effect.name}" to "${effect.prop.toString()}" property using formula: ${effect.formula}`)
        }
        value = effect.formula(value)
      })
      return value
    }
    return target[p]
  }
}

export function makeProxy<T extends Record<string | symbol, any>>(target: T): T & IProxyExtensions {
  return new Proxy(target, new EffectsProxy<T>())
}

export function proxyTest() {
  const struct: IEnemyGeneral = {
    level: 1,
    health: 100,
    shield: 100,
    speed: 300,
    value: 50
  }
  console.log("Original Level:", struct.level)
  console.log("Original Health:", struct.health)
  console.log("Original Shield:", struct.shield)
  const proxy: IEnemyGeneral & IProxyExtensions = makeProxy(struct)
  proxy.addEffect({ name: "Increment by One", prop: ";evel", formula: v => v + 1 })
  proxy.addEffect({ name: "Increment by Ten", prop: "health", formula: v => v + 10 })
  proxy.addEffect({ name: "Divide by Two", prop: "shield", formula: v => v / 2 })
  console.log("Proxied Level:", proxy.level)
  console.log("Proxied Health:", proxy.health)
  console.log("Proxied Shield:", proxy.shield)
  console.log("Effects For level", proxy.getEffectsSet("level"))
  console.log("All Effects", proxy.getEffects())
}
