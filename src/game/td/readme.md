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
* Develop an EFFECT System to add/remove a modifier with time exiry (or none)
* Add slow support using stopFollow and resumeFollow to slow and sleep

### Effect/Afliction Design Notes

An effect, to be most flexible, is like a modifier with a timeout to reversal.
The problem with reversal is that we have to compute the value on the fly to
success. A computed value has to account for a base and active value.
We can use the AcvtiveValue system and support self-registering modifiers
with a timeout.

Aflictions should be shown in the EnemyInfo view (with a timeout counter
also visible)

So: An AFFLICTION is a Modifier function that is applied to an Enemy (such as
Slow or Sleep, the latter of which times out) or affects a property like health
or resistance. After a timeout, it automatically unregisters itself from the 
property.

A Tween may allow an effect on a named propery.

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

  NEW - Grenade throw a projectile that explodes after a second or so.
* ADD - Impact: Spray effect with expanding wave/curve sprite
* ADD - Sleep: Put enemies in range to sleep for a given amount of time

Major categories:

* **Beam** weapons, like Lazer and Plasma
* **Throw** projectile weapons, like Bullet, Missile, Grenade (note that Bullet is not currently a guided projectile)
* **Cloud**, like Poison, Smoke, Freeze, Shock
* **Spray**, like Fire and Ice
* **Area**, buff/debuff like Boost, Slow, Cold, Wet, etc

Note that Boost towers affect other Towers and so does't operate on Enemy Targets.
This is the only major deviation from other Tower models.

### Tower Type Design Language
