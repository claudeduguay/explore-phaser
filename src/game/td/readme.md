# Tower Defender

by Claude Duguay

## Notes

Each tower and enemy stats need to be refined.

Path timing needs to be figured out.

Damage Formula: <:Enemy Health:> -= <:Tower Damage:> * (1.0 - <:Enemy Resistance Factor:>)
<!-- Shield Formula: <:Sheild Health:> -= <:Tower Damage:> * (1.0 - <:Enemy Resistance Factor:>) -->

Need to account for shields (can disable for now)

## ToDo Planning

Add basic damage to lower enemy health when attacked.

---
Need to develop preview boxes:

* Recangular for Beam, Spray effects (tower, with effect toward the right)
* Square for AOE cloud or radiating AOE effects

Need for consider whether we can embed a new scene inside and DOM object.
---

# Towers to add:

* Plasma: Graphics/wave projector
* Freeze: Cloud effect made of ice
* Impact: Spray effect with expanding wave/curve sprite

Major categories:

* Beam weapons, like Lazer and Plasma
* Projectile, like Bullet and Missile
* Cloud, like Poison and Freeze
* Spray, like Fire and Ice
* Effect, like Boost and Slow

Note that Boost towers affect other Towers and so don't operate on Enemy Targets.
This is the only major deviation from other Tower models.
