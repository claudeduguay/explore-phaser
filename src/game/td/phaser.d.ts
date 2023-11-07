// Extend Phaser GameObjectFactory support for new registered game objects
// See; https://blog.ourcade.co/posts/2020/organize-phaser-3-code-game-object-factory-methods/
// Note: The best file name for this is phaser.d.ts (object name in article doesn't work)

declare namespace Phaser.GameObjects {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface GameObjectFactory {

    // Game Elements
    tower(x: number, y: number, model: ITowerModel): TDTower
    enemy(x: number, y: number, model: IEnemyModel, path?: Curves.Path, showStatusBars?: boolean): TDEnemy

    // GUI Elements
    layout(x: number, y: number, layout: ILayout): LayoutContainer
    panel(x: number, y: number, w: number, h: number, stylePrefix?: string): Panel
    button(x: number, y: number, w: number, h: number, text?: string, public stylePrefix?: string, onClick?: () => void): Button
    paragraph(x: number, y: number, w: number, text: string, style?: Types.GameObjects.Text.TextStyle): Label
    label(x: number, y: number, text: string, style?: Types.GameObjects.Text.TextStyle): Label
    icon(x: number, y: number, code: string | number, style?: Types.GameObjects.Text.TextStyle): Icon

    // Update-only Components
    statemachine(name?: string, validateTransisions?: ValidateTransitions, traceTransitions?: TraceTransitions): StateMachine
  }
}
