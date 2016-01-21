import * as React from 'react';

class App extends React.Component<any, any> {
	
	game: Game;
	
	constructor() {
		super();
		this.game = new Game(this.refreshState.bind(this));
		this.state = {
			viewHeight: this.getSmallestViewportDimen(),
			gameState: this.game.gameState
		};
	}
	
	getSmallestViewportDimen(): number {
		if (window.innerHeight < window.innerWidth) return window.innerHeight;
		else return window.innerWidth;
	}
	
	componentWillMount() {
		//this.setDimensions();
	}
	
	componentDidMount() {
		window.addEventListener('resize', (e) => this.handleResize(e));
		this.game.playPattern();
	}
	
	handleResize(e) {
		this.setState({viewHeight: this.getSmallestViewportDimen()});
	}
	
	refreshState() {
		this.setState({gameState: this.state.gameState});
	}
	
	render() {
		return (
			<div>
				<div id="page-wrapper">
					<h1 id="title">Simon</h1>
					<Board 
						viewHeight={this.state.viewHeight}
						gameState={this.state.gameState}
						game={this.game} />
				</div>
				<Foot />
			</div>
		)
	}
}

class Board extends React.Component<any, any> {
	
	gameState;
	
	// Dynamic size factor relative to window width
	boardFactor = 0.65;
	innerFactor = 0.30;
	
	buttonColors = {
		['green']: "hsl(130, 70%, 45%)",
		['greenActive']: "hsl(130, 70%, 70%)",
		['red']: "hsl(5, 70%, 45%)",
		['redActive']: "hsl(5, 70%, 70%)",
		['blue']: "hsl(210, 70%, 45%)",
		['blueActive']: "hsl(210, 70%, 70%)",
		['yellow']: "hsl(60, 70%, 45%)",
		['yellowActive']: "hsl(60, 90%, 75%)"
	}
	
	constructor(props) {
		super(props);
		this.gameState = this.props.gameState;
	}
	
	getBoardDimens() {
		return {
			width: this.props.viewHeight * this.boardFactor,
			height: this.props.viewHeight * this.boardFactor
		}
	}
	
	getInnerDimens() {
		let displacement = (this.props.viewHeight * this.boardFactor)/2 
							- (this.props.viewHeight * this.innerFactor)/2;
		return {
			width: this.props.viewHeight * this.innerFactor, 
			height: this.props.viewHeight * this.innerFactor,
			top: displacement,
			left: displacement
		}
	}
	
	getStatus(color: string) {
		let returnColor = this.buttonColors[color];
		if (this.gameState.board[color]) returnColor = this.buttonColors[`${color}Active`];
		return {
			backgroundColor: returnColor
		}
	}
	
	render() {
		return (
			<div id="board" style={this.getBoardDimens()}>
				<div className="color-block" id="green" style={this.getStatus('green')} onClick={() => this.props.game.playerTest('green')}></div>
				<div className="color-block" id="red" style={this.getStatus('red')} onClick={() => this.props.game.playerTest('red')}></div>
				<div className="color-block" id="blue" style={this.getStatus('blue')} onClick={() => this.props.game.playerTest('blue')}></div>
				<div className="color-block" id="yellow" style={this.getStatus('yellow')} onClick={() => this.props.game.playerTest('yellow')}></div>
				<div id="inner-circle" style={this.getInnerDimens()}>
					<div id="controls">
						<span id="count">Count: {this.gameState.actionPattern.length}</span>
						<div>
							<span id="start" onClick={() => this.props.game.startGame()}>Start</span>
							<span id="reset" onClick={() => this.props.game.reset()}>Reset</span>
						</div>
						<div>
							<span id="strict"><span id="strict-light"></span>Strict</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

class Foot extends React.Component<any, any> {
	render() {
		return (
			<div id="foot">
				<div id="foot-text">
					Created with ♥ by <a href="https://github.com/Daynil/">Daynil</a> for <a href="http://www.freecodecamp.com/">FCC</a>
					<br/><a id="gh-link" href="https://github.com/Daynil/tictactoe-react">
					<i className="fa fa-github-square fa-lg"></i>
					Github repo
					</a>
				</div>
			</div>
		);
	}
}

class Game {
	
	refreshState;
	patternPlayback;
	
	gameState = {
		playerAction: false,
		playerPattern: [],
		actionPattern: [],
		board: {
			['green']: false, ['red']: false, ['yellow']: false, ['blue']: false
		}
	}
	
	sounds = {
		['green']: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'), 
		['red']: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'), 
		['yellow']: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'), 
		['blue']: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
		['mistake']: new Audio('http://res.cloudinary.com/dz9rf4hwz/video/upload/v1453320543/error_ecvn1v.wav')
	}
	
	constructor(refreshState) {
		this.refreshState = refreshState;
	}
	
	playerTest(color: string) {
		if (!this.gameState.playerAction) return;
		this.gameState.playerPattern.push(color);
		let currMove = this.gameState.playerPattern.length-1;
		if (this.gameState.playerPattern[currMove] == this.gameState.actionPattern[currMove]) {
			this.activate(color, true);
			if (this.gameState.playerPattern.length == this.gameState.actionPattern.length) {
				this.gameState.playerAction = false;
				this.gameState.playerPattern = [];
				this.nextRound();
			}
		} else {
			this.activate(color, false);
			this.sounds['mistake'].play();
			this.gameState.playerAction = false;
			this.gameState.playerPattern = [];
			this.playPattern();
		}
	}
	
	startGame() {
		// Start button does nothing once game is underway
		if (this.gameState.actionPattern.length > 0 ) return;
		this.nextRound();
	}
	
	nextRound() {
		let possibleMoves = ['green', 'red', 'yellow', 'blue'];
		let randomMove = possibleMoves[Math.floor(Math.random()*4)];
		this.gameState.actionPattern.push(randomMove);
		this.playPattern();
	}
	
	playPattern() {
		let patternIndex = 0;
		let pattern = this.gameState.actionPattern;
		let levelSpeed = 1000 - (this.gameState.actionPattern.length*30);
		let startPlayback = () => {
			this.patternPlayback = window.setInterval(() => {
				if (patternIndex < pattern.length) {
					this.activate(pattern[patternIndex], true);
					patternIndex++;
				} else {
					window.clearInterval(this.patternPlayback);
					this.gameState.playerAction = true;
				}
			}, levelSpeed);
		}
		window.setTimeout(startPlayback, this.gameState.actionPattern.length*30+100);
	}
	
	startPlayback() {
		
	}
	
	activate(color: string, playSound: boolean) {
		this.gameState.board[color] = !this.gameState.board[color];
		if (playSound) {
			this.sounds[color].load();
			this.sounds[color].play();
		}
		this.refreshState();
		window.setTimeout(() => {
			this.gameState.board[color] = !this.gameState.board[color];
			this.refreshState();
		}, 300);
	}
	
	reset() {
		window.clearInterval(this.patternPlayback);
		this.gameState.actionPattern = [];
		this.gameState.playerAction = false;
		this.gameState.playerPattern = [];
		this.refreshState();
	}
}

export default App;