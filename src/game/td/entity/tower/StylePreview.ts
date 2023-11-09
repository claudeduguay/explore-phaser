import { GameObjects, Scene } from "phaser";
import { ITowerOrganize, platformKey, turretKey, weaponKey } from "../model/ITowerModel";
import { TYPES_DAMAGE, TYPES_DELIVERY } from "../model/ITowerData"
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

    const deliveryChoice = new ObservableValue<string>("Shot")
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

    this.add.sprite(200, 550, "arrow-default")
    this.add.sprite(250, 550, "missile-default")
    this.add.sprite(300, 550, "mine-default")


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
