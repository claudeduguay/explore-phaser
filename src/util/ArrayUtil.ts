
export function shuffle(array: Array<any>) {
  for (let i = 0; i < array.length; i++) {
    const a = Math.floor(Math.random() * array.length)
    const b = Math.floor(Math.random() * array.length)
    const temp = array[a]
    array[a] = array[b]
    array[b] = temp
  }
}