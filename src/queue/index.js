import React, { Component, PropTypes } from 'react'

import Cell from '../cell'

class Queue extends Component {
	static propTypes = {
		setIsHeld: PropTypes.func,
		isHeld: PropTypes.bool.isRequired,
	}

	render () {
		return (
			<div onMouseDown={ this.hold } >
				{ this.props.isHeld && 'test' }
				<Cell value={ 1 } />
				<Cell value={ 2 } />
			</div>
		)
	}

	hold = () => {
		this.props.setIsHeld(true)
	}
}

export default Queue