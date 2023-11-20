import { Scene } from "phaser";
import { sceneSize } from "../../util/SceneUtil";
import Button, { makeButtonTextures } from "../td/gui/Button";
import { diamondSquare } from "./DiamondSquare";
import { generateGeography } from "./Perlin";

// Great article: https://www.redblobgames.com/maps/terrain-from-noise/
// https://medium.com/nerd-for-tech/generating-digital-worlds-using-perlin-noise-5d11237c29e9
// Very cool plasma effect. See: https://codepen.io/jwagner/pen/BNmpdm/?editors=001

export default class Geography extends Scene {

  constructor() {
    super('geography')
  }

  preload() {
    makeButtonTextures(this)
    this.generate()
  }

  generate() {
    if (this.textures.exists("geo")) {
      this.textures.remove("geo")
    }
    const useDiamongSquare = false
    if (useDiamongSquare) {
      diamondSquare(this, "geo")
    } else {
      const { w, h } = sceneSize(this)
      generateGeography(this, "geo", w, h)
    }
  }

  create() {
    const { w, h } = sceneSize(this)
    const sprite = this.add.sprite(w / 2, h / 2, "geo")
    const button = new Button(this, 60, 25, 100, 30, "Generate")
    button.onClick = () => {
      this.generate()
      sprite.setTexture("geo")
    }
    this.add.existing(button)
  }
}
