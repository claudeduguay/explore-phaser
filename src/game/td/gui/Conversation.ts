import { Scene, GameObjects } from "phaser";
import { Label } from "./Label";

export interface IConversationModel {
  title: string
  content: string
  options: {
    text: string,
    onClick?: () => void
  }[]
}

export const DEFAULT_CONVERSATION: IConversationModel = {
  title: "Conversation Title",
  content:
    "This area will have content that explains whaterve the context of this conversation is, " +
    "allowing for a set of potential response options. Conversations can be chained with onClick " +
    "events leading to additional conversation panels.",
  options: [
    { text: "Option 1" },
    { text: "Option 2" },
    { text: "Option 3" },
    { text: "Option 4" },
  ]
}

export default class Conversation extends GameObjects.Container {

  constructor(scene: Scene, x: number, y: number, public w: number, public h: number,
    public conversation = DEFAULT_CONVERSATION) {
    super(scene, x, y)
    const panel = scene.add.panel(0, 0, w, h, "blue")
    this.add(panel)
    const header = new Label(scene, w / 2, 12, conversation.title, {
      fontSize: 24,
      fontFamily: "Arial",

    }).setOrigin(0.5, 0)
    this.add(header)
    this.add(scene.add.text(10, 25 + header.getBounds().height, conversation.content, {
      fontFamily: "Arial",
      wordWrap: {
        width: w - 20,
        useAdvancedWrap: true
      },
      lineSpacing: 5,
      padding: { x: 10, y: 10 },
      backgroundColor: "rgba(99, 99, 99, 0.5)"
    }))
    conversation.options.forEach((o, i) => {
      this.add(scene.add.button(95 + 170 * i, h - 30, 150, 30, o.text, "green"))
    })
  }

}
