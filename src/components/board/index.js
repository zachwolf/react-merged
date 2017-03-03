import React, { Component } from 'react'
import { connect } from 'react-redux'
import selectors from '../../selectors'
import './board.css'
import { placePiece } from '../../ducks/board'

import Cell from '../cell'

class Board extends Component {
  render () {
    const { board } = this.props

    return (
      <div className="board">
        { board.map((row, rowKey) => {
          return (
            <div key={ rowKey } className="board__row">
              { row.map((value, cellKey) =>
                <Cell
                  key={ cellKey }
                  onCursorUp={ this.onCursorUp }
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

  onCursorUp = ({ x, y }) => {
    this.props.placePiece({x, y})
  }
}

const mapStateToProps = state => ({
  board: selectors.board.getBoard(state),
})

export default connect(mapStateToProps, {
  placePiece,
})(Board)
