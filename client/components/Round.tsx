import * as React from "react";
import { ActionResult } from "../types";
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
    return (
      <div>
        <div>Текущая маска: {this.gameManager.currentMask}</div>
        {this.lastActionMsg}
        <div>Попыток осталось: {this.gameManager.attemptsLeft}</div>
        <input
          type="text"
          value={this.state.letter}
          maxLength={1}
          onChange={this.onChange}
          autoFocus
          onKeyPress={this.onKeyPress}
        />
        <button
          onClick={this.onTryLetter}
          disabled={this.state.letter.length < 1}
        >
          Отправить
        </button>
        <button onClick={this.onSurrender}>Сдаться</button>
      </div>
    );
  }

  private get lastActionMsg() {
    const { lastActionResult } = this.gameManager;
    if (lastActionResult == undefined) return null;

    let msg = "";
    switch (lastActionResult) {
      case ActionResult.FAIL:
        msg = "Не угадали. Попробуйте еще раз!";
        break;

      case ActionResult.OK:
        msg = "Верно! Так держать!";
        break;

      case ActionResult.USED:
        msg = "Внимательнее! Эта буква уже была.";
    }
    return <div>{msg}</div>;
  }

  private onKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && this.state.letter.length > 0) {
      this.onTryLetter();
    }
  };

  private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const letter = event.target.value;
    if (letter && !letter.match(/[а-яА-ЯёЁ]/g)) return;
    this.setState({ letter: event.target.value });
  };

  private onTryLetter = () => {
    this.props.onTryLetter(this.state.letter);
    this.setState({ letter: "" });
  };

  private onSurrender = () => {
    this.props.onSurrender();
  };
}
