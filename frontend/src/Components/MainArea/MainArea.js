import React, { Component } from 'react';
import GameCore from './GameCore';
import './MainArea.css';

class MainArea extends Component {
	constructor(props) {
		super(props);

		this.state = {
			width: 0,
			height: 0,
			ws: props.ws,
			data: {}
		};
	}

	_onMouseMove(e) {
		this.state.ws.send(JSON.stringify({
			x: e.clientX,
			y: e.clientY
		}))
	}

	async _getMainImage() {
		return fetch('/api/getMainImage', { method: 'GET' })
			.then(res => res.blob())
			.then(data => data);
	}

	componentDidMount() { 
		let width = window.screen.availWidth,
			height = window.screen.availHeight;
		this.setState({
			width: width,
			height: height,
			GameCore: new GameCore(this.refs['MainArea-canvas'], width, height)
		}, () => {
			this.state.GameCore.init();
		})
	}

	
	render() {
		return (
			<div height={this.state.height} width={this.state.width}>
				<canvas onMouseMove={this._onMouseMove.bind(this)} ref="MainArea-canvas" className="MainArea-wrapper" height={this.state.height} width={this.state.width}></canvas>
			</div>
		)
	}
}

export default MainArea;