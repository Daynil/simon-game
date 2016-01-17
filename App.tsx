import * as React from 'react';

class App extends React.Component<any, any> {
	
	constructor() {
		super();
		this.state = {
			viewHeight: this.getSmallestViewportDimen()
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
	}
	
	handleResize(e) {
		this.setState({viewHeight: this.getSmallestViewportDimen()});
	}
	
	render() {
		return (
			<div>
				<div id="page-wrapper">
					<h1 id="title">Simon</h1>
					<Board viewHeight={this.state.viewHeight} />
				</div>
				<Foot />
			</div>
		)
	}
}

class Board extends React.Component<any, any> {
	
	// Dynamic size factor relative to window width
	boardFactor = 0.65;
	innerFactor = 0.30;
	
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
	
	render() {
		return (
			<div id="board" style={this.getBoardDimens()}>
				<div className="color-block" id="green"></div>
				<div className="color-block" id="red"></div>
				<div className="color-block" id="blue"></div>
				<div className="color-block" id="yellow"></div>
				<div id="inner-circle" style={this.getInnerDimens()}></div>
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

export default App;