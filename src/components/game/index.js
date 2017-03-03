import React, { Component } from 'react'
import { connect } from 'react-redux'
import update from 'immutability-helper'
import { get, isNull } from 'lodash'
import './game.css'
import Board from '../board'
import Queue from '../queue'
import * as queueHelpers from '../queue/helpers'

export default class Game extends Component {
  state = {
    cursor: {
      isTracking: false,
      x: NaN,
      y: NaN,
    },
    queue: {
      values: [],
    },
  }

  render () {
    const {
      board,
      cursor,
      queue,
    } = this.state

    return (
      <div className="game" { ...this.createEvents() }>
        <Board />
        <Queue
          { ...cursor }
          values={ queue.values }
          setQueueValues={ this.setQueueValues }
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

  setQueueValues = values => {
    this.setState(update(this.state, {
      queue: { $set: values }
    }))
  }
}
