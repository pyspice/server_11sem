import * as React from "react";
import { observer } from "mobx-react";
import { GameManager, GameManagerState } from "../utils/GameManager";
import { lazyInject } from "../utils/IoC/Container";
import { Services } from "../utils/IoC/Services";
import {
  ClientAction,
  RequestSender,
  ServerStateLabel,
} from "../utils/RequestSender";
import { StateInfo } from "./StateInfo";
import { computed } from "mobx";
import { WelcomePage } from "./WelcomePage";
import { Round } from "./Round";
import { RoundEnd } from "./RoundEnd";
import { TryAgainPage } from "./TryAgainPage";

@observer
export class Game extends React.Component {
  @lazyInject(Services.GameManager)
  private readonly gameManager: GameManager;

  @lazyInject(Services.RequestSender)
  private readonly requestSender: RequestSender;

  private infoRef = React.createRef<StateInfo>();
  private contentRef = React.createRef<any>();

  componentDidMount() {
    this.updateState();
  }

  render() {
    return (
      <div>
        <StateInfo ref={this.infoRef} />
        {this.content}
      </div>
    );
  }

  private get content() {
    if (!this.gameManager.wasInited) {
      return "Now loading...";
    }

    switch (this.gameManager.state) {
      case GameManagerState.BEFORE_START:
        return (
          <WelcomePage
            ref={this.contentRef}
            onStartGame={this.onStartNewRound}
          />
        );
      case GameManagerState.ROUND_RUNNING:
        return (
          <Round
            ref={this.contentRef}
            onTryLetter={this.onTryLetter}
            onSurrender={this.onSurrender}
          />
        );
      case GameManagerState.ROUND_ENDED:
        return (
          <RoundEnd
            ref={this.contentRef}
            onStartNewRound={this.onStartNewRound}
          />
        );
      case GameManagerState.AFTER_END:
        return (
          <TryAgainPage
            ref={this.contentRef}
            onStartNewGame={this.onStartNewRound}
          />
        );
    }
  }

  private updateState = async () => {
    const serverState = await this.requestSender.fetchState();

    if (
      serverState.state === ServerStateLabel.ROUND_ENDED &&
      !serverState.wordsLeft
    ) {
      this.gameManager.endGame();
      return;
    }

    this.gameManager.init(serverState as any, this.onChangeState);
  };

  private onStartNewRound = () => {
    this.requestSender.postAction({ action: ClientAction.NEXT_ROUND });
  };

  private onTryLetter = (letter: string) => {
    this.requestSender.postAction({ action: ClientAction.TRY, letter });
  };

  private onSurrender = () => {
    this.requestSender.postAction({ action: ClientAction.SURRENDER });
  };

  private onChangeState = () => {
    this.infoRef.current?.forceUpdate();
    this.contentRef.current?.forceUpdate();
    this.forceUpdate();
  };
}
