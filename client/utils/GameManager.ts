import { injectable } from "inversify";
import { action, computed, observable, reaction } from "mobx";
import { ActionResult } from "../types";
import { ServerResponse } from "./RequestSender";

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
  init(
    state: GameManagerState,
    currentMask?: string,
    attemptsLeft?: number,
    onChangeState?: (state: InnerState) => void
  ) {
    this._state.state = state;
    this._state.currentMask = currentMask;
    this._state.attemptsLeft = attemptsLeft;
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
  endRound(word: string, action: ActionResult) {
    this._state.state = GameManagerState.ROUND_ENDED;
    this._state.currentMask = word;
    this._state.lastActionResult = action;
    this.signal();
  }

  @action
  onAttemptMade({ action, word, wordsLeft, attempts }: ServerResponse) {
    this._state.lastActionResult = action;
    switch (action) {
      case ActionResult.USED:
        break;

      case ActionResult.OK:
        this._state.currentMask = word;
        break;

      case ActionResult.FAIL:
        this._state.attemptsLeft = attempts;
        break;

      case ActionResult.WIN:
      case ActionResult.LOOSE:
        if (wordsLeft) this.endRound(word, action);
        else this.endGame(word, action);
        return;
    }
    this.signal();
  }

  @action
  endGame(word?: string, action?: ActionResult) {
    this._state.state = GameManagerState.AFTER_END;
    if (word) this._state.currentMask = word;
    if (action) this._state.lastActionResult = action;
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
