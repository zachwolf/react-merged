import { select } from 'redux-saga/effects'
import selectors from '../../selectors'

/**
 * Checks if a dropped piece is at a valid locaction.
 * [XX] Cell(s) under the piece need to be empty
 * [XX] Cell(s) need to be on the board
 * 
 * @param {Object} options.dropLocations
 * @param {Number} options.dropLocations.y - 0 index position from top
 * @param {Number} options.dropLocations.x - 0 index position from left
 */
export function* placePiecesWorker ({ dropLocations }) {
  console.log('placePieceWorker', dropLocations)

  // dropLocations.map(dropLocation => {
    // const { cellValue } = yield select(state => ({
    //   cellValue: selectors.board.getCellValue(state, dropLocations[0])
    // }))
    // debugger
  // })
  // const valuesMap = yield dropLocations.map(dropLocation => {
  //   return select(state => selectors.board.getCellValue(state, dropLocation))
  // })

  // console.log(valuesMap)
}