import { deepClone } from "../../../../util/ObjectUtil"
import IEnemyModel, { IEnemyGeneral } from "./IEnemyModel"
import ITowerModel from "./ITowerModel"

export const TRACE = true

export interface IPropertyEffect<T = any> {
  name: string
  prop: string | symbol
  formula: (value: T) => T
}

export interface IProxyExtensions {
  getEffects(): Map<string | symbol, Set<IPropertyEffect>>
  getEffectsSet(prop: string | symbol): Set<IPropertyEffect>
  addEffect(effect: IPropertyEffect): void
  deleteEffect(effect: IPropertyEffect): void
}

export default class EffectsProxy<T extends Record<string | symbol, any>> {

  effects = new Map<string | symbol, Set<IPropertyEffect>>()

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
      return (effect: IPropertyEffect) => {
        if (!this.effects.has(effect.prop)) {
          this.effects.set(effect.prop, new Set<IPropertyEffect>())
        }
        console.log(`Add Effect "${effect.name}" to "${effect.prop.toString()}" property using formula: ${effect.formula}`)
        this.effects.get(effect.prop)!.add(effect)
      }
    }
    if (p === "deleteEffect") {
      return (effect: IPropertyEffect) => {
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

export function deepCloneEnemyModelWithProxies(model: IEnemyModel): IEnemyModel<IProxyExtensions> {
  // Deep clone the model to ensure this instance's model is distinct
  const clone = deepClone(model)
  // Replace the "general" data structure with a proxied version that can accomodate Property Effects
  clone.general = makeProxy(clone.general)
  // Replace the "vulnerability" data structure with a proxied version that can accomodate Property Effects
  clone.defense = makeProxy(clone.defense)
  // Return the new, cloned and proxied model
  return clone as IEnemyModel<IProxyExtensions>
}

export function deepCloneTowerModelWithProxies(model: ITowerModel): ITowerModel<IProxyExtensions> {
  // Deep clone the model to ensure this instance's model is distinct
  const clone = deepClone(model)
  // Replace the "general" data structure with a proxied version that can accomodate Property Effects
  clone.general = makeProxy(clone.general)
  // // Replace the "damage.health" data structure with a proxied version that can accomodate Property Effects
  // clone.damage.health = makeProxy(clone.damage.health)
  // // Replace the "damage.shield" data structure with a proxied version that can accomodate Property Effects
  // clone.damage.shield = makeProxy(clone.damage.shield)
  // // Return the new, cloned and proxied model
  return clone as ITowerModel<IProxyExtensions>
}


// Currently called in App.tsx to validate
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
