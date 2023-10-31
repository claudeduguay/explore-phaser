# Tower Defender

by Claude Duguay

## Notes

Each tower and enemy stats need to be refined.

Need to account for shields (disabled for now)

## ToDo Planning

* Need to figure out leveling
* Keep trying to get Tower previews to be in containers
* BUG: Plopping tower sometimes sticks and requires a second click (long click seems to fix this, timing issue)
* BUG: Main Peeps initially show at 0,0, causing artifacts
* BUG: Canvas size measurment fails on iPad Safari
* BUG: Peeps facing direction sometimes oscilates (seems more apparent when slowed)
* BUG: If Selectors are associated with the hud scene, plops don't work correctly.
* BUG: Starting a tower drag with a peep underneath loses connection and stays in-place.
* IMPROVEMENT: Towers need to ease into aim position, avoid jump turns, maybe return to zero in the same way afterward
* IMPROVEMENT: Need to separate map level generation from createMap function, at minimum separate into discrete steps
* FIX: Level preview alignment in Levels scene.

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

* **Eject** (projectile weapons) like Bullet, Missile, Grenade (not implemented yet)
* **Beam** like Lazer, Plasma, Lightning
* **Spray**, (spray emissions) like Flame and Freeze
* **Cloud**, (area emissions) like Poison, Smoke, Fire, Ice, Shock
* **Vertical**, (vertical fall) like Rain and Snow
* **Expand**, (outward projection) like Spike, Rock
* **Area**, (buff/debuff) like Boost, Slow

Note that Boost towers affect other Towers and so does't operate on Enemy Targets.
This is the only major deviation from other Tower models.
