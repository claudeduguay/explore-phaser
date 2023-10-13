# Tower Defender

by Claude Duguay

## Notes

Each tower and enemy stats need to be refined.
Added optional duration to ITowerDamage specs, need to connect
Consider redefining Behaviors to receive main object in their constuctor

Need to account for shields (disabled for now)

## ToDo Planning

* Need for consider whether we can embed a new scene inside and DOM object.
* Need to figure out leveling
* Effect System needs to handle all InRange conditions
* Keep trying to get Tower previews to be in containers
* BUG: Cloud towers don't aways emmit if dropped by mouse
* BUG: Fails on iPad Safari, related to sound files not loading
* BUG: Peeps sometimes stop completely (related to Slow effect)

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

* NEW - Grenade throw a projectile that explodes after a second or so.
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
