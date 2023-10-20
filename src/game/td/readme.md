# Tower Defender

by Claude Duguay

## Notes

Each tower and enemy stats need to be refined.

Need to account for shields (disabled for now)

## ToDo Planning

* Need for consider whether we can embed a new scene inside DOM objects.
* Need to figure out leveling
* Effect System needs to handle InRange conditions
* Keep trying to get Tower previews to be in containers
* BUG: Plopping tower sometimes sticks and requires a second clik
* BUG: Canvas size measurment fails on iPad Safari
* BUG: Plopping tower doesn't aways unstick from mouse
* BUG: Peeps facing sometimes oscilates (seems more apparent when slowed)
* BUG: Levels page keeps updating grass backgrounds
* IMPROVEMENT: Towers need to ease into aim position, avoid jump turns, maybe return to zero in the same way afterward

### Effect/Afliction Design Notes

An effect, to be most flexible, is like a modifier with a timeout.

Tweens allow an effect to be applied on named properies

### Leveling Notes

There are two primary ways to upgrade:

* Tower upgrades
  * Increase level (up to max)
  * Increase range (up to some max)
  * Increase damage (dps per emitter)
  * Decrease cost of buying a tower
* Tower purchases
  * Buy new towers to ad to your inventory.
  * Each purchases tower is available in upgraded levels/range/dps.

# Towers to add:

* ADD - Grenade throw a projectile that explodes after a second or so.
* ADD - Sleep: Put enemies in range to sleep for a given amount of time.
* ADD - Saw - Blade rotating around the tower, perhaps growing/shrinking.

Major categories:

* **Beam** like Lazer, Plasma, Lightning
* **Throw** (projectile weapons) like Bullet, Missile, Grenade (not implemented yet)
* **Cloud**, (area emissions) like Poison, Smoke, Fire, Ice, Shock
* **Spray**, (spray emissions) like Flame and Freeze
* **Fall**, (vertical fall) like Rain and Snow
* **Area**, (buff/debuff) like Boost, Slow

Note that Boost towers affect other Towers and so does't operate on Enemy Targets.
This is the only major deviation from other Tower models.
