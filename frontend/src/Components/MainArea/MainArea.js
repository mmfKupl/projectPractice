import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './MainArea.css'

class MainArea extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: 0,
			height: 0
		};
	}

	componentDidMount() { 
		this.setState({
			width: window.screen.availWidth,
			height: window.screen.availHeight
		})
	}
	
	render() {
		return (
			<div  height={this.state.height} width={this.state.width}>
				<canvas className="MainArea-wrapper" height={this.state.height} width={this.state.width}></canvas>
			</div>
		)
	}
}

export default MainArea;