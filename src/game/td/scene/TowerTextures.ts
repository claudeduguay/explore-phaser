import { Display, Scene } from "phaser"
import { IColoring } from "../../../util/DrawUtil"
import { IPlatformOptions } from "../assets/PlatformFactory"
import { IProjectorOptions } from "../assets/ProjectorFactory"
import { ITurretOptions } from "../assets/TurretFactory"
import { ITextureConfig, makeTowerPlatform, makeTowerProjector, makeTowerTurret } from "../assets/TextureFactory"

export function colors(h: number, s: number = 1, l: number = 0.1) {
  const color = Display.Color.HSLToColor(h, s, l)
  return [
    color.brighten(25).rgba,
    color.rgba,
    color.darken(25).rgba
  ]
}

export const COLORS: { [key: string]: IColoring } = {
  FIRE: colors(0.0),
  POISON: colors(0.3),
  SMOKE: colors(0, 1.0, 0),
  SHOCK: colors(0.7),
  FREEZE: colors(0.5),
  LAZER: colors(0.6),
  PLASMA: colors(0.65),
  BULLET: colors(0.2),
  MISSILE: colors(0.4),
  LIGHTNING: colors(0.7),
  ICE: colors(0.5),
  BOOST: colors(0.9),
  SLOW: colors(0.8),
}

interface ITextureConfigs {
  platform: ITextureConfig<Partial<IPlatformOptions>>
  turret: ITextureConfig<Partial<ITurretOptions>>
  projector: ITextureConfig<Partial<IProjectorOptions>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TOWERS: Record<string, ITextureConfigs> = {
  LAZER: {
    platform: {
      size: {
        x: 64,
        y: 64
      },
      options: {
        type: "curve-o",
        margin: 0,
        inset: 0.2,
        color: COLORS.LAZER
      }
    },
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
  FIRE: {
    platform: {
      size: {
        x: 64,
        y: 64
      },
      options: {
        type: "box-i",
        margin: 0,
        inset: 0.1,
        color: COLORS.FIRE
      }
    },
    turret: {
      size: {
        x: 42,
        y: 38
      },
      options: {
        ratio: 0.6,
        topSeg: 10,
        botSeg: 10,
        color: COLORS.FIRE
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
        color: COLORS.FIRE,
        line: "white"
      },
    }
  },
  POISON: {
    platform: {
      size: {
        x: 64,
        y: 64
      },
      options: {
        type: "angle",
        margin: 0,
        inset: 0.2,
        color: COLORS.POISON
      }
    },
    turret: {
      size: {
        x: 38,
        y: 38
      },
      options: {
        ratio: 0.5,
        topSeg: 10,
        botSeg: 10,
        color: COLORS.POISON
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
        color: COLORS.POISON,
        line: "white"
      },
    }
  },
  SMOKE: {
    platform: {
      size: {
        x: 64,
        y: 64
      },
      options: {
        type: "angle",
        margin: 0,
        inset: 0.2,
        color: COLORS.SMOKE
      }
    },
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
    platform: {
      size: {
        x: 64,
        y: 64
      },
      options: {
        type: "angle",
        margin: 0,
        inset: 0.2,
        color: COLORS.SHOCK
      }
    },
    turret: {
      size: {
        x: 38,
        y: 38
      },
      options: {
        ratio: 0.5,
        topSeg: 10,
        botSeg: 10,
        color: COLORS.SHOCK
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
        color: COLORS.SHOCK,
        line: "white"
      },
    }
  },
  FREEZE: {
    platform: {
      size: {
        x: 64,
        y: 64
      },
      options: {
        type: "angle",
        margin: 0,
        inset: 0.2,
        color: COLORS.FREEZE
      }
    },
    turret: {
      size: {
        x: 38,
        y: 38
      },
      options: {
        ratio: 0.5,
        topSeg: 10,
        botSeg: 10,
        color: COLORS.FREEZE
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
        color: COLORS.FREEZE,
        line: "white"
      },
    }
  },
  BULLET: {
    platform: {
      size: {
        x: 64,
        y: 64
      },
      options: {
        type: "angle",
        margin: 0,
        inset: 0.2,
        color: COLORS.BULLET
      }
    },
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
  PLASMA: {
    platform: {
      size: {
        x: 64,
        y: 64
      },
      options: {
        type: "angle",
        margin: 0,
        inset: 0.2,
        color: COLORS.PLASMA
      }
    },
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
  MISSILE: {
    platform: {
      size: {
        x: 64,
        y: 64
      },
      options: {
        type: "angle",
        margin: 0,
        inset: 0.2,
        color: COLORS.MISSILE
      }
    },
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
  LIGHTNING: {
    platform: {
      size: {
        x: 64,
        y: 64
      },
      options: {
        type: "angle",
        margin: 0,
        inset: 0.2,
        color: COLORS.LIGHTNING
      }
    },
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
  ICE: {
    platform: {
      size: {
        x: 64,
        y: 64
      },
      options: {
        type: "angle",
        margin: 0,
        inset: 0.2,
        color: COLORS.ICE
      }
    },
    turret: {
      size: {
        x: 42,
        y: 38
      },
      options: {
        ratio: 0.66,
        topSeg: 3,
        botSeg: 10,
        color: COLORS.ICE
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
        color: COLORS.ICE,
        line: "white"
      },
    }
  },
  BOOST: {
    platform: {
      size: {
        x: 64,
        y: 64
      },
      options: {
        type: "angle",
        margin: 0,
        inset: 0.2,
        color: COLORS.BOOST
      }
    },
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
    platform: {
      size: {
        x: 64,
        y: 64
      },
      options: {
        type: "angle",
        margin: 0,
        inset: 0.2,
        color: COLORS.SLOW
      }
    },
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
