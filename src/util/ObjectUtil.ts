import { Utils } from "phaser";

// Abstractions to allow for new implementations if Phaser is not available

// Make an object (tree), and child values (if objects), immutable
export function deepFreeze<T extends { [key: string]: any }>(o: T) {
  Object.freeze(o);
  Object.getOwnPropertyNames(o).forEach(function (prop) {
    if (o.hasOwnProperty(prop)
      && o[prop] !== null
      && (typeof o[prop] === "object" || typeof o[prop] === "function")
      && !Object.isFrozen(o[prop])) {
      deepFreeze(o[prop]);
    }
  })
  return o
}

export function deepClone<T extends {}>(obj: T): T {
  return Utils.Objects.DeepCopy(obj) as T
}

export function hasValue<T extends {}>(obj: T, path: string) {
  return Utils.Objects.HasValue(obj, path)
}

export function getValue<T extends {}, V = any>(obj: T, path: string, defaultValue: V) {
  return Utils.Objects.GetValue(obj, path, defaultValue)
}

export function setValue<T extends {}, V = any>(obj: T, path: string, value: V) {
  return Utils.Objects.SetValue(obj, path, value)
}
