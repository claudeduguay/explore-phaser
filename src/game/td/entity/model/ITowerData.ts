
export const TYPES_DELIVERY = ["Arrow", "Bullet", "Beam", "Spray", "Cloud", "Burst", "Vortex", "Fall", "Rise", "Pull", "Push", "Pulse", "Sweep", "Missile", "Mine", "Grenade"]
export const TYPES_DAMAGE = ["Kinetic", "Light", "Dark", "Force", "Plasma", "Fire", "Water", "Ice", "Earth", "Air", "Poison", "Electric", "Health", "Shield", "Speed", "Value"]

export type IDeliveryType = typeof TYPES_DELIVERY[number]
export type IDamageType = typeof TYPES_DAMAGE[number]

export interface IBaseColor {
  name: string,
  value: number
}

export interface IBaseSprite {
  key: string
  scale: number
}

export interface IDamageData {
  color: IBaseColor
  sprite: IBaseSprite
  description: string
}

export const DAMAGE_DATA: { [key: IDamageType]: IDamageData } = {
  Kinetic: {
    color: { name: "SLATEGRAY", value: 0x778899 },
    sprite: { key: "kinetic", scale: 0.075 },
    description: "Bullet damage (high target impact)"
  },
  Light: {
    color: { name: "YELLOW", value: 0xAAAA00 },
    sprite: { key: "light", scale: 0.05 },
    description: "Light damage (brightness, light, shining, radiant)"
  },
  Dark: {
    color: { name: "BLACK", value: 0x333333 },
    sprite: { key: "smoke", scale: 0.075 },
    description: "Dark damage (shadow, smoke)"
  },
  Force: {
    color: { name: "TEAL", value: 0x007777 },
    sprite: { key: "slash", scale: 0.075 },
    description: "Force damage has impact but limited visibility"
  },
  Plasma: {
    color: { name: "PURPLE", value: 0x770077 },
    sprite: { key: "spark", scale: 0.075 },
    description: "Plasma damage"
  },
  Fire: {
    color: { name: "RED", value: 0x880000 },
    sprite: { key: "fire", scale: 0.075 },
    description: "Fire damage (fire, flame)"
  },
  Water: {
    color: { name: "BLUE", value: 0x000099 },
    sprite: { key: "water", scale: 0.075 },
    description: "Water damage (liquid, steam, rain)"
  },
  Ice: {
    color: { name: "LIGHTBLUE", value: 0x6666CC },
    sprite: { key: "ice", scale: 0.075 },
    description: "Ice damage (snow, ice, freeze, frost)"
  },
  Earth: {
    color: { name: "SADDLEBROWN", value: 0x885511 },
    sprite: { key: "earth", scale: 0.05 },
    description: "Eath damage (rocks, dirt, sand)"
  },
  Air: {
    color: { name: "WHITE", value: 0x9999BB },
    sprite: { key: "stun", scale: 0.075 },
    description: "Air damage (wind, blow, breeze, storm)"
  },
  Poison: {
    color: { name: "GREEN", value: 0x008800 },
    sprite: { key: "smoke", scale: 0.075 },
    description: "Poison damage. Depletes enemy health over a specified time."
  },
  Electric: {
    color: { name: "CYAN", value: 0x009999 },
    sprite: { key: "spark", scale: 0.075 },
    description: "Electrical damage (lightning, shock, electrocute)"
  },
  Health: {
    color: { name: "LIGHT BLUE", value: 0x666699 },
    sprite: { key: "circle", scale: 0.05 },
    description: "Decrease target's Health property, while afffected"
  },
  Shield: {
    color: { name: "LIGHT ORANGE", value: 0xAA8844 },
    sprite: { key: "circle", scale: 0.05 },
    description: "Decrease target's Shield property, while afffected"
  },
  Speed: {
    color: { name: "LIGHT RED", value: 0x996666 },
    sprite: { key: "circle", scale: 0.05 },
    description: "Decrease target's Speed property, while afffected"
  },
  Value: {
    color: { name: "LIGHT GREEN", value: 0x669966 },
    sprite: { key: "circle", scale: 0.05 },
    description: "Increase target's Value property, while afffected"
  }
}

export interface IDeliveryData {
  sprite: IBaseSprite
  description: string
}

export const DELIVERY_DATA: { [key: IDeliveryType]: IDeliveryData } = {
  Arrow: {
    sprite: { key: "arrow", scale: 1 },
    description: "A, single-target, arrow, firing at intervals"
  },
  Bullet: {
    sprite: { key: "bullet", scale: 1 },
    description: "A, single-target,  bullet, firing at intervals"
  },
  Beam: {
    sprite: { key: "beam", scale: 0.07 },
    description: "A narrow, single-target continous beam of particles"
  },
  Spray: {
    sprite: { key: "spray", scale: 1 },
    description: "A cone, single-target, but affects other targets within the cone"
  },
  Cloud: {
    sprite: { key: "cloud", scale: 0.075 },
    description: "A multi-target cloud, covering the tower's range, effects last for a given time"
  },
  Burst: {
    sprite: { key: "burst", scale: 0.075 },
    description: "Outward burst of multiple particles, multi-target within the tower's range"
  },
  Vortex: {
    sprite: { key: "vortex", scale: 0.075 },
    description: "Inward spiral of particles, multi-target within the tower's range"
  },
  Fall: {
    sprite: { key: "rain", scale: 0.1 },
    description: "Multiple particles drop from above, multi-target within the tower's range"
  },
  Rise: {
    sprite: { key: "rain", scale: 0.1 },
    description: "Multiple particles rise from below, multi-target within the tower's range"
  },
  Pull: {
    sprite: { key: "rain", scale: 0.1 },
    description: "Multiple particles are pulled from the right, multi-target within the tower's range"
  },
  Push: {
    sprite: { key: "rain", scale: 0.1 },
    description: "Multiple particles ae pushed to the right, multi-target within the tower's range"
  },
  Pulse: {
    sprite: { key: "area", scale: 0.05 },
    description: "Invisible effect that affects multiple target within the tower's range"
  },
  Sweep: {
    sprite: { key: "area", scale: 0.05 },
    description: "Sweeping effect that affects multiple target within the tower's range"
  },
  Missile: {
    sprite: { key: "missile", scale: 1 },
    description: "A single-target missile that explodes on impact (causing range damage)"
  },
  Mine: {
    sprite: { key: "mine", scale: 1 },
    description: "Thrown to a headward path-target. Explodes (causing range damage) when the first enemy crosses its center"
  },
  Grenade: {
    sprite: { key: "grenade", scale: 1 },
    description: "Thrown to a headward path-target. Explodes (causing range damage) when the trigger time elapses"
  },
}

function generatePermutations() {
  // const effectTypes = ["In-Range", "Timed"]
  const permutations: any[] = []
  TYPES_DAMAGE.forEach((damage: IDamageType) => {
    TYPES_DELIVERY.forEach((delivery: IDeliveryType) => {
      permutations.push({
        type: `${damage} ${delivery}`,
        color: DAMAGE_DATA[damage].color.name,
        damage: DAMAGE_DATA[damage].description,
        delivery: DELIVERY_DATA[delivery].description
      })
    })
  })
  return permutations
}

export const PERMUTATIONS = generatePermutations()
// console.log(JSON.stringify(PERMUTATIONS, null, 2))
console.log("Damage Type count:", TYPES_DAMAGE.length)
console.log("Delivery type count:", TYPES_DELIVERY.length)
console.log("Permutation count:", PERMUTATIONS.length)

