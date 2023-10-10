import { freezeEmitter } from "../../../emitter/ParticleConfig"
import TDTower from "../../../entity/tower/TDTower"
import BaseTargetSprayBehavior from "./BaseTargetSprayBehavior"

export default class TargetFreezeBehavior extends BaseTargetSprayBehavior {

  constructor(tower: TDTower) {
    super(tower, 'ice', freezeEmitter)
  }
}
