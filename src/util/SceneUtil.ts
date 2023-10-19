import { Scene } from "phaser";

export function sceneSize(scene: Scene) {
  const { width, height } = scene.sys.game.canvas
  return { w: width, h: height }
}
