import React, { Component } from 'react';
import './GameTypeMenu.css';

class GameTypeMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<div className="wrapper">
				<div className="menu-box">
					{/* <h1>ЗОНА ПОРАЖЕНИЯ</h1> */}
					<h1>ТУПОЕ ДЕРЬМО ТУПОВО ДЕРЬМА</h1>
					<div className="buttons-box">
						<div ref="arcade" onClick={() => {this.props.updatePage('game', 'arcade')}} className="button">АРКАДА</div>
						<div ref="time" onClick={() => {this.props.updatePage('game', 'time')}} className="button">НА ВРЕМЯ</div>
					</div>
					<p>сделано дибилами для дибилов (с)</p>
				</div>
			</div>
		)
	}
}

export default GameTypeMenu;