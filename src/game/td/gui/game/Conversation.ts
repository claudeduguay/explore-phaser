import { Scene } from "phaser";
import { Label } from "../Label";
import { HAlign, VBoxLayout } from "../layout/ILayout";
import Panel from "../Panel";
import Point from "../../../../util/geom/Point";
import { box } from "../../../../util/geom/Box";

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
    "This area will have content that explains whatever the context of this conversation is, " +
    "allowing for a set of potential response options. Conversations can be chained with onClick " +
    "events leading to additional conversation panels or, eventually, an exit.",
  options: [
    { text: "Option 1" },
    { text: "Option 2" },
    { text: "Option 3" },
    { text: "Option 4" },
  ]
}

export default class Conversation extends Panel {

  constructor(scene: Scene, x: number, y: number, public w: number, public h: number,
    public conversation = DEFAULT_CONVERSATION) {
    super(scene, x, y, 0, 0, "cyan")

    const header = new Label(scene, w / 2, 12, conversation.title, {
      fontSize: 24,
      fontFamily: "Arial",
      padding: { x: 0, y: 5 }
    }).setOrigin(0.5, 0)
    this.add(header)
    this.add(scene.add.text(10, 25 + header.getBounds().height, conversation.content, {
      fontFamily: "Arial",
      fontSize: 18,
      wordWrap: {
        width: w - 20,
        useAdvancedWrap: true
      },
      lineSpacing: 5,
      padding: { x: 10, y: 10 },
      backgroundColor: "rgba(99, 99, 99, 0.5)",
    }))
    // const optionsContainer = scene.add.container(-w / 2, 0)
    // this.add(optionsContainer)
    conversation.options.forEach((option, i) => {
      const button = scene.add.button(0, 0, w - 20, 34, option.text, "green")
      // const button = scene.add.button(0, 0, w / conversation.options.length - 20, 34, option.text, "green")
      // optionsContainer.add(button)
      this.add(button)
    })
    // const optionsLayout = new HBoxLayout(new Point(10, 12), box(10), VAlign.Middle)
    // optionsLayout.apply(optionsContainer)
    const layout = new VBoxLayout(new Point(10, 12), box(10), HAlign.Center)
    layout.apply(this)
  }

}
