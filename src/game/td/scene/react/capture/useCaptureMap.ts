import { GameObjects, Scene } from "phaser";
import IMapModel from "../../map/IMapModel";
import { DEFAULT_CONFIG, TDTileMap } from "../../map/TDTileMap";
import { canvasSize } from "../../../../../util/SceneUtil";
import useCapture from "./useCapture";

export default function useCaptureMap(scene: Scene, model: IMapModel, scale: number = 0.15): string {
  const { w, h } = canvasSize(scene)
  const render = (texture: GameObjects.RenderTexture) => {
    const copy = new TDTileMap(scene, 0, 0, DEFAULT_CONFIG)
    copy.setModel(model)
    copy.layer.scale = scale
    texture.draw(copy)
  }
  const imageSrc = useCapture(w * scale, h * scale, render, scene)
  return imageSrc
}
