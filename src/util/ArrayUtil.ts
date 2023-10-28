import { Utils } from "phaser"

// Abstractions to allow for new implementations if Phaser is not available

export function shuffle<T = any>(array: Array<T>): Array<T> {
  return Utils.Array.Shuffle(array)
  // for (let i = 0; i < array.length; i++) {
  //   const a = Math.floor(Math.random() * array.length)
  //   const b = Math.floor(Math.random() * array.length)
  //   const temp = array[a]
  //   array[a] = array[b]
  //   array[b] = temp
  // }
}

export function removeItem<T = any>(array: Array<T>, item: T): Array<T> {
  Utils.Array.Remove(array, item)
  return array
}

export function swapItems<T = any>(array: Array<T>, item1: T, item2: T): Array<T> {
  Utils.Array.Swap(array, item1, item2)
  return array
}
