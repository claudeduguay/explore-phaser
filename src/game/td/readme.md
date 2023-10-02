# Tower Defender

by Claude Duguay

## Notes

Each tower and enemy stats need to be refined.

Need to account for shields (can disable for now)

Need to develop a design language for tower texture selection that accomodates
the various types of towers. This incudes coloring and base shapes. For example,
perhaps all AOE effect towers use round-ish bases, while spray towers use rounded
corners an beam towers use squared corners?  

## ToDo Planning

* Need for consider whether we can embed a new scene inside and DOM object.
* Need to figure out leveling
* Add speed controls

### Leveling Notes

There are two ways to upgrade:

* Tower upgrades
  * Increase level (up to max)
  * Increase range (up to some max)
  * Increase damage (dps per emitter)
  * Decrease cost of buying a tower
* Tower purchases
  * Buy new towers to ad to your inventory.
  * Each purchases tower is available in upgraded levels/range/dps.

# Towers to add:

* NEW = Sleep: Suspends an enemy's movement for a specified amount of time
Look into using stopFollow and resumeFollow to slow and sleep

* Plasma: Graphics/wave projector
* Freeze: Cloud effect made of ice
* Shock: Cloud effect made of electricity
* Smoke: Cloud effect made gray smoke
* Impact: Spray effect with expanding wave/curve sprite

Major categories:

* Beam weapons, like Lazer and Plasma
* Projectile, like Bullet and Missile (note that Bullet is not a guided projectile)
* Cloud, like Poison, Smoke, Freeze, Shock
* Spray, like Fire and Ice
* Effect, like Boost and Slow

Note that Boost towers affect other Towers and so don't operate on Enemy Targets.
This is the only major deviation from other Tower models.
