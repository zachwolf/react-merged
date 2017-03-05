import { select } from 'redux-saga/effects'
import selectors from '../../selectors'

/**
 * Checks if a dropped piece is at a valid locaction.
 * [XX] Cell(s) under the piece need to be empty
 * [XX] Cell(s) need to be on the board
 * 
 * @param {Object} options.dropLocation
 * @param {Number} options.dropLocation.y - 0 index position from top
 * @param {Number} options.dropLocation.x - 0 index position from left
 */
export function* placePieceWorker ({ dropLocation }) {
  const { isRotatable } = yield select( state => ({
    isRotatable: selectors.queue.isRotatable(state), // remove?
    cellLocations: selectors.board.getCellLocations(state, dropLocation) // WIP
  }))
  
  if (isRotatable) {

  } else {

  }
  console.log('placePieceWorker', dropLocation)
}