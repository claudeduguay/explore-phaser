import { flameEmitter } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import BaseTargetSprayBehavior from "./BaseTargetSprayBehavior"

export default class TargetFlameBehavior extends BaseTargetSprayBehavior {

  constructor(tower: TDTower) {
    super(tower, 'fire', flameEmitter)
  }
}
