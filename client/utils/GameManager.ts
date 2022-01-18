import { injectable } from "inversify";
import { action, computed, observable, reaction } from "mobx";
import { ActionResult } from "../types";

export enum GameManagerState {
  BEFORE_START = "BEFORE_START",
  ROUND_RUNNING = "ROUND_RUNNING",
  ROUND_ENDED = "ROUND_ENDED",
  AFTER_END = "AFTER_END",
}

type InnerState = {
  state: GameManagerState;
  currentMask?: string;
  attemptsLeft?: number;
  lastActionResult?: ActionResult;
};

@injectable()
export class GameManager {
  // hot-fix workaround bingo
  private onChangeState: (state: InnerState) => void;

  @observable private _state: InnerState = {
    state: undefined,
  };

  @action
  init(state: InnerState, onChangeState: (state: InnerState) => void) {
    this._state = state;
    this.onChangeState = onChangeState;
    this.signal();
  }

  @action
  startRound(mask: string, attempts: number) {
    this._state.state = GameManagerState.ROUND_RUNNING;
    this._state.currentMask = mask;
    this._state.attemptsLeft = attempts;
    this.signal();
  }

  @action
  setLastActionResult(actionResult: ActionResult) {
    this._state.lastActionResult = actionResult;
    this.signal();
  }

  @action
  endRound() {
    this._state.state = GameManagerState.ROUND_ENDED;
  }

  @action
  endGame() {
    this._state.state = GameManagerState.AFTER_END;
    this.signal();
  }

  get state() {
    return this._state.state;
  }

  get currentMask() {
    return this._state.currentMask;
  }

  get attemptsLeft() {
    return this._state.attemptsLeft;
  }

  get lastActionResult() {
    return this._state.lastActionResult;
  }

  get wasInited() {
    return this._state.state !== undefined;
  }

  private signal = () => {
    this.onChangeState(this._state);
  };
}
