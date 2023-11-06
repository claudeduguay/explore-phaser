import { Display, GameObjects, Scene } from "phaser";
import { IDeliveryType, TYPES_DAMAGE, TYPES_DELIVERY, damageColors } from "../model/ITowerModel";
import Button from "../../gui/Button";
import { VBoxLayout } from "../../gui/layout/ILayout";
import Point from "../../../../util/geom/Point";
import { Label } from "../../gui/Label";
import ObservableValue from "../../value/ObservableValue";
import ValueMonitor from "../../gui/game/ValueMonitor";
import { ITextureConfig, makePlatform, makeTurret, makeWeapon } from "../../assets/TextureFactory";
import { IPlatformOptions, corners } from "../../assets/PlatformFactory";
import { ITurretOptions } from "../../assets/TurretFactory";
import { IWeaponOptions } from "../../assets/WeaponFactory";
import { funnelInsideWeapon, funnelWeapon, pointInsideWeapon, pointWeapon, rectInsideWeapon, rectWeapon, roundBackTurret, roundFrontTurret, roundTurret, smallTurret } from "../../assets/TowerTextures";

export function rgbStringToColors(rgba: number) {
  const color = Display.Color.IntegerToColor(rgba)
  return [
    color.clone().brighten(30).rgba,
    color.rgba,
    color.clone().darken(10).rgba
  ]
}

export const PLATFORM_OPTIONS: Record<IDeliveryType, Partial<IPlatformOptions>> = {
  Projectile: { type: "ntagon", corners: corners("angle") },
  Beam: { type: "box", corners: corners("curve-i") },
  Spray: { type: "box", corners: corners("angle") },
  Cloud: { type: "box", corners: corners("curve-o") },
  Burst: { type: "ntagon", corners: corners("angle") },
  Area: { type: "box", corners: corners("box-o") },
  Missile: { type: "box", corners: corners("curve-i") },
  Mine: { type: "box", corners: corners("curve-i") },
  Grenade: { type: "box", corners: corners("curve-i") },
}

export const TURRET_CONFIG: Record<IDeliveryType, ITextureConfig<ITurretOptions>> = {
  Projectile: roundBackTurret([]),
  Beam: smallTurret([]),
  Spray: roundFrontTurret([]),
  Cloud: roundTurret([]),
  Burst: roundTurret([]),
  Area: roundTurret([]),
  Missile: smallTurret([]),
  Mine: smallTurret([]),
  Grenade: smallTurret([]),
}

export const WEAPON_CONFIG: Record<IDeliveryType, ITextureConfig<IWeaponOptions>> = {
  Projectile: rectWeapon([]),
  Beam: pointWeapon([]),
  Spray: funnelWeapon([]),
  Cloud: pointInsideWeapon([]),
  Burst: rectInsideWeapon([], false),
  Area: funnelInsideWeapon([], false),
  Missile: rectWeapon([], false, true),
  Mine: funnelWeapon([]),
  Grenade: pointWeapon([], false),
}


// Note: May need to make this a scene to manage the fact that 
// behaviors add elements relative to the tower position in the scene
export default class StylePreview extends Scene {

  platformSprite!: GameObjects.Sprite
  turretSprite!: GameObjects.Sprite
  weaponSprite!: GameObjects.Sprite
  towerContainer!: GameObjects.Container

  constructor(public main: Scene, public x: number = 0, public y: number = x) {
    super("style_preview")
  }

  create() {
    const vBox = 175
    const hBox = 170
    const g = this.add.graphics()
    g.fillStyle(0x111111, 1.0)
    g.lineStyle(2, 0xFFFFFF, 1.0)
    g.fillRoundedRect(this.x, this.y, hBox * 6, vBox * 4 + 20)
    g.strokeRoundedRect(this.x, this.y, hBox * 6, vBox * 4 + 20)
    this.add.existing(g)

    const damageChoice = new ObservableValue<string>("Arrow")
    const damageMonitor = new ValueMonitor(this, hBox * 3 - 70, 60, 0xe1eb, "#FF0000", damageChoice)
    this.add.existing(damageMonitor)

    const damage = this.add.container(75, 70)
    damage.add(new Label(this, 0, 0, "Damage"))
    TYPES_DAMAGE.forEach((type: string) => {
      const button = new Button(this, 0, 0, 75, 25, type, "flat")
      button.onClick = () => damageChoice.value = type
      damage.add(button)
    })
    const damageLayout = new VBoxLayout(new Point(5, 5))
    damageLayout.apply(damage)

    const deliveryChoice = new ObservableValue<string>("Projectile")
    const deliveryMonitor = new ValueMonitor(this, hBox * 3 + 70, 60, 0xe558, "#009900", deliveryChoice)
    this.add.existing(deliveryMonitor)

    const delivery = this.add.container(hBox * 6 - 75, 70)
    delivery.add(new Label(this, 0, 0, "Delivery"))
    TYPES_DELIVERY.forEach((type: string) => {
      const button = new Button(this, 0, 0, 75, 25, type, "flat")
      button.onClick = () => deliveryChoice.value = type
      delivery.add(button)
    })
    const deliveryLayout = new VBoxLayout(new Point(5, 5))
    deliveryLayout.apply(delivery)

    const createLabeledSprite = (x: number, y: number, key: string, label: string) => {
      const sprite = this.add.sprite(x, y, key)
      sprite.scale = 2.5
      this.add.label(x, y + 100, label).setOrigin(0.5, 0.5)
      return sprite
    }

    const createPlatform = () => {
      const platformKey = `${damageChoice.value}-${deliveryChoice.value}-platform`.toLowerCase()
      const baseColor = damageColors[damageChoice.value].color
      const color = rgbStringToColors(baseColor)
      const platformConfig: ITextureConfig<Partial<IPlatformOptions>> = {
        size: { x: 64, y: 64 },
        options: { ...PLATFORM_OPTIONS[deliveryChoice.value], color }
      }

      if (!this.textures.exists(platformKey)) {
        makePlatform(this, platformKey, platformConfig)
      }

      if (this.platformSprite) {
        this.platformSprite.setTexture(platformKey)
      } else {
        this.platformSprite = createLabeledSprite(330, 210, platformKey, "Platform")
      }
    }

    const createTurret = () => {
      const turretKey = `${damageChoice.value}-${deliveryChoice.value}-turret`.toLowerCase()
      const baseColor = damageColors[damageChoice.value].color
      const turretConfig: ITextureConfig<Partial<ITurretOptions>> = {
        ...TURRET_CONFIG[deliveryChoice.value]
      }
      turretConfig.options.color = rgbStringToColors(baseColor)

      if (!this.textures.exists(turretKey)) {
        makeTurret(this, turretKey, turretConfig)
      }

      if (this.turretSprite) {
        this.turretSprite.setTexture(turretKey)
      } else {
        this.turretSprite = createLabeledSprite(550, 210, turretKey, "Turret")
      }
    }

    const createWeapon = () => {
      const weaponKey = `${damageChoice.value}-${deliveryChoice.value}-weapon`.toLowerCase()
      const baseColor = damageColors[damageChoice.value].color
      const weaponConfig: ITextureConfig<Partial<IWeaponOptions>> = {
        ...WEAPON_CONFIG[deliveryChoice.value]
      }
      weaponConfig.options.color = rgbStringToColors(baseColor)

      if (!this.textures.exists(weaponKey)) {
        makeWeapon(this, weaponKey, weaponConfig)
      }

      if (this.weaponSprite) {
        this.weaponSprite.setTexture(weaponKey)
      } else {
        this.weaponSprite = createLabeledSprite(730, 210, weaponKey, "Weapon")
      }
    }

    const createTower = () => {
      const prefix = `${damageChoice.value}-${deliveryChoice.value}`.toLowerCase()
      const platformKey = `${prefix}-platform`
      const turretKey = `${prefix}-turret`
      const weaponKey = `${prefix}-weapon`
      if (this.towerContainer) {
        this.towerContainer.destroy()
      }
      const isRadial =
        TURRET_CONFIG[deliveryChoice.value].options.topSeg === 10 &&
        TURRET_CONFIG[deliveryChoice.value].options.botSeg === 10
      this.towerContainer = this.add.container(550, 530)
      this.towerContainer.add(this.add.sprite(0, 0, platformKey))
      this.towerContainer.add(this.add.sprite(0, 0, turretKey))
      const weapon = this.add.sprite(0, isRadial ? 0 : -6 * 4, weaponKey).setOrigin(0.5, 0)
      this.towerContainer.add(weapon)
      this.towerContainer.scale = 4
    }

    const generate = () => {
      createPlatform()
      createTurret()
      createWeapon()
      createTower()
    }

    damageChoice.addListener("changed", generate)
    deliveryChoice.addListener("changed", generate)

    generate()

    // TOWER_LIST.forEach((model, i) => {
    //   const row = Math.floor(i / 6)
    //   const col = i % 6
    //   const x = this.x + hBox / 2 + hBox * col
    //   const y = this.y + 110 + vBox * row
    //   const tower = new TDTower(this, x, y, model)
    //   tower.preview = PreviewType.Preview
    //   tower.showLabel.visible = true
    //   this.add.existing(tower)
    //   // addLabel(this, x, y + 40, model.name.split(" ")[0], "center")
    //   tower.targeting.current = [new TDEnemy(this, x, y - 100, ENEMY_LIST[0])]
    // })
  }

}
