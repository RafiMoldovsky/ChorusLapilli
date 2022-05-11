import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
	numberOfMoves:0,
	stepNumber: 0,
	xIsNext: true,
	firstClick: -1,
    };
  }

    handleClick(i) {
	const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[history.length - 1];
	const squares = current.squares.slice();
    if (calculateWinner(squares)) {
      return;
    }
	if (this.state.numberOfMoves>=6)
	{
	    if(this.state.firstClick==-1)
	    {
		let x = this.state.xIsNext ? 'X' : 'O';
		if(squares[i]==x)
		{
		    this.state.firstClick= i;
		}
		else
		    return;
	    }
	    else
	    {
		let x = this.state.xIsNext ? 'X' : 'O';
		if(!squares[i] && theseAreAdjacent(i,this.state.firstClick))
		{
		    if(squares[4]==x && this.state.firstClick!=4)
		    {
			let tempSquares = squares;
			tempSquares[i] = squares[this.state.firstClick];
			if(!calculateWinner(tempSquares))
			    return;
		    }
		    squares[i]=squares[this.state.firstClick];
		    squares[this.state.firstClick]=null;
		    this.setState({
			history: history.concat([{
			    squares: squares
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
			firstClick: -1,
			    });
		}
		else
		{
		    this.state.firstClick=-1;
		    return;
		}
	    }
	}
	else
	{
	    if(squares[i])
	    {
		return;
	    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
	stepNumber: history.length,
	xIsNext: !this.state.xIsNext,
	numberOfMoves: this.state.numberOfMoves+1,
    });
	}}
jumpTo(step) {
    this.setState({
	stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
          <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
function theseAreAdjacent(x,y)
{
    if (x==0)
    {
	if(y==1 || y==3 || y==4)
	    return true;
    }
    if (x==1)
    {
	if(y==0 || y==2 || y==3 || y==4 || y==5)
	    return true;
    }
    if(x==2)
    {
	if(y==1 || y==4 || y==5)
	    return true;
    }
    if(x==3)
    {
	if(y==0 || y==1 || y==4 || y==6 || y==7)
	    return true;
    }
    if(x==4)
    {
	if(y!=4)
	    return true;
    }
    if(x==5)
    {
	if(y==2 || y==4 || y==7 || y==8)
	    return true;
    }
    if(x==6)
    {
	if(y==3 || y==4 || y==7)
	    return true;
    }
    if(x==7)
    {
	if(y==3 || y==4 || y==5 || y==6 || y==8)
	    return true;
    }
    if(x==8)
    {
	if(y==4 || y==5 || y==7)
	    return true;
    }
    return false;
}
