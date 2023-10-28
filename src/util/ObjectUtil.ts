import { Utils } from "phaser";

// Abstractions to allow for new implementations if Phaser is not available

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
