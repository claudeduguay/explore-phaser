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
const entityMap = new Map<ComponentID, EntityObject[]>()
function query(componentIDs: number[]) {
  const found: number[] = entityMap.get(componentIDs[0])
  for (let i = 1; i < componentIDs>; i++) {
    const next = new Set(entityMap.get(componentIDs[i]))  // Use a set to speed up the comparison
    results = results.filter(x => next.has(x))  // Keep only those entries that match the previous found entities
  }
  return results
}
```

The overhead to this approach is that we are creating new Sets from the remaining 
arrays, after the first, and the cost of filter-comparison across the result set.
A set compares by reference-matching and so is very fast and worth constructing. 
However, the filtered (found) list with continue to get smaller on every pass and
may be performant enough as a result.

ComponentID can be a property name used in the Phaser data system used to store
structured component data.

## Phaser DataManager

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
