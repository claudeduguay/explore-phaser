import { GameObjects, Scene } from "phaser";
import { ITowerOrganize, platformKey, turretKey, weaponKey } from "../model/ITowerModel";
import { IDamageType, IDeliveryType, TYPES_DAMAGE, TYPES_DELIVERY } from "../model/ITowerData"
import Button from "../../gui/Button";
import { VBoxLayout } from "../../gui/layout/ILayout";
import Point from "../../../../util/geom/Point";
import { Label } from "../../gui/Label";
import ObservableValue from "../../value/ObservableValue";
import ValueMonitor from "../../gui/game/ValueMonitor";
import { ITextureConfig, makePlatform, makeTurret, makeWeapon } from "../../assets/TextureFactory";
import { IPlatformOptions } from "../../assets/PlatformFactory";
import { ITurretOptions } from "../../assets/TurretFactory";
import { IWeaponOptions } from "../../assets/WeaponFactory";
import { PLATFORM_CONFIG, TURRET_CONFIG, WEAPON_CONFIG, rgbStringToColors } from "../../assets/TowerTextures";
import { DAMAGE_DATA, DELIVERY_DATA } from "../model/ITowerData";

const iconMap: Record<string, { key: string, scale?: number }> = {
  // Damage
  "kinetic-default": { key: "kinetic", scale: 0.075 },
  "light-default": { key: "light", scale: 0.05 },
  "dark-default": { key: "smoke", scale: 0.075 },
  "force-default": { key: "slash", scale: 0.075 },
  "plasma-default": { key: "spark", scale: 0.075 },
  "fire-default": { key: "fire", scale: 0.075 },
  "water-default": { key: "water", scale: 0.075 },
  "ice-default": { key: "ice", scale: 0.075 },
  "earth-default": { key: "earth", scale: 0.05 },
  "air-default": { key: "stun", scale: 0.075 },
  "poison-default": { key: "smoke", scale: 0.075 },
  "electric-default": { key: "spark", scale: 0.075 },
  "health-default": { key: "heart", scale: 1 },
  "shield-default": { key: "circle", scale: 0.05 },
  "speed-default": { key: "circle", scale: 0.05 },
  "value-default": { key: "circle", scale: 0.05 },
  // Delivery
  "beam-default": { key: "beam", scale: 0.075 },
  // "spray-default": { key: "circle", scale: 0.05 },
  "cloud-default": { key: "cloud", scale: 0.075 },
  "burst-default": { key: "burst", scale: 0.075 },
  "vertical-default": { key: "rain", scale: 0.1 },
  "area-default": { key: "area", scale: 0.05 },
}

// Note: May need to make this a scene to manage the fact that 
// behaviors add elements relative to the tower position in the scene
export default class StylePreview extends Scene {

  platformSprite!: GameObjects.Sprite
  turretSprite!: GameObjects.Sprite
  weaponSprite!: GameObjects.Sprite
  towerContainer!: GameObjects.Container
  damageText!: GameObjects.Text
  deliveryText!: GameObjects.Text
  organize!: ITowerOrganize;
  projectiles!: GameObjects.Sprite[]

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

    // this.add.rectangle(hBox * 2 - 70, 85, 32, 32, 0xFFFFFF, 1.0)
    // const rect = new GameObjects.Rectangle(this, hBox * 2 - 70, 85, 32, 32, 0xFFFFFF, 1.0)
    // this.add.existing(rect)
    console.log("Has texture:", this.textures.exists("heart"))
    this.add.sprite(hBox * 2 - 70, 85, "heart")

    const damageChoice = new ObservableValue<string>("Kinetic")
    const damageMonitor = new ValueMonitor(this, hBox * 3 - 70, 60, 0xe1eb, "#FF0000", damageChoice)
    this.add.existing(damageMonitor)

    const damage = this.add.container(75, 70)
    damage.add(new Label(this, 0, 0, "Damage"))
    TYPES_DAMAGE.forEach((type: IDamageType) => {
      const item = this.add.container()
      item.setSize(100, 25)
      const button = new Button(this, -10, 0, 75, 25, type, "flat")
      button.onClick = () => damageChoice.value = type
      item.add(button)
      let spriteKey = `${type.toLowerCase()}-default`
      let scale = 1
      if (iconMap[spriteKey]) {
        scale = iconMap[spriteKey].scale || 1
        spriteKey = iconMap[spriteKey].key
      }
      if (this.textures.exists(spriteKey)) {
        const sprite = this.add.sprite(50, 0, spriteKey)
        sprite.setScale(scale)
        item.add(sprite)
      }
      damage.add(item)
    })
    const damageLayout = new VBoxLayout(new Point(5, 5))
    damageLayout.apply(damage)

    const deliveryChoice = new ObservableValue<string>("Arrow")
    const deliveryMonitor = new ValueMonitor(this, hBox * 3 + 70, 60, 0xe558, "#009900", deliveryChoice)
    this.add.existing(deliveryMonitor)

    const delivery = this.add.container(hBox * 6 - 75, 70)
    delivery.add(new Label(this, 0, 0, "Delivery"))
    TYPES_DELIVERY.forEach((type: IDeliveryType) => {
      const item = this.add.container()
      item.setSize(100, 25)
      let spriteKey = `${type.toLowerCase()}-default`
      let scale = 1
      if (iconMap[spriteKey]) {
        scale = iconMap[spriteKey].scale || 1
        spriteKey = iconMap[spriteKey].key
      }
      if (this.textures.exists(spriteKey)) {
        const sprite = this.add.sprite(-70, 0, spriteKey)
        sprite.setScale(scale)
        item.add(sprite)
      }
      const button = new Button(this, -10, 0, 75, 25, type, "flat")
      button.onClick = () => deliveryChoice.value = type
      item.add(button)
      delivery.add(item)
    })
    const deliveryLayout = new VBoxLayout(new Point(5, 5))
    deliveryLayout.apply(delivery)

    const createLabeledSprite = (x: number, y: number, key: string, label: string) => {
      const sprite = this.add.sprite(x, y, key)
      sprite.scale = 2.5
      this.add.label(x, y + 100, label).setOrigin(0.5, 0.5)
      return sprite
    }

    const top = 210
    const left = 365

    const createPlatform = () => {
      const key = platformKey(this.organize)

      if (!this.textures.exists(key)) {
        const platformConfig: ITextureConfig<Partial<IPlatformOptions>> = {
          ...PLATFORM_CONFIG[deliveryChoice.value]
        }
        const baseColor = DAMAGE_DATA[damageChoice.value].color.value
        platformConfig.options.color = rgbStringToColors(baseColor)
        makePlatform(this, key, platformConfig)
      }

      if (this.platformSprite) {
        this.platformSprite.setTexture(key)
      } else {
        this.platformSprite = createLabeledSprite(left, top, key, "Platform")
      }
    }

    const createTurret = () => {
      const key = turretKey(this.organize)

      if (!this.textures.exists(key)) {
        const baseColor = DAMAGE_DATA[damageChoice.value].color.value
        const turretConfig: ITextureConfig<Partial<ITurretOptions>> = {
          ...TURRET_CONFIG[deliveryChoice.value]
        }
        turretConfig.options.color = rgbStringToColors(baseColor)
        makeTurret(this, key, turretConfig)
      }

      if (this.turretSprite) {
        this.turretSprite.setTexture(key)
      } else {
        this.turretSprite = createLabeledSprite(left + 240, top, key, "Turret")
      }
    }

    const createWeapon = () => {
      const key = weaponKey(this.organize)

      if (!this.textures.exists(key)) {
        const baseColor = DAMAGE_DATA[damageChoice.value].color.value
        const weaponConfig: ITextureConfig<Partial<IWeaponOptions>> = {
          ...WEAPON_CONFIG[deliveryChoice.value]
        }
        weaponConfig.options.color = rgbStringToColors(baseColor)
        makeWeapon(this, key, weaponConfig)
      }

      if (this.weaponSprite) {
        this.weaponSprite.setTexture(key)
      } else {
        this.weaponSprite = createLabeledSprite(left + 420, top, key, "Weapon")
      }
    }

    const createTower = () => {
      // const key = prefixKey(this.organize)
      // const model = GENERATED_INDEX[key]
      // this.towerContainer = this.add.tower(550, 505, model)

      const pKey = platformKey(this.organize)
      const tKey = turretKey(this.organize)
      const wKey = weaponKey(this.organize)
      if (this.towerContainer) {
        this.towerContainer.destroy()
      }
      const isRadial =
        TURRET_CONFIG[deliveryChoice.value].options.topSeg === 10 &&
        TURRET_CONFIG[deliveryChoice.value].options.botSeg === 10
      this.towerContainer = this.add.container(550, 505)
      this.towerContainer.add(this.add.sprite(0, 0, pKey))
      this.towerContainer.add(this.add.sprite(0, 0, tKey))
      const weapon = this.add.sprite(0, isRadial ? 0 : -6 * 4, wKey).setOrigin(0.5, 0)
      this.towerContainer.add(weapon)
      this.towerContainer.scale = 4
    }

    this.damageText = this.add.paragraph(550, 660, 750, ``)
    this.deliveryText = this.add.paragraph(550, 695, 750, ``)

    this.add.label(300, 595, "Projectiles").setOrigin(0.5)
    this.projectiles = [
      this.add.sprite(200, 630, "arrow-default"),
      this.add.sprite(250, 630, "bullet-default"),
      this.add.sprite(300, 630, "missile-default"),
      this.add.sprite(350, 630, "mine-default"),
      this.add.sprite(400, 630, "grenade-default")
    ]

    const generate = () => {
      this.organize = {
        damage: damageChoice.value,
        delivery: deliveryChoice.value
      }
      createPlatform()
      createTurret()
      createWeapon()
      createTower()
      this.projectiles.forEach(p => p.setTint(DAMAGE_DATA[damageChoice.value].color.value))
      this.damageText.text = `${DAMAGE_DATA[damageChoice.value].description}`
      this.deliveryText.text = `${deliveryChoice.value}: ${DELIVERY_DATA[deliveryChoice.value].description}`
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
