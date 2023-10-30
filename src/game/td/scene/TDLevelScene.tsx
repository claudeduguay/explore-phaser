
import { addReactNode } from "../../../util/DOMUtil"
import TDGameScene from "./TDGameScene"
import GameLevels from "./react/GameLevels"
import TDNavScene from "./TDNavScene"

// @ts-ignore
export default class TDMapsScene extends TDNavScene {
  constructor(public readonly main: TDGameScene) {
    super("maps", main)
  }

  create() {
    // TODO: Need to port to non-React view
    addReactNode(this, <GameLevels scene={this} navigator={this.main} />, 0, -800, 0, 0)
  }
}
