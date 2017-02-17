import React, { Component, PropTypes } from 'react'
import './board.css'

import Cell from '../cell'

class Board extends Component {
	static propTypes = {
		game: PropTypes.array.isRequired,
		setDropLocation: PropTypes.func.isRequired,
	}

	render () {
		const { game, setDropLocation } = this.props

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
									setDropLocation={ setDropLocation }
								/>
							) }
						</div>
					)
				}) }
			</div>
		)
	}
}

export default Board