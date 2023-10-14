
// Keys from https://github.com/photonstorm/phaser/blob/v3.60.0/src/math/easing/EaseMap.js
export type EasingMapKeys = "Power0" | "Power1" | "Power3" | "Power4" |

  "Linear" | "Quad" | "Cubic" | "Quart" | "Quint" | "Sine" |
  "Expo" | "Circ" | "Elastic" | "Back" | "Bounce" | "Stepped" |

  "Quad.easeIn" | "Cubic.easeIn" | "Quart.easeIn" | "Quint.easeIn" | "Sine.easeIn" |
  "Expo.easeIn" | "Circ.easeIn" | "Elastic.easeIn" | "Back.easeIn" | "Bounce.easeIn" |

  "Quad.easeOut" | "Cubic.easeOut" | "Quart.easeOut" | "Quint.easeOut" | "Sine.easeOut" |
  "Expo.easeOut" | "Circ.easeOut" | "Elastic.easeOut" | "Back.easeOut" | "Bounce.easeOut" |

  "Quad.easeInOut" | "Cubic.easeInOut" | "Quart.easeInOut" | "Quint.easeInOut" | "Sine.easeInOut" |
  "Expo.easeInOut" | "Circ.easeInOut" | "Elastic.easeInOut" | "Back.easeInOut" | "Bounce.easeInOut"

export type IEasingFunction = (f: number) => number

export type IEasingKeyOrFunction = EasingMapKeys | IEasingFunction

// Keys from https://github.com/photonstorm/phaser/blob/v3.60.0/src/tweens/builders/GetInterpolationFunction.js
// Note: Phaser.Math.Interpolation has more than these four types, these are supported by GetInterpolationFunction
export type InterpolationMapKeys = "bezier" | "catmull" | "catmullrom" | "linear"

export type IInterpolationFunction = (v: Array<number>, f: number) => number

export type IInterpolationKeyOrFunction = InterpolationMapKeys | IInterpolationFunction
