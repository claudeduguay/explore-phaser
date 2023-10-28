import { Scene } from "phaser";

export function sceneSize(scene: Scene) {
  // Useing scale appears to be the recommended approach
  const { width, height } = scene.scale // sys.game.canvas
  return { w: width, h: height }
}
