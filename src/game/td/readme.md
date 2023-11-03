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

We could move toward a build your own tower model?

## Research

THOUGHT: One idea is to have Peeps explode with certain towers, causing damage to nearby Peeps.

[Tower Defense Games on Steam](https://store.steampowered.com/tags/en/Tower%20Defense/)

* Element TD 2 has elemental towers that appear to be: Light, Dark, Water, Fire, Poison (Nature), Earth
* Element TD 2 players always have access to Cannon and Arrow towers

![](https://steamuserimages-a.akamaihd.net/ugc/1769319314579851397/6F947B57422599B93A61E1C5A755ACB9A772ED94/)

Tower element combinations appear to be supported:

![](https://steamuserimages-a.akamaihd.net/ugc/1756987628140457546/399856D4AE1B5D2427D61DCD7E191D0DE82B76E7/)

For this, for example, it appears that:

* A combination of water and light becomes ice.
* A combination of nature and light becomes bloom.
* A combination of water and nature becomes well.
* A combination of light, fire and nature becomes nova.
* A combination of water, fire and nature becomes windstorm.

[Some tower ideas on Discussion](https://steamcommunity.com/app/1018830/discussions/0/2992043384035715092/)
These Include:

* Teleport Tower
* Gavitation Tower
* Volcano Tower
* Focus Tower - Buffs for 60 seconds (max 4 towers)

[More Tower Suggestions](https://steamcommunity.com/app/1018830/discussions/1/1750150188482518613/)

* Berzerk - Gains more damage and/or attack speed for each enemy in range.
* Goop - Deals more damage the slower the target is.
* Sunray - Fires a constant beam at the target.
* Range Buff - Buffs the range of a tower, either by a flat amount or by %.
* Spike Aura - Applies an aura to the creep. Target itself takes no damage, but it damages all creeps around it.
* Phase Out - Temporarily phases a creep out, holding them in place, but turning them invulnerable. When it emerges, it takes massive damage.
* Rage - ncreases the movement speed of a creep, causing it to ignore slows. However, drastically amplifies the damage it takes during this time.
* Blaze It - Sets the creep on fire, increasing its movement speed and causing it to ignore slows. Also deals damage based on how fast it's going.
* Stacker - Single-target and shoots really slow. However, for each other Stacker nearby, it gains a damage bonus.
* Isolation - Deals great damage, but it loses damage for each other tower in its range, regardless of what kind of tower it is.
* Reflector - Doesn't shoot directly at creeps. Instead, it fires a laser at other Prism Towers, including clones of it. Laser hits everything in its path.
* Railgun - Hits all creeps within its range with low damage to build charge. Once charged up, it fires a high-powered shot with global range.
* Translocate - Has an active ability that lets it change locations, dealing damage to all creeps in the way. Has a 60 second cooldown.
* Supercharge - Stores damage when not attacking, up to 500%. When it starts attacking, it gains this damage bonus for 3 seconds.
* Dispersion - Hits all creeps in range, but it splits damage equally among them.
* Contrast - Shoots two creeps at once, always hitting the closest creep and the farthest creep. Can't change targeting options.
* Shared Range - Short-ranged tower, can shoot creeps both within its own range and the range of all other Shared Ranged towers.
* Healing Pulse - Deals a ton of upfront damage, but slowly heals the creep over time afterwards. If you're not able to kill the creeps fast, this tower will kinda negate itself.
* Prism - All Prism Towers fire at the same attack rate, meaning no matter how many you have, they all fire at the same time, only giving you one attack. They can all shoot within range of each other. Whenever one attacks a creep, all other Prism Towers you have charge up and fire lasers at each other, creating a power grid to charge your primary target.
* Magnetize - Whatever creep it shoots will pull in other creeps around it. Creeps in front of it will be slowed down, and creeps behind it will be sped up.
* Vacuum - Any creeps coming towards it are sped up. Any creeps going away from it are slowed down.
* Equalize - Hits two creeps, first equalizing their HP %'s, and then dealing major damage to both of them.
* Shockwave - Constantly damages everything around it in a DoT.

There are additional ideas in the comments of this thread. Ie:

* Voodoo - When it kills a creep it's active debuffs are spread to nearby creeps.
* Defroster - Does extra damage on a slowed enemy, but removes a random slow debuff on every hit.
* Penetration - Does extra damage on a slowed enemy (obviously the damage boost is not as high as for the the defroster with the debuff removal)
* Stunnnable Death - When it kills a creep nearby creeps of the victim are stunned for a short duration.
* Greed - A support tower, that improves the supported towers income on kill.
* Concentrated - Applies a debuff, that increases the direct damage received by an creep, but it reduces/remove area damage received.
* Unconcentrated - Applies a debuff, that increases area damage received by an creep, but its reduces/removes direct damage received.
* All or Nothing - Applies a debuff on a creep which highly increases (maybe double?) the incoming damage. However, after the debuff ends and it wasn't killed the creep is fully healed.
* Splitter - The enemy is splitted into two, which each having xx% of the originals life. Can be split again.
* You didn't see that coming - On kill of an enemy a soul is spawned at the end of that enemies path and walks it backwards. It damages the first alive enemy on the way and vanishes after,

* Shield breaker - Does not do much damage, but destroys shields (add absorb damage to shields so it balances it out)
* Stone Wall - Slow down tower that makes a wall in front of creep for a very short period. This would be like cannon / arrow tower to help out first phase.
* Acid Tower - AoE tower with dot damage (would be cool if you could apply manually the tower to shoot at certain location all the time)
* Mine/Explosive - Shoots mines that explode after a duration like 2 seconds and causes very big damage, but there is still possible for mobs to avoid it due to the explode duration
* Swarm - Continuously do damage on targets that are nearby them
* Nom nom - A tower that eats the mobs and gains "experience/levels" (becomes fatter) doing more damage and more damage depending on their experience / level, sort of like Life towers work but instead gets damage increase
* Radar - Shows hidden enemies
* Anti-air - Attack flying mobs.

[Good thread from Element TD original game](https://steamcommunity.com/sharedfiles/filedetails/?id=2549502098)

![](https://steamuserimages-a.akamaihd.net/ugc/1697278243791189561/9DBAE3F83051D3A7866F6A246A1F187031E19F22/)

Breaks down:

* Range - Short, Mid, Long, Huge
* Multi-Target - Solo, Splatter, Jump, Circle, Area
* Support Abilities - Clone, Speed Buff, Damage Buff
* Non-support Abilities - Stat (up/down), Incrementing effect, Debuf Peep, Straight Line Attack (such as Lazer), Projectile travel Distance, Peep Grouping Advantage, Random Temporary Stat
* Unique Effects - Suggests looking at details in-game

![Nice Single Element Tower Guide](https://steamuserimages-a.akamaihd.net/ugc/1475443990436550771/7A3EAA034D64356880F291138E963B12424E73C3/)

![Nice Dual Element Tower Guide](https://steamuserimages-a.akamaihd.net/ugc/1475443990436551251/EAA256B38CFEBDEAACF71A55071F259CD02CF810/)

![Nice Tripple Element Tower Guide](https://steamuserimages-a.akamaihd.net/ugc/1475443990436551764/E1E821C51BD44F124F09879985B22B70013F1D10/)
