import { Plugins } from "phaser"
import TDTower from "./TDTower"

export default class TowerPlugin extends Plugins.BasePlugin {

  constructor(pluginManager: Plugins.PluginManager) {
    super(pluginManager)
    pluginManager.registerGameObject('tower', this.createTower)
  }

  createTower(key: string, x: number, y: number) {
    const tower = new TDTower(key, x, y)
    return tower
  }
}
