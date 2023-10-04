// Extend Phaser GameObjectFactory support for new registered game objects
// See; https://blog.ourcade.co/posts/2020/organize-phaser-3-code-game-object-factory-methods/
// Note: The best file name for this is phaser.d.ts (object name in article doesn't work)

declare namespace Phaser.GameObjects {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface GameObjectFactory {
    tower(x: number, y: number, model: ITowerModel): TDTower
    enemy(x: number, y: number, key: string, path: Curves.Path, model: IEnemyModel, showStatusBars?: boolean): TDEnemy
  }
}