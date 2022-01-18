import * as React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { GameManager } from "../utils/GameManager";
import { lazyInject } from "../utils/IoC/Container";
import { Services } from "../utils/IoC/Services";
import { RequestSender } from "../utils/RequestSender";

@observer
export class Game extends React.Component {
  @observable private letter: string = "";

  @lazyInject(Services.GameManager)
  private readonly gameManager: GameManager;

  @lazyInject(Services.RequestSender)
  private readonly requestSender: RequestSender;

  componentDidMount() {
    this.requestSender.fetchState().then((response) => {
      console.log(response);
    });
  }

  render() {
    const { state, currentMask, attemptsLeft, lastActionResult } =
      this.gameManager;

    return (
      <div>
        <div>State: {state}</div>
        <div>Current mask: {currentMask}</div>
        <div>Attempts left: {attemptsLeft}</div>
        <div>Last action result: {lastActionResult}</div>
        {/* <input
          type="text"
          value={this.letter}
          maxLength={1}
          pattern="[А-Яа-яЁё]"
        />
        <button onClick={this.onSend}>Нажми и отправь</button> */}
      </div>
    );
  }

  private onSend = () => {};
}
