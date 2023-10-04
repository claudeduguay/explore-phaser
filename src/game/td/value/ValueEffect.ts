import { Scene } from "phaser"

export default class ValueEffect {

  constructor(public scene: Scene, property: string, effect: Function, duration: number) {
  }

}
