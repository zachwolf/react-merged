import {
	filter,
	flow,
	get,
	isNil,
  max,
  reduce,
  uniq,
} from 'lodash'

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