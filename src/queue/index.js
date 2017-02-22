import React, { Component, PropTypes } from 'react'
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
import Cell from '../cell'
import './queue.css'

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
		x:  PropTypes.number.isRequired,
		y:  PropTypes.number.isRequired,
	}

	state = {
		isPressed: false,
		isHeld: false,
		values: [],
		offset: {
			x: NaN,
			y: NaN,
		}
	}

	componentDidMount () {
		this.generateValues()
	}

	render () {
		const {
			x,
			y,
		} = this.props

		const {
			isHeld,
			values,
			offset,
		} = this.state

    const styles = { 
      transform: isHeld ? `translate3d(${x - offset.x}px, ${y - offset.y}px, 0)` : null
    }

		return (
			<div className="queue"
				{ ...this.createEvents() }
				ref={ queue => this.queue = queue }
				style={ styles }
			>
				{ values.map((pieces, valueKey) => (
					<div key={ valueKey } className="queue__row">
						{ pieces.map((piece, pieceKey) => (
							<div key={ pieceKey } className="queue__cell">
								<Cell value={ piece } />
							</div>
						)) }
					</div>
				)) }
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

		this.setState({
			isPressed: false,
			isHeld: false,
		})
	}

	trackCursor = e => {
		this.state.isPressed && this.setState({
			isHeld: true,
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
		const { values } = this.state
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
		console.log(nextValues);

		this.setState({
			values: nextValues
		})
	}, 50)

	generateValues = () => {
		const range = __getBoardValueRange(this.props.board)
		const maxVal = max(range)

		let nextQueueLength = sample(weightedQueueLength)
		const possibleValues = __getWeightedPossibleValues(maxVal)

		const nextQueue = []

		while (nextQueueLength--) {
			nextQueue.push(sample(possibleValues))
		}

		this.setState({
			values: [ nextQueue ]
		})
	}
}

export default Queue