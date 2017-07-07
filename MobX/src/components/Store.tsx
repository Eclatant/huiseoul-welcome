import { action, observable } from "mobx";

interface GameState {
  history: { squares: ["O" | "X"] }[] | any;
  stepNumber: number;
  xIsNext: boolean;
  
}

export default class Store {
  @observable
  currentGame: GameState = { 
    history: [
      {
        squares: Array(9).fill(null)
      }
    ],
    stepNumber: 0,
    xIsNext: true
  };

  @action
  public handleClick(i: number): void {
    const { currentGame } = this;
    let { history, stepNumber, xIsNext } = currentGame;

    const presentHistory = history.slice(0, stepNumber + 1);
    const present = history[stepNumber];
    const presentSquares = present.squares.slice();

    if (this.calculateWinner(presentSquares) || presentSquares[i]) return;

    presentSquares[i] = xIsNext ? "X" : "O";

    // TODO: 이곳에는 squares 하나로 입력할 수 없는가? 
    history = presentHistory.concat([{ presentSquares: presentSquares }]);
    stepNumber = history.length;
    xIsNext = !xIsNext;
  }
  

  @action
  public jumpTo(step: number, inputHistory: [{ squares: ["O" | "X"] }]): void {
    // TODO: 한 줄로 처리할 수 있나?
    const { currentGame } = this;
    let { xIsNext, stepNumber, history } = currentGame;

    xIsNext = step % 2 === 0;
    stepNumber = step;
    history = inputHistory;
  }

  public calculateWinner(squares: ["O" | "X"]): "O" | "X" | null {
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
};
