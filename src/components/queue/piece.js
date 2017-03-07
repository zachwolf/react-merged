import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'

import selectors from '../../selectors'
import { rotate } from '../../ducks/queue'

import Cell from '../cell'

import './queue.css'

class QueuePiece extends Component {
  static propTypes = {
    isHeld: PropTypes.bool.isRequired,
    onRelease: PropTypes.func.isRequired,
    setIsHeld: PropTypes.func.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }

  state = {
    isPressed: false,
    isTouch: false,
    offset: {
      x: NaN,
      y: NaN,
    }
  }

  componentDidMount () {
    document.addEventListener('mouseout', this.onMouseExitPage)
  }

  componentWillUnmount () {
    document.removeEventListener('mouseout', this.onMouseExitPage)
  }

  render () {
    const { isHeld, values } = this.props

    this.cellElements = []

    return (
      <div className="queue__piece"
        { ...this.createEvents() }
        style={ this.generateStyles() }
      >
        { values.map((pieces, valueKey) => (
          <div key={ valueKey } className="queue__row">
            { pieces.map((piece, pieceKey) => (
              <Cell
                isHeld={ isHeld }
                key={ pieceKey }
                ref={ cell => { cell && this.cellElements.push(cell) } }
                value={ piece }
              />
            )) }
          </div>
        )) }
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
    const {
      isHeld,
      onRelease,
      rotate,
    } = this.props

    if (!isHeld) {
      rotate()
    } else {
      onRelease()
    }

    this.release()
  }

  trackCursor = e => {
    this.state.isPressed && this.props.setIsHeld(true)
  }

  onMouseExitPage = e => {
    if (e.relatedTarget === document.documentElement || e.relatedTarget === null) {
      this.release()
    }
  }

  release = e => {
    this.setState({
      isPressed: false,
    })
    this.props.setIsHeld(false)
  }

  generateStyles = () => {
    const {
      isHeld,
      x,
      y,
    } = this.props

    const {
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
})

export default connect(mapStateToProps, { rotate }, null, { withRef: true })(QueuePiece)
