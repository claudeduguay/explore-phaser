import { Curves, GameObjects, Scene, Math as PMath, Tweens, Animations } from "phaser";
import IEnemyModel from "../model/IEnemyModel";
import Point from "../../../../util/geom/Point";

export default class CustomFollower extends GameObjects.Container {
  _offset: number = 0
  _isFollowing = false
  tween?: Tweens.Tween
  sprite: GameObjects.Sprite
  anims: Animations.AnimationState
  direction: any

  constructor(scene: Scene,
    public x: number, public y: number,
    public model: IEnemyModel, public path: Curves.Path = new Curves.Path()) {

    super(scene, x, y)
    this.sprite = scene.add.sprite(0, 0, model.key)
    this.anims = this.sprite.anims
    this.add(this.sprite)
  }

  get offset() {
    return this._offset
  }

  set offset(value: number) {
    this._offset = value
    const from = new Point(this.x, this.y)
    const to = this.path.getPoint(this._offset)
    this.direction = this.calculateDirection()
    this.angle = PMath.Angle.BetweenPoints(from, to) + Math.PI / 2
    this.setPosition(to.x, to.y)
  }

  calculateDirection() {
    const segment = this.path.getCurveAt(this._offset)
    if (segment instanceof Curves.Line) {
      if (segment.p0.x === segment.p1.x) {
        // Vertical
        if (segment.p0.y < segment.p1.y) {
          return "south"
        } else {
          return "north"
        }
      } else {
        // Horizontal
        if (segment.p0.x < segment.p1.x) {
          return "east"
        } else {
          return "west"
        }
      }
    }
  }

  isFollowing(): boolean {
    return this._isFollowing
  }

  startFollow(config?: Phaser.Types.GameObjects.PathFollower.PathConfig | Phaser.Types.Tweens.NumberTweenBuilderConfig, startAt?: number): this {
    this._isFollowing = true
    this.tween = this.scene.add.tween({ ...config, targets: this, offset: 1.0 })
    return this
  }

  pauseFollow(): this {
    this._isFollowing = false
    this.tween?.pause()
    return this
  }

  resumeFollow(): this {
    this._isFollowing = true
    this.tween?.resume()
    return this
  }

  stopFollow(): this {
    this._isFollowing = false
    this.tween?.stop()
    return this
  }

  forward(ms: number): this {
    this.tween?.forward(ms)
    return this
  }

  rewind(ms: number): this {
    this.tween?.rewind(ms)
    return this
  }
}
