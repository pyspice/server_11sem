import { observer } from "mobx-react";
import * as React from "react";

type TryAgainPageProps = {
  onStartNewGame(): void;
};

@observer
export class TryAgainPage extends React.Component<TryAgainPageProps> {
  render() {
    return (
      <div>
        <p>Увы, слова закончились</p>
        <button onClick={this.onStartNewGame}>
          Перемешать и начать заново
        </button>
      </div>
    );
  }

  private onStartNewGame = () => {
    this.props.onStartNewGame();
  };
}
