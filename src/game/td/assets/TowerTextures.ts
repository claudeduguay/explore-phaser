import { Display, Scene } from "phaser"
import { IColoring } from "../../../util/DrawUtil"
import { IPlatformOptions, IPlatformType } from "./PlatformFactory"
import { IProjectorOptions } from "./ProjectorFactory"
import { ITurretOptions } from "./TurretFactory"
import { ITextureConfig, makeTowerPlatform, makeTowerProjector, makeTowerTurret } from "./TextureFactory"

export function colors(h: number, s: number = 1, l: number = 0.1) {
  const color = Display.Color.HSLToColor(h, s, l)
  return [
    color.brighten(25).rgba,
    color.rgba,
    color.darken(25).rgba
  ]
}

export const COLORS: { [key: string]: IColoring } = {
  // Spray
  FLAME: colors(0.0),
  FREEZE: colors(0.5),
  IMPACT: colors(0.15),
  // Cloud
  POISON: colors(0.3),
  FIRE: colors(0.95),
  SMOKE: colors(0, 1.0, 0),
  SHOCK: colors(0.5),
  ICE: colors(0.7),
  // Fall
  RAIN: colors(0.55),
  SNOW: colors(0, 0, 0.35),
  // Beam
  LAZER: colors(0.6),
  PLASMA: colors(0.65),
  LIGHTNING: colors(0.7),
  // Throw
  BULLET: colors(0.2),
  MISSILE: colors(0.4),
  // Area
  BOOST: colors(0.9),
  SLOW: colors(0.8),
}

export function platformConfig(type: IPlatformType, color: IColoring, divisions: number = 10) {
  return {
    size: { x: 64, y: 64 },
    options: { type, divisions, color }
  }
}

export function roundTurret(color: IColoring) {
  return {
    size: { x: 38, y: 38 },
    options: { ratio: 0.5, topSeg: 10, botSeg: 10, color }
  }
}

interface ITextureConfigs {
  platform: ITextureConfig<Partial<IPlatformOptions>>
  turret: ITextureConfig<Partial<ITurretOptions>>
  projector: ITextureConfig<Partial<IProjectorOptions>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TOWERS: Record<string, ITextureConfigs> = {

  // SPRAY
  FLAME: {
    platform: platformConfig("box-i", COLORS.FLAME),
    turret: {
      size: {
        x: 42,
        y: 38
      },
      options: {
        ratio: 0.6,
        topSeg: 10,
        botSeg: 10,
        color: COLORS.FLAME
      }
    },
    projector: {
      size: {
        x: 7,
        y: 32
      },
      options: {
        type: "funnel",
        margin: 0,
        inset: 0.33,
        color: COLORS.FLAME,
        line: "white"
      },
    }
  },
  FREEZE: {
    platform: platformConfig("angle", COLORS.FREEZE),
    turret: {
      size: {
        x: 42,
        y: 38
      },
      options: {
        ratio: 0.66,
        topSeg: 3,
        botSeg: 10,
        color: COLORS.FREEZE
      }
    },
    projector: {
      size: {
        x: 7,
        y: 32
      },
      options: {
        type: "funnel",
        margin: 0,
        inset: 0.4,
        color: COLORS.FREEZE,
        line: "white"
      },
    }
  },
  IMPACT: {
    platform: platformConfig("angle", COLORS.IMPACT),
    turret: {
      size: {
        x: 42,
        y: 38
      },
      options: {
        ratio: 0.66,
        topSeg: 3,
        botSeg: 10,
        color: COLORS.IMPACT
      }
    },
    projector: {
      size: {
        x: 7,
        y: 32
      },
      options: {
        type: "funnel",
        margin: 0,
        inset: 0.4,
        color: COLORS.IMPACT,
        line: "white"
      },
    }
  },

  // CLOUD
  FIRE: {
    platform: platformConfig("angle", COLORS.FIRE),
    turret: roundTurret(COLORS.FIRE),
    projector: {
      size: {
        x: 7,
        y: 22
      },
      options: {
        type: "point",
        margin: 0,
        inset: 0.0,
        color: COLORS.FIRE,
        line: "white"
      },
    }
  },
  POISON: {
    platform: platformConfig("angle", COLORS.POISON),
    turret: roundTurret(COLORS.POISON),
    projector: {
      size: {
        x: 7,
        y: 22
      },
      options: {
        type: "point",
        margin: 0,
        inset: 0.0,
        color: COLORS.POISON,
        line: "white"
      },
    }
  },
  SMOKE: {
    platform: platformConfig("angle", COLORS.SMOKE),
    turret: {
      size: {
        x: 38,
        y: 38
      },
      options: {
        ratio: 0.5,
        topSeg: 10,
        botSeg: 10,
        color: COLORS.SMOKE
      }
    },
    projector: {
      size: {
        x: 7,
        y: 22
      },
      options: {
        type: "point",
        margin: 0,
        inset: 0.0,
        color: COLORS.SMOKE,
        line: "white"
      },
    }
  },
  SHOCK: {
    platform: platformConfig("angle", COLORS.SHOCK),
    turret: roundTurret(COLORS.SHOCK),
    projector: {
      size: {
        x: 7,
        y: 22
      },
      options: {
        type: "point",
        margin: 0,
        inset: 0.0,
        color: COLORS.SHOCK,
        line: "white"
      },
    }
  },
  ICE: {
    platform: platformConfig("angle", COLORS.ICE),
    turret: roundTurret(COLORS.ICE),
    projector: {
      size: {
        x: 7,
        y: 22
      },
      options: {
        type: "point",
        margin: 0,
        inset: 0.0,
        color: COLORS.ICE,
        line: "white"
      },
    }
  },

  // FALL
  RAIN: {
    platform: platformConfig("angle", COLORS.RAIN),
    turret: roundTurret(COLORS.RAIN),
    projector: {
      size: {
        x: 7,
        y: 22
      },
      options: {
        type: "point",
        margin: 0,
        inset: 0.0,
        color: COLORS.RAIN,
        line: "white"
      },
    }
  },
  SNOW: {
    platform: platformConfig("angle", COLORS.SNOW),
    turret: roundTurret(COLORS.SNOW),
    projector: {
      size: {
        x: 7,
        y: 22
      },
      options: {
        type: "point",
        margin: 0,
        inset: 0.0,
        color: COLORS.SNOW,
        line: "white"
      },
    }
  },

  // BEAM
  LAZER: {
    platform: platformConfig("ntagon", COLORS.LAZER),
    turret: {
      size: {
        x: 48,
        y: 24
      },
      options: {
        ratio: 0.6,
        topSeg: 3,
        botSeg: 10,
        color: COLORS.LAZER
      }
    },
    projector: {
      size: {
        x: 7,
        y: 32
      },
      options: {
        type: "rect",
        margin: 0,
        inset: 0.4,
        ribs: { count: 3, color: COLORS.LAZER[1], start: 0.08, step: 0.08 },
        color: COLORS.LAZER,
        line: "white"
      }
    }
  },
  PLASMA: {
    platform: platformConfig("angle", COLORS.PLASMA),
    turret: {
      size: {
        x: 42,
        y: 38
      },
      options: {
        ratio: 0.5,
        topSeg: 10,
        botSeg: 3,
        color: COLORS.PLASMA
      }
    },
    projector: {
      size: {
        x: 7,
        y: 32
      },
      options: {
        type: "point",
        margin: 0,
        inset: 0.4,
        balls: { count: 1, color: ["#FCF"], start: 0 },
        color: COLORS.PLASMA,
        line: "white"
      },
    }
  },
  LIGHTNING: {
    platform: platformConfig("angle", COLORS.LIGHTNING),
    turret: {
      size: {
        x: 42,
        y: 38
      },
      options: {
        ratio: 0.5,
        topSeg: 10,
        botSeg: 3,
        color: COLORS.LIGHTNING
      }
    },
    projector: {
      size: {
        x: 7,
        y: 32
      },
      options: {
        type: "point",
        margin: 0,
        inset: 0.4,
        balls: { count: 1, color: ["#FCF"], start: 0 },
        color: COLORS.LIGHTNING,
        line: "white"
      },
    }
  },

  // THROW
  BULLET: {
    platform: platformConfig("angle", COLORS.BULLET),
    turret: {
      size: {
        x: 42,
        y: 38
      },
      options: {
        ratio: 0.5,
        topSeg: 4,
        botSeg: 10,
        color: COLORS.BULLET
      }
    },
    projector: {
      size: {
        x: 7,
        y: 38
      },
      options: {
        type: "rect",
        margin: 0,
        inset: 0.35,
        supressor: { pos: 0.15, len: 0.4, color: ["#330", "#990", "#330"] },
        color: COLORS.BULLET,
        line: "white"
      },
    }
  },
  MISSILE: {
    platform: platformConfig("angle", COLORS.MISSILE),
    turret: {
      size: {
        x: 42,
        y: 38
      },
      options: {
        ratio: 0.5,
        topSeg: 4,
        botSeg: 10,
        color: COLORS.MISSILE
      }
    },
    projector: {
      size: {
        x: 7,
        y: 32
      },
      options: {
        type: "rect",
        margin: 0,
        inset: 0.45,
        color: COLORS.MISSILE,
        line: "white"
      },
    }
  },

  // AREA
  BOOST: {
    platform: platformConfig("angle", COLORS.BOOST),
    turret: {
      size: {
        x: 42,
        y: 42
      },
      options: {
        ratio: 0.5,
        topSeg: 10,
        botSeg: 10,
        color: COLORS.BOOST
      }
    },
    projector: {
      size: {
        x: 7,
        y: 18
      },
      options: {
        type: "funnel",
        margin: 0,
        inset: 0.8,
        color: COLORS.BOOST,
        balls: { count: 1, color: ["#FCF"], start: 0.7 },
        line: "white"
      },
    }
  },
  SLOW: {
    platform: platformConfig("angle", COLORS.SLOW),
    turret: {
      size: {
        x: 42,
        y: 42
      },
      options: {
        ratio: 0.5,
        topSeg: 10,
        botSeg: 10,
        color: COLORS.SLOW
      }
    },
    projector: {
      size: {
        x: 7,
        y: 18
      },
      options: {
        type: "rect",
        margin: 0,
        inset: 0.4,
        color: COLORS.SLOW,
        balls: { count: 1, color: ["#FCF"], start: 0 },
        line: "white"
      }
    }
  }

}

export default function registerTowerTextures(scene: Scene) {
  for (let [key, { platform, turret, projector }] of Object.entries(TOWERS)) {
    key = key.toLowerCase()
    makeTowerPlatform(scene, `${key}-platform`, platform)
    makeTowerTurret(scene, `${key}-turret`, turret)
    makeTowerProjector(scene, `${key}-projector`, projector)
  }
}
