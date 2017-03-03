import { put, select } from 'redux-saga/effects'
import {
  filter,
  flow,
  includes,
  map,
  reduce,
  sample,
} from 'lodash'
import selectors from '../../selectors'
import { setQueueValue } from '../queue'

// a queue can be one or two piece, but the two pieces should be more common
// this creates a weighted random
const WEIGHTED_QUEUE_LENGTH = [
  1, 1, 1,
  2, 2, 2, 2, 2, 2, 2
]

// when there are high value pieces on the board, in order to increase
// difficulty, lower pieces should be more likely
const WEIGHTED_PIECE_VALUES = [
  { value: 1, weight: [1, 1, 1, 1, 1, 1, 1, 1, 1] },
  { value: 2, weight: [2, 2, 2, 2, 2, 2, 2] },
  { value: 3, weight: [3, 3, 3, 3, 3] },
  { value: 4, weight: [4, 4, 4, 4] },
  { value: 5, weight: [5, 5, 5] },
  { value: 6, weight: [6, 6] },
  { value: 7, weight: [7] },
]

const __getWeightedPossibleValues = flow([
  (maxVal, nextQueue) => filter(WEIGHTED_PIECE_VALUES, piece => piece.value <= maxVal && !includes(nextQueue, piece.value)),
  possibleValuesMap => map(possibleValuesMap, val => val.weight),
  possibleValueWeights => reduce(possibleValueWeights, (res, nextWeight) => res.concat(nextWeight), []),
  sample 
])

export function* createNewQueueWorker () {
  const highestBoardValue = yield select(selectors.board.getHighestBoardValue)
  let nextQueueLength = sample(WEIGHTED_QUEUE_LENGTH)

  const nextQueue = []

  while (nextQueueLength--) {
    nextQueue.push(__getWeightedPossibleValues(highestBoardValue, nextQueue))
  }

  yield put(setQueueValue([ nextQueue ]))
}
