import { Scene } from "phaser"

interface INavigator extends Scene {
  play(key: string): void
  transitionTo(target: string, sleep?: string): Scene
  mute: boolean
}

export default INavigator
