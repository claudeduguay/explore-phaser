import { randomRange } from "../../../../util/Random"
import TDEnemy from "../../entity/enemy/TDEnemy"
import TDTower from "../../entity/tower/TDTower"

export function computeHealthDamage(tower: TDTower, target: TDEnemy, delta: number) {
  const damage = tower.model.damage
  if (damage.type === "health") {
    const val = Array.isArray(damage.dps) ? randomRange(damage.dps) : damage.dps
    const dps = (val * delta / 1000 * (tower.scene?.time?.timeScale || 1))
    const vulnerability = 1.0 - (
      target.model?.defense[damage.name] ||
      target.model?.defense.default || 0)
    return (dps * vulnerability)
  }
  return 0
}

export function computeShieldDamage(tower: TDTower, target: TDEnemy, delta: number) {
  const damage = tower.model.damage
  if (damage.type === "shield") {
    const val = Array.isArray(damage.dps) ? randomRange(damage.dps) : damage.dps
    const dps = (val * delta / 1000 * (tower.scene?.time?.timeScale || 1))
    const vulnerability = 1.0 - (
      target.model?.defense[damage.name] ||
      target.model?.defense.default || 0)
    return (dps * vulnerability)
  }
  return 0
}
