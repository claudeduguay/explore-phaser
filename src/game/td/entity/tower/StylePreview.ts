import { GameObjects, Scene } from "phaser";
import { GENERATED_INDEX, ITowerOrganize, platformKey, prefixKey, turretKey, weaponKey } from "../model/ITowerModel";
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
import TDTower, { PreviewType } from "./TDTower";
import { ENEMY_LIST } from "../model/IEnemyModel";
import TDEnemy from "../enemy/TDEnemy";

// Note: May need to make this a scene to manage the fact that 
// behaviors add elements relative to the tower position in the scene
export default class StylePreview extends Scene {

  platformSprite!: GameObjects.Sprite
  turretSprite!: GameObjects.Sprite
  weaponSprite!: GameObjects.Sprite
  tower!: TDTower
  damageText!: GameObjects.Text
  deliveryText!: GameObjects.Text
  organize!: ITowerOrganize;

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
    const damageMonitor = new ValueMonitor(this, hBox * 3 - 70, 60, 0xe1eb, "#FFFFFF", damageChoice)
    this.add.existing(damageMonitor)

    const damage = this.add.container(75, 70)
    damage.add(new Label(this, 0, 0, "Damage"))
    TYPES_DAMAGE.forEach((type: IDamageType) => {
      const row = this.add.container()
      const button = new Button(this, -10, 0, 75, 25, type, "flat")
      button.onClick = () => damageChoice.value = type
      row.add(button)
      const { key, scale } = DAMAGE_DATA[type].sprite
      if (this.textures.exists(key)) {
        const sprite = this.add.sprite(50, 0, key)
        sprite.setScale(scale)
        sprite.setSize(25, 25)
        row.add(sprite)
      }
      // const rowLayout = new HBoxLayout()
      // rowLayout.apply(row)
      row.setSize(100, 25)
      damage.add(row)
    })
    const damageLayout = new VBoxLayout(new Point(5, 5))
    damageLayout.apply(damage)

    const deliveryChoice = new ObservableValue<string>("Arrow")
    const deliveryMonitor = new ValueMonitor(this, hBox * 3 + 70, 60, 0xe558, "#FFFFFF", deliveryChoice)
    this.add.existing(deliveryMonitor)

    const delivery = this.add.container(hBox * 6 - 75, 70)
    delivery.add(new Label(this, 0, 0, "Delivery"))
    TYPES_DELIVERY.forEach((type: IDeliveryType) => {
      const row = this.add.container()
      const { key, scale } = DELIVERY_DATA[type].sprite
      if (this.textures.exists(key)) {
        const sprite = this.add.sprite(-70, 0, key)
        sprite.setScale(scale)
        row.add(sprite)
      }
      const button = new Button(this, -10, 0, 75, 25, type, "flat")
      button.onClick = () => deliveryChoice.value = type
      row.add(button)
      // const rowLayout = new HBoxLayout()
      // rowLayout.apply(row)
      row.setSize(100, 25)
      delivery.add(row)
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
      // const model = GENERATED_INDEX[key]
      // this.towerContainer = this.add.tower(550, 505, model)

      if (this.tower) {
        this.tower.destroy()
      }
      const key = prefixKey(this.organize)
      const model = GENERATED_INDEX[key]

      const scale = 1
      const x = 550
      const y = 500
      this.tower = this.add.tower(x, y, model)
      this.tower.preview = PreviewType.Preview
      this.tower.scale = scale
      this.tower.targeting.current = [new TDEnemy(this, x, y - model.general.range, ENEMY_LIST[0])]
    }

    this.damageText = this.add.paragraph(550, 660, 750, ``)
    this.deliveryText = this.add.paragraph(550, 695, 750, ``)

    const generate = () => {
      this.organize = {
        damage: damageChoice.value,
        delivery: deliveryChoice.value
      }
      createPlatform()
      createTurret()
      createWeapon()
      createTower()
      this.damageText.text = `${DAMAGE_DATA[damageChoice.value].description}`
      this.deliveryText.text = `${deliveryChoice.value}: ${DELIVERY_DATA[deliveryChoice.value].description}`
    }

    damageChoice.addListener("changed", generate)
    deliveryChoice.addListener("changed", generate)

    generate()

  }

}
