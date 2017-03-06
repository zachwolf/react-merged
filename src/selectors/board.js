import { createSelector } from 'reselect'
import {
	filter,
	flow,
	get,
	isNil,
  max,
  reduce,
  uniq,
} from 'lodash'
import selectors from '../selectors'

export const getBoard = state => get(state, 'board', [])

const __getBoardValueRange = flow([
  arrs => reduce(arrs, (res, nextArr) => res.concat(nextArr), []),
  uniq,
  vals => filter(vals, val => !isNil(val))
])

// TODO: reselect
export const getHighestBoardValue = state => {
	const board = getBoard(state)
	const range = __getBoardValueRange(board)
	return max(range)
}

export const getCellLocations = (state, originalLocation) => {
	const board = getBoard(state)
	const flatQueue = selectors.queue.getFlatQueue(state)
	const isRotatable = selectors.queue.isRotatable(state)
	const isHorizontal = selectors.queue.isHorizontal(state)

	flatQueue.forEach((val, index) => {
		// getCellLocation
	})
}