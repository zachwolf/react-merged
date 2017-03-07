import update from 'immutability-helper'
import { takeLatest } from 'redux-saga/effects'
import { placePiecesWorker } from './board/place-pieces'

// Actions
const PLACE_PIECE = 'react-merged/board/place-piece'

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case PLACE_PIECE:
      console.log('place piece', action.data)
      return update(state, {
        [action.data.y]: {
          [action.data.x]: { $set: action.data.value }
        }
      })
    default:
      return state
  }
}

// Action Creators
export const placePiece = data => ({ type: PLACE_PIECE, data })

// Sagas
const PLACE_PIECES = 'react-merged/board/place-pieces'

export const placePieces = dropLocations => ({ type: PLACE_PIECES, dropLocations })

function* placePiecesWatcher () {
  yield takeLatest(PLACE_PIECES, placePiecesWorker)
}

export const sagas = [
  placePiecesWatcher
]
