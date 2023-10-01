import { Scene } from "phaser"

interface INavigator {
  play(key: string): void
  transitionTo(target: string, sleep?: string): Scene
  mute: boolean
}

export default INavigator
