# Tower Defender

by Claude Duguay

## Notes

Each tower and enemy stats need to be refined.

Need to account for shields (can disable for now)

Need to develop a design language for tower texture selection that accomodates
the various types of towers. This incudes coloring and base shapes. For example,
perhaps all AOE effect towers use round-ish bases, while spray towers use rounded
corners an beam towers use squared corners?  

### Path Timeline Notes

Path timing needs to be figured out.

* The preview needs to start earlier by some configurable percentage

Make preview edges specified by a given percentage.

```typescript
const mainPathLength = mainPath.getLength()
const previewPathLength = previewPath.getLength()
const mainSpeed = 100 (pixels per second)
const mainDuration = mainPathLength * mainSpeed * 1000 // One Second
const previewPrefixLength = previewPathLength * 0.20 // Preview percent
const previewSuffixLength = previewPathLength * 0.20 // Preview percent
const previewVisibleLength = previewPathLength - (previewPrefixLength + previewSuffixLength)
```

## ToDo Planning

---
Need to develop preview boxes:

* Recangular for Beam, Spray effects (tower, with effect toward the right)
* Square for AOE cloud or radiating AOE effects

Need for consider whether we can embed a new scene inside and DOM object.
---

# Towers to add:

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
