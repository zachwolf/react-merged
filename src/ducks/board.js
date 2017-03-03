import { select, takeLatest } from 'redux-saga/effects'

// Actions

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    default:
      return state
  }
}

// Action Creators
/*
export function setPiece ({ value, x, y }) {
  return {
    type: SET_PIECE,
    data: data
  }
}
*/

// Sagas
const PLACE_PIECE = 'react-merged/board/place-piece'

export const placePiece = dropLocation => ({ type: PLACE_PIECE, dropLocation })

function* placePieceWatcher () {
  yield takeLatest(PLACE_PIECE, placePieceWorker)
}

function* placePieceWorker ({ dropLocation }) {
  console.log(dropLocation);
  const state = yield select()
  console.log('state', state);
}

export const sagas = [
  placePieceWatcher
]
