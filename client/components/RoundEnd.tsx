import { observer } from "mobx-react";
import * as React from "react";

type RoundEndProps = {
  onStartNewRound(): void;
};

@observer
export class RoundEnd extends React.Component<RoundEndProps> {
  render() {
    return (
      <div>
        <p>Добро пожаловать на Поле Чудес</p>
        <button onClick={this.onStartNewRound}>Начать игру</button>
      </div>
    );
  }

  private onStartNewRound = () => {
    this.props.onStartNewRound();
  };
}
