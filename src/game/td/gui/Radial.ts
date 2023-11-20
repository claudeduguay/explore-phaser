import { Actions, Geom, Scene } from "phaser";

export function radial(scene: Scene, x: number, y: number, radius: number, items: string[]) {
  const container = scene.add.container(x, y)
  items.forEach((item, i) => {
    const text = scene.add.text(0, 0, item).setOrigin(0.5)
    container.add(text)
  })
  const ellipse = new Geom.Ellipse(0, 0, radius * 2, radius * 2)
  Actions.PlaceOnEllipse(container.list, ellipse)
  container.add(scene.add.circle(0, 0, radius + 35, 0x666666, 0.5))
  return container
}
