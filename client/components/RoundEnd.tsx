import { observer } from "mobx-react";
import * as React from "react";
import { ActionResult } from "../types";
import { GameManager } from "../utils/GameManager";
import { lazyInject } from "../utils/IoC/Container";
import { Services } from "../utils/IoC/Services";

type RoundEndProps = {
  onStartNewRound(): void;
};

@observer
export class RoundEnd extends React.Component<RoundEndProps> {
  @lazyInject(Services.GameManager)
  private readonly gameManager: GameManager;

  render() {
    return (
      <div>
        {this.message}
        <button onClick={this.onStartNewRound}>Следующий раунд</button>
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

  private onStartNewRound = () => {
    this.props.onStartNewRound();
  };
}
