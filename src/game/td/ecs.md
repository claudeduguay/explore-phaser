# ECS

by Claude Duguay

An Entity Component System is made up of three parts that need to interact
effectively. As a rule, entities are usually represented as integers and
components as pure data elements.

Systems need to be able to quickly find entities with specific components
attached. This is a query system that needs to find the overlap across
all registered entities.

[BitECs](https://github.com/NateTheGreatt/bitECS) uses arrays of primitives
to store component properties, allowing only numerical values. The default
allocation appears to be 100k entries, which struck me as excessive, though
it may be controllable via paramter during creation.

That said, I am more interested in fast intersection lookups on true objects.
For example, instead of allocating an id and attaching components to those ids,
using convoluted array allocations, why not optimize the query system for Maps
of Sets which can be use to find the intersection of membership. To optimize
the query, we can start with the smallest set and apply it to subsequent
filtering.

Store a component ID with an array of associated EntityObject (GameObject) instances
we want to find all the EntityObjects that have all of the given component IDs.

```typescript
// Can't use filter on a set, converting to an array may be too expensive.
// Also array.filter creates a new array, so this is likely to be comparable.
function filterSet<T>(set: Set<T>, filter: (e: T) => boolean) {
  const matches = new Set<T>()
  set.forEach(item => {
    if (filter(item)) {
      matches.add(item)
    }
  })
  return matches
}

type EntityID = string | number
type ComponentID = string | number

const entityMap = new Map<ComponentID, Set<EntityID>>()

// Add a component to the specified entity
function addComponent(entityID: EntityID, componentID: ComponentID) {
  if (!entityMap.has(componentID)) {
    entityMap.set(componentID, new Set<EntityID>())
  }
  entityMap.get(componentID).add(entityID)
}

// Get all entities that have the specified components
function query(componentIDs: ComponentID[]): Set<EntityID> {
  let found: Set<EntityID> = entityMap.get(componentIDs[0])
  for (let i = 1; i < componentIDs>; i++) {
    const next = entityMap.get(componentIDs[i])
    // Keep only those entries that match the previously found entities
    found = filterSet(found, entity => next.has(entity)) 
    // Found should be ever smaller as the conjunction iterates
  }
  return found
}
```

The overhead to this approach is that we are creating new Set for each filter
operation, though the same would be try for an array filter a such an operation
is not in-place. We only need to filter after the first componentID. A set
compares by reference-matching and so is very fast when filtering. The filtered
(found) set with continue to get smaller on every pass and may be quit
performant like this.

## Phaser DataManager

ComponentID can be a name property used in the Phaser data system to store
structured component data.

The Phaser [DataManager](https://newdocs.phaser.io/docs/3.60.0/Phaser.Data.DataManager)
supports a ```set``` method to initialy register a data property and emits a "setdata"
event when the property changes.

We need to do a few experiments:

* Determine how the set/value.name= approaches differ
* Determine what events are emitted and how. Does one register 
to recieve all or specific property events?
* Determine how ```get``` destructuring (with a list of values) works with 
some properties not found.
* Determine how useful the query (regular expressions) might be.

Events emitted during ```set``` are: SET_DATA, CHANGE_DATA, CHANGE_DATA_KEY
The latter application is a bit unclear.

DataManager [Events](https://newdocs.phaser.io/docs/3.60.0/Phaser.Data.Events)
are documented in the referenced module.

## BitMapping Approach?

Consider using BigInt to map a single bit for every defined Component in order 
to find matches more efficiently? A system would then check for the presence of a
given collection of Components by matching the corresponding bits. Of course,
if we had to iterate through all entries, this would still be inefficient but 
the BitInt values could be placed in a suitable structure for fast lookup. That
said, the matching may still degrate to the same as a linear search and would
only be more efficient by virtue of the faster integer matching.

