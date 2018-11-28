import React, { Component } from 'react';
import './MainMenu.css';
import GameTypeMenu from '../GameTypeMenu/GameTypeMenu';
import PlayerTypeMenu from '../PlayerTypeMenu/PlayerTypeMenu';
import MainArea from '../MainArea/MainArea';


class MainMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		if(this.props.currentPage === 'main') {
			return (
				<PlayerTypeMenu updatePage={(nextPage, value) => this.props.updateCurrentPage(nextPage, value)} />
			)
		} 

		if(this.props.currentPage === 'choosePlayer') {
			return (
				<GameTypeMenu updatePage={(nextPage, value) => this.props.updateCurrentPage(nextPage, value)} />
			)
		}

		if(this.props.currentPage === 'game') {
			return (
				<MainArea />
			)
		}

		return (
			<h1>ТРАБЛ БАБЛ</h1>
		)

	}
}

export default MainMenu;