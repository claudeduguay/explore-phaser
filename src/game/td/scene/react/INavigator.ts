import { Scene } from "phaser"

interface INavigator {
  transitionTo(target: string, sleep?: string): Scene
}

export default INavigator
