import ITowerModel from "../model/ITowerModel";

export const LAZER_TOWER: ITowerModel = {
  name: "Lazer Tower",
  meta: {
    key: "lazer-tower",
    base: "",
    turret: "",
    gun: "",
  },
  stats: {
    range: 150,
    emitters: 3
  },
  damage: {
    lazer: 100,
    bullet: 0,
    missile: 0,
    fire: 0,
    lightning: 0,
    poison: 0,
  }
}
