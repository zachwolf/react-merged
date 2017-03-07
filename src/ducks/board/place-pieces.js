import { call, put, select } from 'redux-saga/effects'
import { placePiece } from '../board'
import { createNewQueue } from '../queue'
import selectors from '../../selectors'
import { every, isNull, isObject } from 'lodash'

/**
 * Checks if a dropped piece is at a valid locaction.
 * [1] Cell(s) need to be on the board
 * [2] Cell(s) under the piece need to be empty
 * 
 * @param {Object} options.dropLocations
 * @param {Number} options.dropLocations.y - 0 index position from top
 * @param {Number} options.dropLocations.x - 0 index position from left
 */
export function* placePiecesWorker ({ dropLocations }) {
  if (every(dropLocations, isObject)) { // [1]
    const valuesMap = yield dropLocations.map(dropLocation => {
      return select(state => selectors.board.getCellValue(state, dropLocation))
    })

    if (every(valuesMap, isNull)) { // [2]
      yield dropLocations.map(dropLocation => put(placePiece(dropLocation)))
      yield put(createNewQueue())
    }
  }
}