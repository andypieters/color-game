import React from 'react';
import './ColorGame.css';
class Square extends React.Component {

    render() {
        return <div onClick={this.props.onClick} className="square" style={{
            opacity: this.props.color.hidden ? '0' : '1',
            backgroundColor: this.props.color.toHex()
        }}></div>;
    }
}

class Color {
    r = 0;
    g = 0;
    b = 0;
    hidden = false;

    constructor(r, g, b) {
        this.r = r;
        this.b = b;
        this.g = g;
    }

    toRgb() {
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    }
    toHex() {
        return "#" +
            this.r.toString(16).padStart(2, '0') +
            this.g.toString(16).padStart(2, '0') +
            this.b.toString(16).padStart(2, '0');
    };
}
function randomColor() {
    return new Color(
        Math.round(Math.random() * 255),
        Math.round(Math.random() * 255),
        Math.round(Math.random() * 255),
        255
    );
}
class Board extends React.Component {

    render() {
        let i = 0;
        let colors = this.props.colors.map((color => {
            i++;
            return <Square key={i} color={color} onClick={() => this.props.onClick(color)} />;
        }
        ));
        return <div className="board">
            {colors}
        </div>;
    }
}
export class ColorGame extends React.Component {
    timerID;
    constructor(props) {
        super(props);

        const difficulty = props.difficulty ? props.difficulty : 6;

        this.state = {
            difficulty: difficulty,
            colors: this.getColors(difficulty),
            selected: Math.round(Math.random() * (difficulty - 1)),
            lives: 3,
            score: 0,
            currentScore: difficulty,
            gameOver: false,
        };
        this.newGame = this.newGame.bind(this);
        this.reset = this.reset.bind(this);
    }
    newGame() {
        this.setState({ lives: 3, score: 0 });
        this.reset();
    }
    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            10000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        if (this.state.currentScore === 1) return;
        this.setState({
            currentScore: this.state.currentScore - 1
        });
    }

    clicked(color) {
        if (this.state.lives <= 0) return;
        let colors = this.state.colors.slice();
        const idx = colors.indexOf(color);

        if (idx === this.state.selected) {
            // correct color
            colors.fill(color, 0, this.state.difficulty);

            this.setState({
                colors: colors,
                score: this.state.score + this.state.currentScore
            });

            setTimeout(this.reset, 1000);
        } else {
            // wrong color
            let lives = this.state.lives - 1;

            colors[idx].hidden = true;
            this.setState({ colors: colors, lives: lives });

            if (lives <= 0 && this.props.onGameOver) {
                this.props.onGameOver(this.state.score);
            } 
        }
    }

    getColors(difficulty) {
        let colors = [];
        for (let i = 0; i < difficulty; i++) {
            colors.push(randomColor());
        }
        return colors;
    }
    changeDifficulty(difficulty) {
        console.log(difficulty);
        this.setState({
            difficulty: difficulty,
            colors: this.getColors(difficulty),
            selected: Math.round(Math.random() * (difficulty - 1))
        });
    }
    reset() {
        this.setState({
            colors: this.getColors(this.state.difficulty),
            selected: Math.round(Math.random() * (this.state.difficulty - 1)),
            currentScore: this.state.difficulty
        });
    }
    displayColor() {
        return this.state.colors[this.state.selected] ? this.state.colors[this.state.selected].toRgb() : '?';
    }
    render() {
        return <div>
            <input type="range" min='2' max='15' value={this.state.difficulty} onChange={(e) => this.changeDifficulty(e.target.value)} ></input>
            {this.state.lives <= 0 ? <button onClick={this.newGame}>New Game</button> : null}
            <h3>{this.displayColor()}</h3>
            <h3>Current: {this.state.currentScore}</h3>
            <h3>Score: {this.state.score}</h3>
            <h3>Lives: {this.state.lives}</h3>
            <Board onClick={(color) => this.clicked(color)} colors={this.state.colors}></Board>
        </div>
    }
}