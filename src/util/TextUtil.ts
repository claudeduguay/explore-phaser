
import { Scene } from "phaser"

export function addLabel(scene: Scene, x: number, y: number, label: string) {
  // May want to explore: TextShadow (https://newdocs.phaser.io/docs/3.60.0/Phaser.Types.GameObjects.Text)
  const shadowOffset = 1
  scene.add.text(x + shadowOffset, y + shadowOffset, label, {
    fontSize: '18px',
    padding: { x: 5, y: 5 },
    backgroundColor: '#DDDDDD',
    color: 'black',
    shadow: {
      offsetX: 1,
      offsetY: 1,
      color: "#666666",
      fill: true
    }
  })
  // scene.add.text(x, y, label, {
  //   fontSize: '18px',
  //   padding: { x: 5, y: 5 },
  //   backgroundColor: 'transparent',
  //   color: '#FFFFFF'
  // })
}
