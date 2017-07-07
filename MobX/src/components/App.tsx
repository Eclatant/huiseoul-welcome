import * as React from "react";
import { observer, inject } from "mobx-react";

import Store from "./Store";

import IStores from "../index";

interface SquareProps {
  value: string;
  onClick(): void;
}

const Square = ({ onClick, value }: SquareProps): JSX.Element =>
  <button className="square" onClick={onClick}>
    {value}
  </button>;

interface BoardProps {
  squares: ["O" | "X"];
  onClick(i: number): void;
}

class Board extends React.Component<BoardProps> {
  private _renderSquare(i: number): JSX.Element {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  public render(): JSX.Element {
    return (
      <div>
        <div className="board-row">
          {this._renderSquare(0)}
          {this._renderSquare(1)}
          {this._renderSquare(2)}
        </div>
        <div className="board-row">
          {this._renderSquare(3)}
          {this._renderSquare(4)}
          {this._renderSquare(5)}
        </div>
        <div className="board-row">
          {this._renderSquare(6)}
          {this._renderSquare(7)}
          {this._renderSquare(8)}
        </div>
      </div>
    );
  }
}

interface IInject {
  store?: Store;
}

@inject((stores: IStores ): IInject => ({
  store: stores.store,
}))
@observer
class Game extends React.Component<IInject> {
  public render(): JSX.Element {
    let { history, xIsNext, calculateWinner, jumpTo, handleClick } = this.props.store.currentGame;
    
    const presentHistory = history;
    const current = presentHistory[presentHistory.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = presentHistory.map((step: "O" | "X", move: number) => {
      const desc = move ? `Move # ${move}` : "Game start";
      return (
        <li key={move}>
          <a
            href="#"
            onClick={() =>
              jumpTo(move, presentHistory.slice(0, move + 1))}
          >
            {desc}
          </a>
        </li>
      );
    });

    let status;

    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${xIsNext ? "X" : "O"}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>
            {status}
          </div>
          <ol>
            {moves}
          </ol>
        </div>
      </div>
    );
  }
}

export default Game;
