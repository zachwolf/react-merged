import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  debounce,
  get,
} from 'lodash'
import selectors from '../../selectors'
import classnames from 'classnames'
import Cell from '../cell'
import Trash from '../trash'
import './queue.css'
import spinner from '../../assets/spinner.svg'
import { getLength } from './helpers'
import {
  createNewQueue,
  rotate,
} from '../../ducks/queue'

class Queue extends Component {
  static propTypes = {
    x:  PropTypes.number.isRequired,
    y:  PropTypes.number.isRequired,
  }

  state = {
    isPressed: false,
    isHeld: false,
    isTouch: false,
    offset: {
      x: NaN,
      y: NaN,
    }
  }

  componentDidMount () {
    this.props.createNewQueue()
    document.addEventListener('mouseout', this.onMouseExitPage)
  }

  componentWillUnmount () {
    document.removeEventListener('mouseout', this.onMouseExitPage)
  }

  render () {
    const { isHeld } = this.state
    const { createNewQueue, values } = this.props

    const spinnerClassnames = classnames('queue__spinner', {
      'queue__spinner--is-faded': isHeld
    })

    return (
      <div className="queue">
        <div className="queue__piece"
          { ...this.createEvents() }
          style={ this.generateStyles() }
        >
          { values.map((pieces, valueKey) => (
            <div key={ valueKey } className="queue__row">
              { pieces.map((piece, pieceKey) => (
                <Cell
                  key={ pieceKey }
                  value={ piece }
                  isHeld={ isHeld }
                />
              )) }
            </div>
          )) }
        </div>
        { getLength(values) === 2 && (
          <div className={ spinnerClassnames }>
            <img src={ spinner } className="App-logo" alt="logo" />
          </div>
        ) }
        <div className="queue__aside">
          <Trash onDelete={ createNewQueue } />
        </div>
      </div>
    )
  }

  createEvents = () => ({
    // touch screen events
    onTouchStart: this.onTouchStart,
    onTouchEnd: this.onTouchEnd,
    onTouchMove: this.trackCursor,
    // mouse events
    onMouseDown: this.startCursorTracking,
    onMouseUp: this.endCursorTracking,
    onMouseMove: this.trackCursor,
  })

  onTouchStart = e => {
    this.setState({
      isTouch: true
    })
    this.startCursorTracking(e)
  }

  onTouchEnd = e => {
    this.setState({
      isTouch: false
    })
    this.endCursorTracking(e)
  }

  startCursorTracking = e => {
    this.setState({
      isPressed: true,
      offset: {
        x: e.pageX || get(e, 'touches[0].pageX', NaN),
        y: e.pageY || get(e, 'touches[0].pageY', NaN),
      }
    })
  }

  endCursorTracking = e => {
    if (!this.state.isHeld) {
      this.props.rotate()
    }

    this.release()
  }

  trackCursor = e => {
    this.state.isPressed && this.setState({
      isHeld: true,
    })
  }

  onMouseExitPage = e => {
    if (e.relatedTarget === document.documentElement) {
      this.release()
    }
  }

  release = e => {
    this.setState({
      isPressed: false,
      isHeld: false,
    })
  }

  generateStyles = () => {
    const {
      x,
      y,
    } = this.props

    const {
      isHeld,
      isTouch,
      offset,
    } = this.state

    const styles = {}

    if (isHeld) {
      let calculatedY = y - offset.y

      // if you're on touch screen, move the piece above your thumb
      if (isTouch) {
        calculatedY -= 60
      }

      styles.transform = `translate3d(${x - offset.x}px, ${calculatedY}px, 0)`
    }

    return styles
  }
}

const mapStateToProps = state => ({
  values: selectors.queue.getQueueValues(state),
  highestBoardValue: selectors.board.getHighestBoardValue(state)
})

export default connect(mapStateToProps, {
  createNewQueue,
  rotate,
})(Queue)
