import React, { Component } from 'react';
import MainArea from './Components/MainArea/MainArea'

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ws: new WebSocket("ws://localhost:8999/")
		}

		this.state.ws.onopen = () => {
			console.log('подключились');
		}

		this.state.ws.onclose = () => {
			console.log('отключились');
		}

		this.state.ws.onmessage = (e) => {
			// console.log(`данные: ${e.data}`);
		}

		this.state.ws.onerror = (e) => {
			console.error(e)
		}
	}

	componentDidMount() {
	}

	render() {
		return (
			<MainArea ws={this.state.ws} ref="MainArea"></MainArea>
		);
	}
}

export default App;
