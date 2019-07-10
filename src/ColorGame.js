import React from 'react';
import './ColorGame.css';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css';
class Square extends React.Component {

    render() {
        return <div className='col-4 col-lg-2 col-md-3 mb-2'>
            <div onClick={this.props.onClick} className="square " style={{
                opacity: this.props.color.hidden ? '0' : '1',
                backgroundColor: this.props.color.toHex()
            }}></div>
        </div>;
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
        return <div className="row">
            {colors}
        </div>;
    }
}
export class ColorGame extends React.Component {
    timerID;
    totalLives = 5;
    constructor(props) {
        super(props);

        const difficulty = props.difficulty ? props.difficulty : 6;

        let highScore = localStorage.getItem('highScore') || 0;

        this.state = {
            difficulty: difficulty,
            colors: this.getColors(difficulty),
            selected: Math.round(Math.random() * (difficulty - 1)),
            lives: this.totalLives,
            score: 0,
            highScore: highScore,
            gameOver: false,
            mode: 'rgb'
        };
        this.newGame = this.newGame.bind(this);
        this.reset = this.reset.bind(this);
        this.switchMode = this.switchMode.bind(this);
    }
    switchMode() {
        const newMode = this.state.mode === 'rgb' ? 'hex' : 'rgb';
        this.setState({ mode: newMode });
    }
    newGame() {
        this.setState({ lives: this.totalLives, score: 0 });
        this.reset();
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
                score: this.state.score + 1
            });

            setTimeout(this.reset, 1000);
        } else {
            // wrong color
            let lives = this.state.lives - 1;

            colors[idx].hidden = true;
            this.setState({ colors: colors, lives: lives });

            if (lives <= 0) {
                this.gameOver();
            }
        }
    }
    gameOver() {
        if (this.state.score > this.state.highScore) {
            localStorage.setItem('highScore', this.state.score);
            this.setState({ highScore: this.state.score, gameOver: true });
            alert('New highscore!');
        } else {
            this.setState({ gameOver: true })
            alert('Game over!');
        }

        this.newGame();
    }
    getColors(difficulty) {
        let colors = [];
        for (let i = 0; i < difficulty; i++) {
            colors.push(randomColor());
        }
        return colors;
    }
    changeDifficulty(difficulty) {
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
        let color = this.state.colors[this.state.selected];

        return this.state.mode === 'rgb' ? color.toRgb() : color.toHex();
    }
    render() {
        let lives = [];
        for (let i = 0; i < this.totalLives; i++) {
            lives.push(
                <Heart key={i} broken={this.state.lives < i + 1}></Heart>
            );
        }

        return <div className='container'>
            <h3>highScore: {this.state.highScore}</h3>
            <h3>Score: {this.state.score}</h3>
            <h3>{lives}</h3>
            <h1 onClick={this.switchMode}>{this.displayColor()}</h1>
            <Board onClick={(color) => this.clicked(color)} colors={this.state.colors}></Board>
        </div>
    }
}

function Heart(props) {
    let classNames = ['fas', 'life'];
    if (props.broken) {
        classNames.push('fa-heart-broken', 'lightgray');
    } else {
        classNames.push('fa-heart', 'red');
    }
    return <i className={classNames.join(' ')}></i>;
}
