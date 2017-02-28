import React, { Component, PropTypes } from 'react'
import { isNil } from 'lodash'
import classnames from 'classnames'
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

export default class Cell extends Component {
	static propTypes = {
		isHeld: PropTypes.bool,
		value: PropTypes.number,
		x: PropTypes.number,
		y: PropTypes.number,
	}

	render () {
		const {
			value,
		} = this.props

		return (
			<div className={ this.getClassName() }>
				{ value }
			</div>
		)
	}

	getClassName () {
		const { isHeld, value } = this.props
		const cellNumber = CLASS_NAME_MAP[value]

		return classnames('cell', {
			[cellNumber]: !isNil(cellNumber),
			'cell--empty': isNil(cellNumber),
			'cell--is-held': isHeld,
		})

		// return `cell ${CLASS_NAME_MAP[this.props.value] || CLASS_NAME_MAP.default}`
	}
}
