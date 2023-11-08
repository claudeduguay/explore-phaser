import { IDamageType, IDeliveryType, TYPES_DAMAGE, TYPES_DELIVERY } from "./ITowerModel"

export interface IBaseColor {
  name: string,
  value: number
}

export interface IDamageData {
  color: IBaseColor
  description?: string
}

export const DAMAGE_DATA: { [key: IDamageType]: IDamageData } = {
  Arrow: {
    color: { name: "TAN", value: 0xBB9966 },
    description: "Arrow damage (low target impact)"
  },
  Bullet: {
    color: { name: "SLATEGRAY", value: 0x778899 },
    description: "Bullet damage (high target impact)"
  },
  Light: {
    color: { name: "YELLOW", value: 0xAAAA00 },
    description: "Light damage (brightness, light, shining, radiant)"
  },
  Dark: {
    color: { name: "BLACK", value: 0x333333 },
    description: "Dark damage (shadow, smoke)"
  },
  Force: {
    color: { name: "TEAL", value: 0x007777 },
    description: "Force damage has impact but limited visibility"
  },
  Plasma: {
    color: { name: "PURPLE", value: 0x770077 },
    description: "Plasma damage"
  },
  Fire: {
    color: { name: "RED", value: 0x880000 },
    description: "Fire damage (fire, flame)"
  },
  Water: {
    color: { name: "BLUE", value: 0x000099 },
    description: "Water damage (liquid, steam, rain)"
  },
  Ice: {
    color: { name: "LIGHTBLUE", value: 0x6666CC },
    description: "Ice damage (snow, ice, freeze, frost)"
  },
  Earth: {
    color: { name: "SADDLEBROWN", value: 0x885511 },
    description: "Eath damage (rocks, dirt, sand)"
  },
  Air: {
    color: { name: "WHITE", value: 0x9999BB },
    description: "Air damage (wind, blow, breeze, storm)"
  },
  Poison: {
    color: { name: "GREEN", value: 0x008800 },
    description: "Poison damage. Depletes enemy health over a specified time."
  },
  Electric: {
    color: { name: "CYAN", value: 0x009999 },
    description: "Electrical damage (lightning, shock, electrocute)"
  },
  Health: {
    color: { name: "LIGHT BLUE", value: 0x666699 },
    description: "Decrease target's Health property, while afffected"
  },
  Shield: {
    color: { name: "LIGHT ORANGE", value: 0xAA8844 },
    description: "Decrease target's Shield property, while afffected"
  },
  Speed: {
    color: { name: "LIGHT RED", value: 0x996666 },
    description: "Decrease target's Speed property, while afffected"
  },
  Value: {
    color: { name: "LIGHT GREEN", value: 0x669966 },
    description: "Increase target's Value property, while afffected"
  }
}

export const DELIVERY_DATA: { [key: IDeliveryType]: string } = {
  Projectile: "A narrow, single-target, emission of particles, firing at a spaced out interval",
  Beam: "A narrow, single-target continous beam of particles",
  Spray: "A cone, single-target, but affects other targets within the cone",
  Cloud: "A multi-target cloud, covering the tower's range, effects last for a given time",
  Burst: "Outward burst of multiple particles, multi-target within the tower's range",
  Vertical: "Drop or rise of multiple particles, multi-target within the tower's range",
  Area: "Invisible effect that affects multiple target within the tower's range",
  Missile: "A single-target missile that explodes on impact (causing range damage)",
  Mine: "Thrown to a headward path-target. Explodes (causing range damage) when the first enemy crosses its center",
  Grenade: "Thrown to a headward path-target. Explodes (causing range damage) when the trigger time elapses",
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
        delivery: DELIVERY_DATA[delivery]
      })
    })
  })
  return permutations
}

export const PERMUTATIONS = generatePermutations()
console.log(JSON.stringify(PERMUTATIONS, null, 2))
console.log("Permutation count:", PERMUTATIONS.length)