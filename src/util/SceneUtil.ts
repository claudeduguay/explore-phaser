import { Scene } from "phaser";

export function canvasSize(scene: Scene) {
  const { width, height } = scene.sys.game.canvas
  return { w: width, h: height }
}
