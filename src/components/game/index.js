import React, { Component } from 'react'
import update from 'immutability-helper';
import { get } from 'lodash'
import './game.css'
import Board from '../board'
import Queue from '../queue'

export default class Game extends Component {
  state = {
    board: [
      [ 1, 2, 3, 4, 5 ],
      [ 6, 7, null, null, null ],
      [ null, null, null, null, null ],
      [ null, null, null, null, null ],
      [ null, null, null, null, null ],
    ],
    cursor: {
      isTracking: false,
      x: NaN,
      y: NaN,
    }
  }

  render () {
    const {
      board,
      cursor
    } = this.state

    return (
      <div className="game" { ...this.createEvents() }>
        <Board game={ board } />
        <Queue
          { ...cursor }
          board={ board }
        />
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
    onMouseOut: this.endCursorTracking,
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

  /*
  todo: drop piece at location
  tryPlacePiece () {
    console.log(this.state)
    this.setState({
      dropLocation: DEFAULT_DROP_LOCATION
    })
  }*/
}
