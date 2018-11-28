import React, { Component } from 'react';
import GameCore from './GameCore';
import './MainArea.css';
import uniqid from 'uniqid';

class MainArea extends Component {
	constructor(props) {
		super(props);

		this.state = {
			width: 0,
			height: 0,
			data: {}
		};
	}

	_onMouseMove(e) {
		GameCore.setPosition(e.clientX, e.clientY);
	}

	_onMouseDown(e) {
		GameCore.startFire();
	}

	_onMouseUp(e) {
		GameCore.stopFire();
	}

	componentDidMount() { 
		let width = window.screen.availWidth,
			height = window.screen.availHeight;
		this.setState({
			width: width,
			height: height + 39
		}, () => {
			GameCore.init('kek', this.refs['MainArea-canvas'], this.state.width, this.state.height, uniqid('ID'));
		})
	}

	
	render() {
		return (
			<div height={this.state.height} width={this.state.width}>
				<canvas 
					onMouseMove={this._onMouseMove.bind(this)} 
					onMouseDown={this._onMouseDown.bind(this)}
					onMouseUp={this._onMouseUp.bind(this)}
					ref="MainArea-canvas" 
					className="MainArea-wrapper" 
					height={this.state.height} 
					width={this.state.width}
				></canvas>
			</div>
		)
	}
}

export default MainArea;