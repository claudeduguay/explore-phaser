import { Curves, GameObjects, Scene, Math as PMath, Tweens, Animations } from "phaser";
import IEnemyModel from "../model/IEnemyModel";
import Point from "../../../../util/geom/Point";

export default class CustomFollower extends GameObjects.Container {
  _offset: number = 0
  tween?: Tweens.Tween
  _isFollowing = false
  sprite: GameObjects.Sprite
  anims: Animations.AnimationState

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
    this.angle = PMath.Angle.BetweenPoints(from, to) + Math.PI / 2
    this.setPosition(to.x, to.y)
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

}
