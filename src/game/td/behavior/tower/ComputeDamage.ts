import { randomRange } from "../../../../util/Random"
import TDEnemy from "../../entity/enemy/TDEnemy"
import TDTower from "../../entity/tower/TDTower"

/*
We currently take into account all tower damage entries, cummulatively,
applying relevant (specific or default) vulnerability multipliers to 
determine full damage effect.
*/

export function computeTargetDamage(tower: TDTower, target: TDEnemy, delta: number) {
  let damage = 0
  Object.entries(tower.model.damage).forEach(([key, value]) => {
    const val = Array.isArray(value.dps) ? randomRange(value.dps) : value.dps
    const dps = (val * delta / 1000 * tower.scene.time.timeScale)
    const vulnerability = (target.model?.vulnerability[key] || target.model?.vulnerability.default)
    damage += (dps * vulnerability)
    // console.log(`${value}, (per update: ${dps}) ${key} damage from ${tower.model.name} (resistance: ${resistance})`)
  })
  return damage
}

// Apply damage to one or more targets
export function applyDamage(tower: TDTower, delta: number, singleTarget: boolean = true) {
  // console.log("Delta:", delta)
  const targets = singleTarget ? [tower.targeting.current[0]] : tower.targeting.current
  targets.forEach(target => {
    if (target instanceof TDEnemy) {  // Ensure acces by type
      let damage = computeTargetDamage(tower, target, delta)
      target.health.adjust(-damage)
    }
  })
}
