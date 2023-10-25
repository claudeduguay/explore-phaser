import { Scene } from "phaser";
import TDGameScene from "./TDGameScene";

export default class TDHUDScene extends Scene {
  constructor(public readonly main: TDGameScene) {
    super({ key: "hud" })
  }
}
