import * as React from "react";
import { observer } from "mobx-react";
import { GameManager } from "../utils/GameManager";
import { lazyInject } from "../utils/IoC/Container";
import { Services } from "../utils/IoC/Services";

@observer
export class StateInfo extends React.Component {
  @lazyInject(Services.GameManager)
  private readonly gameManager: GameManager;

  render() {
    const { state, currentMask, attemptsLeft, lastActionResult } =
      this.gameManager;

    return (
      <div>
        <div>State: {state}</div>
        <div>Current mask: {currentMask}</div>
        <div>Attempts left: {attemptsLeft}</div>
        <div>Last action result: {lastActionResult}</div>
      </div>
    );
  }
}
