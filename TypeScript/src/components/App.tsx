import * as React from "react";

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

interface GameState {
  history: { squares: ["O" | "X"] }[] | any;
  stepNumber: number;
  xIsNext: boolean;
}

export default class Game extends React.Component<{}, GameState> {
  constructor() {
    super();

    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  private _handleClick(i: number): void {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  private _jumpTo(step: number, history: [{ squares: ["O" | "X"] }]): void {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      history: history
    });
  }

  public render(): JSX.Element {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step: "O" | "X", move: number) => {
      const desc = move ? `Move # ${move}` : "Game start";
      return (
        <li key={move}>
          <a
            href="#"
            onClick={() =>
              this._jumpTo(move, this.state.history.slice(0, move + 1))}
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
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this._handleClick(i)}
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

function calculateWinner(squares: ["O" | "X"]): "O" | "X" | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
