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
* BUG: Adding some towers (clouds, for example) do not automatically enable damage (visual) effects
* BUG: If Selectors are associated with the hud scene, plops don't work correctly.
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
