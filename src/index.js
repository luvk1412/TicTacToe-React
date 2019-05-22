import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    const winstyle = {
        backgroundColor:'#ccc',
    }
    return (
        <button className="btn btn-light square" onClick={() => props.onClick() } style={props.winSqaure ? winstyle : null}>
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        let winstatus = null;
        if(this.props.winningSquares){
            if(this.props.winningSquares.includes(i)){
                winstatus = true;
            }
        }
        return (
            <Square 
                value = {this.props.squares[i]}
                onClick = {()=>this.props.onClick(i)}
                winSqaure = {winstatus}
            />
        );
    }

    render() {
        let boardMatrix = [];
        for (let i = 0; i < 3; ++i){
            let boardRow = [];
            for (let j = 0; j < 3; ++j){
                boardRow.push(<span key={i*3+j}>{this.renderSquare(i*3+j)}</span>);
            }
            boardMatrix.push(<div className="board-row" key={i}>{boardRow}</div>);
        }
        return (
            <div>
                {boardMatrix}
            </div>
        );
    }
}


class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history : [{
                squares : Array(9).fill(null),
                clicked : null,
            }],
            stepNumber : 0,
            xIsNext : true,
            isAscending : true,
        }
    }
    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) ||  squares[i]){
            return;
        }
        if(this.state.xIsNext){
            squares[i] = 'X';
        }
        else{
            squares[i] = 'O';
        }
        this.setState({
            history : history.concat([{
                squares : squares,
                clicked : i,
            }]),
            stepNumber : history.length,
            xIsNext : !this.state.xIsNext,
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber : step,
            xIsNext : (step % 2) === 0,
        });
    }
    handleSort(){
        this.setState({
            isAscending : !this.state.isAscending,
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const description = move ? ('Position : (' + (Math.floor(step.clicked/3)+1) + ',' + (step.clicked % 3 + 1) +'), Go to move # ' + move) : 'Go to game start';
            return (
                <li key ={move}>
                    <button className="btn btn-light" style={move===this.state.stepNumber ? {fontWeight:'bold'} : {fontWeight : 'normal'}} onClick={() => this.jumpTo(move)}>{description}</button>
                </li>
            ) 
        });

        let status;
        let winningSquares = null;
        if(winner){
            if(winner === 'draw'){
                status = 'Match is Draw';
            }
            else{
                status = 'Winner : ' + winner.winner;
                winningSquares = winner.winningSquares;
            }
        }
        else{
            status = 'Next Player : ' + (this.state.xIsNext ? 'X' : ' O');
        }
        return (
            <div className="container">
                <div className="container">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winningSquares = {winningSquares}/>
                </div>
                <div className="container">
                    <div className="container">{status}</div>
                    <div className="container">
                        <button className="btn btn-secondary" onClick={()=>this.handleSort()}>Reverse Moves list</button>
                    </div>
                    <ol>{this.state.isAscending ?  moves : moves.reverse()}</ol>
                </div>
            </div>
        );
    }
}


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
        return {
            winner : squares[a],
            winningSquares : lines[i],
        };
      }
    }
    for (let i = 0; i < squares.length; i++){
        if(!squares[i]){
            return null;
        }
    }
    return 'draw';
}


// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

