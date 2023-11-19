import { randomRange } from "../../../../../util/Random"
import TDEnemy from "../../enemy/TDEnemy"
import TDTower from "../TDTower"

export function computeHealthDamage(tower: TDTower, target: TDEnemy, delta: number) {
  const damage = tower.model.damage
  if (damage.affect.type === "health") {
    const val = Array.isArray(damage.affect.dps) ? randomRange(damage.affect.dps) : damage.affect.dps
    const dps = (val * delta / 1000 * (tower.scene?.time?.timeScale || 1))
    const vulnerability = 1.0 - (
      target.model?.defense[damage.affect.name] ||
      target.model?.defense.default || 0)
    return (dps * vulnerability)
  }
  return 0
}

export function computeShieldDamage(tower: TDTower, target: TDEnemy, delta: number) {
  const damage = tower.model.damage
  if (damage.affect.type === "shield") {
    const val = Array.isArray(damage.affect.dps) ? randomRange(damage.affect.dps) : damage.affect.dps
    const dps = (val * delta / 1000 * (tower.scene?.time?.timeScale || 1))
    const vulnerability = 1.0 - (
      target.model?.defense[damage.affect.name] ||
      target.model?.defense.default || 0)
    return (dps * vulnerability)
  }
  return 0
}
