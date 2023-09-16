import { Input } from 'phaser'

// Reudimentary Keyboard mapping abstraction
// Supports multiple possible keys for a given symbol

export default class KeyMap {

  keyMap = new Map<string, Set<Input.Keyboard.Key>>()

  constructor(public readonly keyboardPlugin: Input.Keyboard.KeyboardPlugin) {
    this.addKeys("home", Input.Keyboard.KeyCodes.HOME)
    this.addKeys("plus", Input.Keyboard.KeyCodes.PLUS, Input.Keyboard.KeyCodes.NUMPAD_ADD)
    this.addKeys("minus", Input.Keyboard.KeyCodes.MINUS, Input.Keyboard.KeyCodes.NUMPAD_SUBTRACT)
    this.addKeys("down", Input.Keyboard.KeyCodes.DOWN, Input.Keyboard.KeyCodes.S)
    this.addKeys("up", Input.Keyboard.KeyCodes.UP, Input.Keyboard.KeyCodes.W)
    this.addKeys("left", Input.Keyboard.KeyCodes.LEFT, Input.Keyboard.KeyCodes.A)
    this.addKeys("right", Input.Keyboard.KeyCodes.RIGHT, Input.Keyboard.KeyCodes.D)
  }

  addKeys(symbol: string, ...codes: (string | number | Input.Keyboard.Key)[]) {
    for (let code of codes) {
      this.addKey(symbol, code)
    }
  }

  addKey(symbol: string, code: string | number | Input.Keyboard.Key) {
    if (!this.keyMap.has(symbol)) {
      this.keyMap.set(symbol, new Set<Input.Keyboard.Key>())
    }
    const key = this.keyboardPlugin.addKey(code)
    this.keyMap.get(symbol)?.add(key)
  }

  // True if any of the provided keys are down
  isDown(symbol: string) {
    const keys = this.keyMap.get(symbol)
    if (keys) {
      for (let key of keys) {
        if (key.isDown) {
          return true
        }
      }
    }
    return false
  }
}
