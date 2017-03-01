import React, { Component, PropTypes } from 'react'
import './board.css'

import Cell from '../cell'

export default class Board extends Component {
  static propTypes = {
    game: PropTypes.array.isRequired,
    onCursorUp: PropTypes.func.isRequired
  }

  render () {
    const { game, onCursorUp } = this.props

    return (
      <div className="board">
        { game.map((row, rowKey) => {
          return (
            <div key={ rowKey } className="board__row">
              { row.map((value, cellKey) =>
                <Cell
                  key={ cellKey }
                  onCursorUp={ onCursorUp }
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
