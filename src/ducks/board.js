import { takeLatest } from 'redux-saga/effects'
import { placePiecesWorker } from './board/place-pieces'

// Actions
const PLACE_PIECE = 'react-merged/board/place-piece'

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case PLACE_PIECE:
      console.log('place piece', action.data)
      return state
    default:
      return state
  }
}

// Action Creators
export function placePiece (data) {
  return {
    type: PLACE_PIECE,
    data
  }
}


// Sagas
const PLACE_PIECES = 'react-merged/board/place-pieces'

export const placePieces = dropLocations => ({ type: PLACE_PIECES, dropLocations })

function* placePiecesWatcher () {
  yield takeLatest(PLACE_PIECES, placePiecesWorker)
}

export const sagas = [
  placePiecesWatcher
]
