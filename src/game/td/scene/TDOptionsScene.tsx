
import { addReactNode } from "../../../util/DOMUtil"
import TDGameScene from "./TDGameScene"
import GameOptions from "./react/GameOptions"
import TDNavScene from "./TDNavScene"

export default class TDOptionsScene extends TDNavScene {
  constructor(public readonly main: TDGameScene) {
    super("options", main)
  }

  create() {
    // TODO: Need to port to non-React view
    addReactNode(this, <GameOptions scene={this} navigator={this.main} />, 0, -800, 0, 0)
  }
}
