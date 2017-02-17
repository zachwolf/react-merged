import React, { Component, PropTypes } from 'react'
import './cell.css'

const CLASS_NAME_MAP = {
	1: 'cell--one',
	2: 'cell--two',
	3: 'cell--three',
	4: 'cell--four',
	5: 'cell--five',
	6: 'cell--six',
	7: 'cell--seven',
	default: 'cell--empty',
}

class Cell extends Component {
	static propTypes = {
		value: PropTypes.number,
		x: PropTypes.number,
		y: PropTypes.number,
		setDropLocation: PropTypes.func
	}

	render () {
		const {
			value,
			setDropLocation,
		} = this.props

		return (
			<div className={ this.getClassName() } onMouseEnter={ this.onMouseEnter }>
				<div className="aspect aspect--square">
					<div className="aspect__content">
						{ value }
					</div>
				</div>
			</div>
		)
	}

	onMouseEnter = () => {
		const { setDropLocation, y, x } = this.props

		if (setDropLocation) {
			setDropLocation(y, x)
		}
	}

	getClassName () {
		return `cell ${CLASS_NAME_MAP[this.props.value] || CLASS_NAME_MAP.default}`
	}
}

export default Cell