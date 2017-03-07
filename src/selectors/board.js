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

export const getBoard = state => get(state, 'board', [])

const __getBoardValueRange = flow([
  arrs => reduce(arrs, (res, nextArr) => res.concat(nextArr), []),
  uniq,
  vals => filter(vals, val => !isNil(val))
])

export const getHighestBoardValue = createSelector(
  getBoard,
  board => max(__getBoardValueRange(board))
)

export const getCellValue = (state, { x, y }) => {
  const board = getBoard(state)
  return get(board, [y, x])
}