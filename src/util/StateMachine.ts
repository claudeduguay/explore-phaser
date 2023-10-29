import { GameObjects, Scene } from "phaser"

export interface IState {
  onEnter?: () => void
  onUpdate?: (time: number, delta: number) => void
  onExit?: () => void
}

export enum ValidateTransitions {
  IGNORE,
  CONSOLE,
  ERROR,
}

export enum TraceTransitons {
  NONE = 0,
  ON_ENTER = 0b001,
  ON_EXIT = 0b010,
  ON_TRANSITION = 0x011,
  ON_UPDATE = 0b100,
  ON_ALL = 0b111
}

export default class StateMachine extends GameObjects.GameObject {

  validTransitions = new Map<string, Set<string>>()

  states = new Map<string, IState>()
  currentState?: string

  inTransition: boolean = false
  stateQueue: string[] = []

  constructor(scene: Scene,
    public machineName: string = "State Machine",
    public validateTransitions = ValidateTransitions.IGNORE,
    public traceTransitions = TraceTransitons.NONE) {
    super(scene, "statemachine")
  }

  addState(name: string, state?: IState) {
    this.states.set(name, state || {})
    return this
  }

  removeState(name: string) {
    this.states.delete(name)
    return this
  }

  isActiveState(name: string) {
    return this.currentState === name
  }

  addTransition(source: string, target: string) {
    if (!this.validTransitions.has(source)) {
      this.validTransitions.set(source, new Set<string>())
    }
    this.validTransitions.get(source)!.add(target)
    return this
  }

  removeTransition(source: string, target: string) {
    const targets = this.validTransitions.get(source)
    if (targets) {
      targets.delete(target)
      if (targets.size === 0) {
        this.validTransitions.delete(source)
      }
    }
    return this
  }

  transitionTo(name: string) {

    // Skip if already current
    if (this.currentState === name) {
      return
    }

    // If validateTransisions is not None, check that source->target is valid
    if (this.validateTransitions !== ValidateTransitions.IGNORE && this.currentState) {
      const targets = this.validTransitions.get(this.currentState)
      if (!targets?.has(name)) {
        const message = `Invalid transition in ${this.machineName} from "${this.currentState}" to "${name}".`
        if (this.validateTransitions === ValidateTransitions.CONSOLE) {
          console.error(message)
        }
        if (this.validateTransitions === ValidateTransitions.ERROR) {
          throw new Error(message)
        }
      }
    }

    // If we're inside a transition, queue the state change for next update
    if (this.inTransition) {
      this.stateQueue.push(name)
      return
    }

    // Flag that we are inside a transition now
    this.inTransition = true

    // If currentState has an onExit, call it
    if (this.currentState) {
      const state = this.states.get(this.currentState)
      if (state?.onExit) {
        if (this.hasTraceFlag(TraceTransitons.ON_EXIT)) {
          console.log(`Execute onExit in  ${this.machineName} for "${this.currentState}"`)
        }
        state.onExit()
      }
    }

    // Set currentState to the new state name
    this.currentState = name

    // If currentState has an onExit, call it
    const state = this.states.get(this.currentState)
    if (state?.onEnter) {
      if (this.hasTraceFlag(TraceTransitons.ON_ENTER)) {
        console.log(`Execute onEnter in  ${this.machineName} for "${name}"`)
      }
      state.onEnter()
    }

    // Clear flag that we are inside a transition
    this.inTransition = false
  }

  hasTraceFlag(flag: TraceTransitons) {
    return (this.traceTransitions & flag) === flag
  }

  preUpdate(time: number, delta: number) {
    if (this.stateQueue.length) {
      const queued = this.stateQueue.shift()
      if (queued) {
        this.setState(queued)
      }
      return
    }

    if (this.currentState) {
      const state = this.states.get(this.currentState)
      if (state?.onUpdate) {
        if (this.hasTraceFlag(TraceTransitons.ON_UPDATE)) {
          console.log(`Execute onUpdate in  ${this.machineName} for "${this.currentState}"`)
        }
        state.onUpdate(time, delta)
      }
    }
  }
}

export function registerStateMachineFactory() {
  GameObjects.GameObjectFactory.register("statemachine",
    function (this: GameObjects.GameObjectFactory,
      machineName?: string,
      validateTransitions?: ValidateTransitions,
      traceTransitions?: TraceTransitons): StateMachine {
      const stateMachine = new StateMachine(this.scene, machineName, validateTransitions, traceTransitions)
      this.updateList.add(stateMachine)
      return stateMachine
    }
  )
}
