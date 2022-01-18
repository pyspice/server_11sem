import { injectable } from "inversify";
import { action, observable } from "mobx";

export enum State {
  BEFORE_START = "BEFORE_START",
  ROUND_RUNNING = "ROUND_RUNNING",
  ROUND_ENDED = "ROUND_ENDED",
  AFTER_END = "AFTER_END",
}

export enum ActionResult {
  USED = "USED",
  FAIL = "FAIL",
  OK = "OK",
  WIN = "WIN",
  LOOSE = "LOOSE",
}

@injectable()
export class GameManager {
  @observable private _state: State;
  @observable private _currentMask: string;
  @observable private _attemptsLeft: number;
  @observable private _lastActionResult: ActionResult;
  @observable private _wasInited: boolean = false;

  @action
  init(state: State, currentMask?: string, attemptsLeft?: number) {
    this._state = state;
    this._currentMask = currentMask;
    this._attemptsLeft = attemptsLeft;
    this._wasInited = true;
  }

  @action
  startRound(mask: string, attempts: number) {
    this._state = State.ROUND_RUNNING;
    this._currentMask = mask;
    this._attemptsLeft = attempts;
  }

  @action
  setLastActionResult(actionResult: ActionResult) {
    this._lastActionResult = actionResult;
  }

  @action
  endRound() {}

  get state() {
    return this._state;
  }

  get currentMask() {
    return this._currentMask;
  }

  get attemptsLeft() {
    return this._attemptsLeft;
  }

  get lastActionResult() {
    return this._lastActionResult;
  }

  get wasInited() {
    return this._wasInited;
  }
}
