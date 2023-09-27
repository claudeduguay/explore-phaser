
export default class SpriteSheet {

  constructor(
    public readonly image: HTMLCanvasElement,
    public readonly width: number,
    public readonly height: number) {
  }

  renderImage = (g: CanvasRenderingContext2D) => {
    g.drawImage(this.image, 0, 0)
  }

  renderFrame = (g: CanvasRenderingContext2D, index: number) => {
    // Could be SVGLength but not in our case
    let imageWidth = this.image.width as number
    const frameCount = Math.floor(imageWidth / this.width)
    if (index > frameCount) {
      throw new Error(`Index out of bounds, max value: ${imageWidth}`)
    }
    const offset = index * this.width
    g.drawImage(this.image, offset, 0, this.width, this.height, 0, 0, this.width, this.height)
  }

  static from(frames: CanvasImageSource[], width: number, height: number): SpriteSheet {
    const fullWidth = frames.length * width
    const canvas = document.createElement("canvas")
    canvas.width = fullWidth
    canvas.height = height
    const g = canvas.getContext("2d")
    let offset = 0
    for (let i = 0; i < frames.length; i++) {
      g?.drawImage(frames[i], offset, 0)
      offset += width
    }
    return new SpriteSheet(canvas, width, height)
  }
}
