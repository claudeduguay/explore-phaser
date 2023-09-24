
import { Scene } from "phaser"

export function addLabel(scene: Scene, x: number, y: number, label: string, align: "left" | "right" | "center" = "left") {
  // May want to explore: TextShadow (https://newdocs.phaser.io/docs/3.60.0/Phaser.Types.GameObjects.Text)
  const shadowOffset = 1
  const text = scene.add.text(x + shadowOffset, y + shadowOffset, label, {
    fontSize: '18px',
    padding: { x: 5, y: 5 },
    backgroundColor: '#DDDDDD',
    color: 'black',
    // shadow: {
    //   offsetX: 1,
    //   offsetY: 1,
    //   color: "#666666",
    //   fill: true
    // }
  })
  switch (align) {
    case "center":
      text.setOrigin(0.5, 0)
      break
    case "left":
      text.setOrigin(0, 0)
      break
    case "right":
      text.setOrigin(1.0, 0)
      break
  }
}
