// Extend Phaser GameObjectFactory support for new registered objects

declare namespace Phaser.GameObjects {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface GameObjectFactory {
    tower(x: number, y: number, model: ITowerModel, selectionManager?: SelectionManager): TDTower
    enemy(x: number, y: number, key: string, path: Curves.Path, model: IEnemyModel, showStatusBars?: boolean): TDEnemy
  }
}
