import { Curves, GameObjects, Scene, Math as PMath, Tweens, Animations } from "phaser";
import IEnemyModel from "../model/IEnemyModel";
import Point from "../../../../util/geom/Point";
import Direction from "../../../../util/geom/Direction";

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
          return Direction.South
        } else {
          return Direction.North
        }
      } else {
        // Horizontal
        if (segment.p0.x < segment.p1.x) {
          return Direction.East
        } else {
          return Direction.West
        }
      }
    }
  }

  isFollowing(): boolean {
    return this._isFollowing
  }

  startFollow(config?: Phaser.Types.GameObjects.PathFollower.PathConfig | Phaser.Types.Tweens.NumberTweenBuilderConfig, startAt?: number): this {
    this.tween = this.scene.add.tween({ ...config, targets: this, offset: 1.0 })
    this._isFollowing = true
    return this
  }

  pauseFollow(): this {
    this.tween?.pause()
    this._isFollowing = false
    return this
  }

  resumeFollow(): this {
    this.tween?.resume()
    this._isFollowing = true
    return this
  }

  stopFollow(): this {
    this.tween?.stop()
    this._isFollowing = false
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
