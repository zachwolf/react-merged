import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  debounce,
  filter,
  flow,
  get,
  map,
  max,
  isNil,
  reduce,
  sample,
  uniq,
} from 'lodash'
import classnames from 'classnames'
import Cell from '../cell'
import Trash from '../trash'
import './queue.css'
import spinner from '../../assets/spinner.svg'
import { getLength } from './helpers'
import { TEMP_TEST_FN } from '../../ducks/queue'

const __getBoardValueRange = flow([
  arrs => reduce(arrs, (res, nextArr) => res.concat(nextArr), []),
  uniq,
  vals => filter(vals, val => !isNil(val))
])

// a queue can be one or two piece, but the two pieces should be more common
// this creates a weighted random
const weightedQueueLength = [
  1, 1, 1,
  2, 2, 2, 2, 2, 2, 2
]

// when there are high value pieces on the board, in order to increase
// difficulty, lower pieces should be more likely
const weightedPieceValuesMap = [
  { value: 1, weight: [1, 1, 1, 1, 1, 1, 1, 1, 1] },
  { value: 2, weight: [2, 2, 2, 2, 2, 2, 2] },
  { value: 3, weight: [3, 3, 3, 3, 3] },
  { value: 4, weight: [4, 4, 4, 4] },
  { value: 5, weight: [5, 5, 5] },
  { value: 6, weight: [6, 6] },
  { value: 7, weight: [7] },
]

const __getWeightedPossibleValues = flow([
  maxVal => filter(weightedPieceValuesMap, piece => piece.value <= maxVal),
  possibleValuesMap => map(possibleValuesMap, val => val.weight),
  possibleValueWeights => reduce(possibleValueWeights, (res, nextWeight) => res.concat(nextWeight), [])
])

class Queue extends Component {
  static propTypes = {
    board: PropTypes.array.isRequired,
    setQueueValues: PropTypes.func.isRequired,
    values: PropTypes.array.isRequired,
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
    this.generateValues()
    document.addEventListener('mouseout', this.onMouseExitPage)
    this.props.TEMP_TEST_FN()
  }

  componentWillUnmount () {
    document.removeEventListener('mouseout', this.onMouseExitPage)
  }

  render () {
    const { isHeld } = this.state
    const { values } = this.props

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
            <img src={spinner} className="App-logo" alt="logo" />
          </div>
        ) }
        <div className="queue__aside">
          <Trash onDelete={ this.generateValues } />
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
      this.rotate()
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

  /**
   * Pieces are stored as an array of one or two arrays
   *
   * [ [A] ]      - single cell
   * [ [A, B] ]   - two cells in their originally generated position
   * [ [A], [B] ] - two cells turned 90degs
   * [ [B, A]]    - two cells turned 180degs
   * [ [B], [A] ] - two cells turned 270degs
   *
   * [1] a single cell can't be rotated
   * [2] a row with two cells needs to be split into two rows
   * [3] a split row needs to be concatinated
   */
  rotate = debounce(() => {
    const { setQueueValues, values } = this.props
    let nextValues
    
    if (values.length === 1) { // [1]
      const nestedValues = values[0]
      if (nestedValues.length === 1) { // [1]
        nextValues = values 
      } else { // [2]
        nextValues = [
          [ nestedValues[0] ],
          [ nestedValues[1] ]
        ]
      }
    } else { // [3]
      nextValues = [
        [ values[1][0], values[0][0] ]
      ]
    }

    setQueueValues({
      values: nextValues
    })
  }, 50)

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

  generateValues = () => {
    const range = __getBoardValueRange(this.props.board)
    const maxVal = max(range)

    let nextQueueLength = sample(weightedQueueLength)
    const possibleValues = __getWeightedPossibleValues(maxVal)

    const nextQueue = []

    while (nextQueueLength--) {
      nextQueue.push(sample(possibleValues))
    }

    this.props.setQueueValues({
      values: [ nextQueue ]
    })
  }
}

export default connect(null, {
  TEMP_TEST_FN: TEMP_TEST_FN
})(Queue)
