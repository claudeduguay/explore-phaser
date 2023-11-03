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
* BUG: Peeps facing direction sometimes oscilates (seems more apparent when slowed)
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
  * Decrease cost of buying a tower
  * Increase Health damage (dps per emitter)
  * Increase Shield damage (dps per emitter)
* Tower purchases
  * Buy new towers to add to your inventory.
  * Each purchases tower is available in upgraded levels/range/dps.

## Towers to add:

* ADD - Saw - Blade rotating around the tower, perhaps growing/shrinking.
* ADD - Grenade throw a projectile that explodes after a second or so.
* DONE - Stun: Put enemies in range to sleep for a short amount of time.

## Major categories:

* **Eject** (projectile weapons) like Bullet, Missile, Grenade (not implemented yet)
* **Beam** like Lazer, Plasma, Lightning
* **Spray**, (spray emissions) like Flame and Freeze
* **Cloud**, (area emissions) like Poison, Smoke, Fire, Ice, Shock
* **Vertical**, (vertical fall) like Rain and Snow
* **Expand**, (outward projection) like Spike, Rock
* **Area**, (buff/debuff) like Boost, Slow

Note that Boost towers affect other Towers and so does't operate on Enemy Targets.
This is the only major deviation from other Tower models.

## Major Dimension Notes

* **Damage Types** - Lazer, Plasma, Electricity, Fire, Ice, Force/Impact, 
Poison, Smoke, Water (rain, snow), Stun, or Special (ie: slow, stun, boost)
* **Effect Strategy** - In-Range or Timed
* **Local vs Remote** - Most are Local, thrown (Grenade, Missile) are applied to Remote objects
* **Category Types** - Eject (guns), Beam, Spray, Cloud, Vertical, Expand, Area
* **Single or Multi-target** - ie: Lazer (single target) vs. Cloud (multi-target)

### Thoughts

* We can generate permutations for some of these, such as Cloud and Spray sharing a list of damage types (maybe?).
* Remote could have the same effects as cloud in a thrown object that lands near enemies, such as a grenade.
* Eject could fire different bullets with assigned damage types.
* Expand and Cloud are very similar, though Eject expands outward and is In-Range while Cloud is AOE with duration.
* Vertical could have any effect in a Cloud but that would probably just be redundant?
* Beams could have different types, such as a fire or ice beam.
* Genades (or maybe Mines, ie: Launchables) could be thrown ahead with a longer tower range, 
always landing on the path, but their triggers could be something like two targets within a 
smaller effect range
