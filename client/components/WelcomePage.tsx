import * as React from "react";

type WelcomePageProps = {
  onStartGame(): void;
};

export class WelcomePage extends React.Component<WelcomePageProps> {
  render() {
    return (
      <div>
        <p>Добро пожаловать на Поле Чудес</p>
        <button onClick={this.onStartGame}>Начать игру</button>
      </div>
    );
  }

  private onStartGame = () => {
    this.props.onStartGame();
  };
}
