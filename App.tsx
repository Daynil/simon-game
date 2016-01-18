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
				<div className="color-block" id="green" style={this.getStatus('green')} onClick={() => this.props.game.activate('green')}></div>
				<div className="color-block" id="red" style={this.getStatus('red')} onClick={() => this.props.game.activate('red')}></div>
				<div className="color-block" id="blue" style={this.getStatus('blue')} onClick={() => this.props.game.activate('blue')}></div>
				<div className="color-block" id="yellow" style={this.getStatus('yellow')} onClick={() => this.props.game.activate('yellow')}></div>
				<div id="inner-circle" style={this.getInnerDimens()}>
					<span id="count">Count: {this.gameState.actionPattern.length}</span>
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
	
	gameState = {
		playerAction: false,
		actionPattern: ['green', 'red', 'yellow', 'blue'],
		board: {
			['green']: false, ['red']: false, ['yellow']: false, ['blue']: false
		}
	}
	
	sounds = {
		['green']: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'), 
		['red']: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'), 
		['yellow']: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'), 
		['blue']: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
	}
	
	constructor(refreshState) {
		this.refreshState = refreshState;
	}
	
	playPattern() {
		let patternIndex = 0;
		let pattern = this.gameState.actionPattern;
		let patternPlayback = window.setInterval(() => {
			if (patternIndex < pattern.length) {
				this.activate(pattern[patternIndex]);
				patternIndex++;
			} else window.clearInterval(patternPlayback);
		}, 1000)
	}
	
	activate(color: string) {
		this.gameState.board[color] = !this.gameState.board[color];
		this.sounds[color].play();
		this.refreshState();
		window.setTimeout(() => {
			this.gameState.board[color] = !this.gameState.board[color];
			this.refreshState();
		}, 300);
	}
}

export default App;