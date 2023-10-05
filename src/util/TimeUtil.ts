import { Scene } from "phaser";

export function timeScale(scene: Scene, timeScale: number) {
  if (timeScale === 0) {
    scene.game.pause()
  } else {
    scene.game.resume()
    // console.log("Set timescale:", timeScale)
    scene.tweens.timeScale = timeScale         // tweens
    scene.physics.world.timeScale = timeScale  // physics
    scene.time.timeScale = timeScale           // time events
    scene.anims.globalTimeScale = timeScale    // Animations
    // Handle particle emitters
    // scene.children.list.forEach((child: any) => {
    //   if (child.type === "ParticleEmitterManager") {
    //     child.timeScale = timeScale
    //   }
    // })
  }
}
