import { Curves, GameObjects, Scene, Animations } from "phaser";
import IEnemyModel from "../model/IEnemyModel";
import Direction from "../../../../util/geom/Direction";
import TDEnemy from "./TDEnemy";

const ONE_SECOND = 1000

export interface IFollowConfig {
  delay?: number
  duration: number
  onStart?: () => void
  onComplete?: () => void
}

export default class CustomFollower extends GameObjects.Container {
  _offset: number = 0
  _isFollowing = false
  sprite: GameObjects.Sprite
  anims: Animations.AnimationState
  dir?: Direction
  enemy?: TDEnemy

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
    if (value < 0.0) value = 0.0
    if (value > 1.0) value = 1.0
    this._offset = value
    // const from = new Point(this.x, this.y)
    const to = this.path.getPoint(this._offset)
    this.dir = this.calculateDirection()
    // this.angle = PMath.Angle.BetweenPoints(from, to) + Math.PI / 2
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

  startTime?: number
  config?: IFollowConfig

  // Wa want to update the offset here rather than using a tween
  preUpdate(time: number, delta: number) {
    // console.log("Follower update")
    if (this.config) {
      if (!this.startTime) {
        this.startTime = time
      }
      if (!this._isFollowing && time - this.startTime > (this.config?.delay || 0)) {
        this._isFollowing = true
        if (this.config?.onStart) {
          console.log("Run onStart()")
          this.config.onStart()
        }
      }
      if (this.offset >= 1) {
        this._isFollowing = false
      }
      if (this.config?.onComplete && this.offset >= 1) {
        console.log("Run onComplete()")
        this.config.onComplete()
      }
      if (this._isFollowing) {
        let fraction = 0.002
        if (this.enemy) {
          const speed = this.enemy.model.general.speed
          const length = this.path.getLength()
          console.log("Path length:", length)
          fraction = (speed / length) * (delta / ONE_SECOND)
        }
        this.offset += fraction
        // console.log("Update offset to:", this.offset)
      }
    }
  }

  startFollow(config?: Phaser.Types.GameObjects.PathFollower.PathConfig | Phaser.Types.Tweens.NumberTweenBuilderConfig, startAt?: number): this {
    this.config = config as IFollowConfig
    // this.tween = this.scene.add.tween({ ...config, targets: this, offset: 1.0 })
    // this._isFollowing = true
    return this
  }

  pauseFollow(): this {
    this._isFollowing = false
    return this
  }

  resumeFollow(): this {
    this._isFollowing = true
    return this
  }

  stopFollow(): this {
    this._isFollowing = false
    return this
  }

  forward(ms: number): this {
    return this
  }

  rewind(ms: number): this {
    return this
  }
}
