
import { Scene } from "phaser"

export function entitle(text: string) {
  return text[0].toUpperCase() + text.substring(1)
}

export function addLabel(scene: Scene, x: number, y: number, label: string, align: "left" | "right" | "center" = "left") {
  // May want to explore: TextShadow (https://newdocs.phaser.io/docs/3.60.0/Phaser.Types.GameObjects.Text)
  const text = scene.add.text(x, y, label, {
    fontSize: '18px',
    padding: { x: 5, y: 5 },
    // backgroundColor: '#DDDDDD',
    color: 'white',
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
      text.setOrigin(1, 0)
      break
  }
  return text
}

// Possible use of a custom preloader: 
// https://github.com/mozdevs/webfont-preloading/blob/master/preloading.js
// Uses FontFaceObserver: https://github.com/bramstein/fontfaceobserver
// npm install fontfaceobserver
export function addMaterialIcon(scene: Scene, x: number, y: number, code: string | number,
  fontSize: number = 64, color: string = "white") {
  const value = typeof code === "number" ? String.fromCharCode(code) : code
  const text = scene.add.text(x, y, value, {
    fontFamily: "Material Icons Outlined",
    fontSize,
    color,
    backgroundColor: "rgba(127, 127, 127, 0.66)",
    padding: { x: 0, y: 0 },
    fixedHeight: fontSize * 0.75, // Need this to be calculated
  })
  return text
}
