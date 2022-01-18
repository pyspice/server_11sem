import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { GameManager } from "../utils/GameManager";
import { lazyInject } from "../utils/IoC/Container";
import { Services } from "../utils/IoC/Services";

type RoundProps = {
  onTryLetter(letter: string): void;
  onSurrender(): void;
};

type RoundState = {
  letter: string;
};

export class Round extends React.Component<RoundProps, RoundState> {
  state = {
    letter: "",
  };

  @lazyInject(Services.GameManager)
  private readonly gameManager: GameManager;

  render() {
    const { lastActionResult } = this.gameManager;
    return (
      <div>
        {lastActionResult != undefined && (
          <div>Последнее действие: {lastActionResult}</div>
        )}
        <input
          type="text"
          value={this.state.letter}
          maxLength={1}
          pattern="[А-Яа-яЁё]"
          onChange={(event) => this.setState({ letter: event.target.value })}
        />
        <button onClick={this.onTryLetter}>Нажми и отправь</button>
        <button onClick={this.onSurrender}>Сдаться</button>
      </div>
    );
  }

  private onTryLetter = () => {
    this.props.onTryLetter(this.state.letter);
  };

  private onSurrender = () => {
    this.props.onSurrender();
  };
}
