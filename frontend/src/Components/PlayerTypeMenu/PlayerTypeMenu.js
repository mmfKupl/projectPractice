import React, { Component } from 'react';
import './PlayerTypeMenu.css';

class PlayerTypeMenu extends Component {
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
					<h1>ТУПОЕ ДЕРЬМО ТУПОГО ДЕРЬМА</h1>
					<div className="buttons-box">
						<div ref="single" onClick={() => {this.props.updatePage('choosePlayer', 'single')}} className="button">ОДИНОЧНЫЙ</div>
						<div ref="multy" onClick={() => {this.props.updatePage('choosePlayer', 'multy')}} className="button">МУЛЬТИПЛЕЕР</div>
					</div>
					<p>сделано дибилами для дибилов (с)</p>
				</div>
			</div>
		)
	}
}

export default PlayerTypeMenu;