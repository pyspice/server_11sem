import { observer } from "mobx-react";
import * as React from "react";
import { ActionResult } from "../types";
import { GameManager } from "../utils/GameManager";
import { lazyInject } from "../utils/IoC/Container";
import { Services } from "../utils/IoC/Services";

type TryAgainPageProps = {
  onStartNewGame(): void;
};

@observer
export class TryAgainPage extends React.Component<TryAgainPageProps> {
  @lazyInject(Services.GameManager)
  private readonly gameManager: GameManager;

  render() {
    return (
      <div>
        {this.message}
        <p>Увы, слова закончились</p>
        <button onClick={this.onStartNewGame}>
          Перемешать и начать заново
        </button>
      </div>
    );
  }

  private get message() {
    const { currentMask, lastActionResult } = this.gameManager;
    if (!lastActionResult) return null;

    const message =
      lastActionResult === ActionResult.LOOSE
        ? "К сожалению, вы проиграли."
        : "Поздравляем, вы отгадали.";
    return (
      <p>
        {message} Слово: {currentMask}
      </p>
    );
  }

  private onStartNewGame = () => {
    this.props.onStartNewGame();
  };
}
