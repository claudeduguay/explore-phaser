import { Scene, Scenes } from "phaser";

export function sceneSize(scene: Scene) {
  // Useing scale appears to be the recommended approach
  const { width, height } = scene.scale // sys.game.canvas
  return { w: width, h: height }
}

// See: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scenemanager/
export function transitionTo(currentScene: Scene, target: string) {
  console.log(`Transition scene from "${currentScene.scene.key}" to "${target}".`)
  // this.cameras.main.once("camerafadeoutcomplete", (camera: Cameras.Scene2D.Camera) => {
  //   console.log("Faded out")
  // })
  // this.cameras.main.fadeOut(1000, 0, 0, 0)
  // if (sleep) {
  //   currentScene.scene.sleep(currentScene)
  // }
  currentScene.scene.get(target).events.once(Scenes.Events.TRANSITION_START, () => {
    console.log(`OnStart: Source is "${currentScene.scene.key}" Target is "${target}"`)
    if (currentScene.scene.key === "play" || currentScene.scene.key === "hud") {
      console.log(`Put "hud" and "play" to sleep`)
      // currentScene.scene.sleep("hud")  // "hud" does not appear to be going to sleep
      currentScene.scene.sleep("play")
    } else {
      console.log(`Put "${currentScene.scene.key}" to sleep`)
      currentScene.scene.sleep(currentScene.scene.key)
    }
  })
  // currentScene.scene.get("play").events.once(Scenes.Events.TRANSITION_WAKE, () => {
  //   console.log(`Wake "play" activate "hud".`)
  //   currentScene.scene.wake("hud")
  //   currentScene.scene.bringToTop("hud")
  // })
  // currentScene.scene.get(target).events.once(Scenes.Events.TRANSITION_COMPLETE, () => {
  //   console.log(`OnComplete: Target is "${target}"`)
  //   if (target === "play") {
  //     console.log(`Target is "play", activate "hud"`)
  //     currentScene.scene.wake("hud")
  //     currentScene.scene.bringToTop("hud")
  //   }
  //   if (target === "hud") {
  //     console.log(`Target is "hud", activate "play"`)
  //     currentScene.scene.wake("play")
  //     currentScene.scene.bringToTop("hud")
  //   }
  // })
  currentScene.scene.transition({
    target,
    duration: 0,
    sleep: false
  })

  // if (this.cameras.main) {
  //   this.cameras.main.fadeIn(1000)
  // }
  // console.log(`Transition to ${target}`)

}
