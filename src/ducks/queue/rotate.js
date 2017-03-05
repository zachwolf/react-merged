import { put, select } from 'redux-saga/effects'
import { reverse } from 'lodash'
import selectors from '../../selectors'
import { setQueueValue } from '../queue'

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
export function* rotateQueueWorker () {
  const {
    flatQueue,
    isRotatable,
    isHorizontal,
  } = yield select(state => ({
    flatQueue: selectors.queue.getFlatQueue(state),
    isRotatable: selectors.queue.isRotatable(state),
    isHorizontal: selectors.queue.isHorizontal(state),
  }))
  
  if (isRotatable) { // [1]
    let nextValue

    if (isHorizontal) { // [2]
      nextValue = [
        [ flatQueue[0] ],
        [ flatQueue[1] ],
      ]
    } else { // [3]
      nextValue = [ reverse(flatQueue) ]
    }

    yield put(setQueueValue(nextValue))
  }
}