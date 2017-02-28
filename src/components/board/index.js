import React, { Component, PropTypes } from 'react'
import './board.css'

import Cell from '../cell'

export default class Board extends Component {
	static propTypes = {
		game: PropTypes.array.isRequired,
	}

	render () {
		const { game } = this.props

		return (
			<div className="board">
				{ game.map((row, rowKey) => {
					return (
						<div key={ rowKey } className="board__row">
							{ row.map((value, cellKey) =>
								<Cell
									key={ cellKey }
									value={ value }
									x={ cellKey }
									y={ rowKey }
								/>
							) }
						</div>
					)
				}) }
			</div>
		)
	}
}
