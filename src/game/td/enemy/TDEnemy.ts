import { Scene, GameObjects, Curves } from "phaser";
import IEnemyModel from "../model/IEnemyModel";

export default class TDEnemy extends GameObjects.PathFollower {

  constructor(scene: Scene, public path: Curves.Path, public x: number, public y: number, key: string, public model?: IEnemyModel) {
    super(scene, path, x, y, key)
    // this.setSize(32, 32) // Sets bounding box
  }
}
