import React, { Component } from 'react'
import { connect } from 'react-redux'
import update from 'immutability-helper'
import { get, has, isEmpty, max, min, set } from 'lodash'

import selectors from '../../selectors'
import { placePieces } from '../../ducks/board'

import Cell from '../cell'
import QueueWrapper from '../queue/wrapper'
import QueuePiece from '../queue/piece'

import './game.css'

class Game extends Component {
  state = {
    cursor: {
      isTracking: false,
      x: NaN,
      y: NaN,
    },
  }

  render () {
    const { board } = this.props
    const { cursor } = this.state

    return (
      <div className="game" { ...this.createEvents() }>
        <div className="board">
          { board.map((row, rowKey) => (
            <div key={ rowKey } className="board__row">
              { row.map((value, cellKey) =>
                <Cell
                  key={ cellKey }
                  ref={ cell => has(cell, 'el') && set(this, ['boardCells', rowKey, cellKey], cell) }
                  value={ value }
                  x={ cellKey }
                  y={ rowKey }
                />
              ) }
            </div>
          )) }
        </div>
        <QueueWrapper>
          <QueuePiece
            { ...cursor }
            ref={ queuePiece => { this.queuePiece = queuePiece } }
            onRelease={ this.tryDropPiece.bind(this) }
          />
        </QueueWrapper>
      </div>
    )
  }

  createEvents = () => ({
    // touch screen events
    onTouchStart: this.startCursorTracking,
    onTouchEnd: this.endCursorTracking,
    onTouchMove: this.trackCursor,
    // mouse events
    onMouseDown: this.startCursorTracking,
    onMouseUp: this.endCursorTracking,
    onMouseMove: this.trackCursor,
  })

  startCursorTracking = e => {
    this.setState({
      cursor: {
        isTracking: true
      }
    })
    this.setXY(e)
  }

  endCursorTracking = e => {
    this.setState({
      cursor: {
        isTracking: true,
        x: NaN,
        y: NaN,
      }
    })
  }

  trackCursor = e => {
    this.setXY(e)
  }

  setXY = e => {
    // normalize mouse/touch events
    const pageX = e.pageX || get(e, 'touches[0].pageX', NaN)
    const pageY = e.pageY || get(e, 'touches[0].pageY', NaN)

    this.setState(update(this.state, {
      cursor: {
        x: { $set: pageX },
        y: { $set: pageY }
      }
    }))
  }

  setIsHeld = isHeld => {
    this.setState({
      isHeld: isHeld
    })
  }

  tryDropPiece = () => {
    const { flatQueue, placePieces } = this.props
    const boardCellElements = this.boardCells
    const queueCellElements = this.queuePiece.getWrappedInstance().cellElements

    const dropCells = queueCellElements.map((queueCell, queueIndex) => {
      const queueCellCoordinates = queueCell.el.getBoundingClientRect()
      const overlappingCells = []

      for (let rowIndex = 0; rowIndex < boardCellElements.length; rowIndex++) {
        for (let cellIndex = 0; cellIndex < boardCellElements[rowIndex].length; cellIndex++) {
          const { top, bottom, left, right } = boardCellElements[rowIndex][cellIndex].el.getBoundingClientRect()

          const yOverlap = max([
            0,
            min([queueCellCoordinates.bottom, bottom]) - max([queueCellCoordinates.top, top])
          ])

          const xOverlap = max([
            0,
            min([queueCellCoordinates.right, right]) - max([queueCellCoordinates.left, left])
          ])

          const totalOverlap = xOverlap * yOverlap / (queueCellCoordinates.height * queueCellCoordinates.width)

          if (totalOverlap > 0) {
            overlappingCells.push({
              percentage: totalOverlap,
              x: cellIndex,
              y: rowIndex,
            })
          }
        }
      }

      if (!isEmpty(overlappingCells)) {
        const bestOption = overlappingCells.reduce((prev, next) => prev.percentage > next.percentage ? prev : next)

        return {
          value: flatQueue[queueIndex],
          x: bestOption.x,
          y: bestOption.y,
        }
      }

      return null
    })

    placePieces(dropCells)
  }
}

const mapStateToProps = state => ({
  board: selectors.board.getBoard(state),
  flatQueue: selectors.queue.getFlatQueue(state),
})

export default connect(mapStateToProps, {
  placePieces,
})(Game)

