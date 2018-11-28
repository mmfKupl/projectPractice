import React, { Component } from 'react';
import MainMenu from './Components/MainMenu/MainMenu';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPage: 'game'//main
		}
	}

	_updateCurrentPage(nextPage = 'main', value = '') {
		console.log('_____');
		this.setState({currentPage: nextPage});
	}

	render() {
		return (
			<MainMenu ref="MainMenu" updateCurrentPage={this._updateCurrentPage.bind(this)} currentPage={this.state.currentPage} />
		);
	}
}

export default App;
