import { takeLatest } from 'redux-saga/effects'
import { set } from 'lodash'

// Actions
const SET_QUEUE_VALUE = 'react-merged/queue/set-queue-value'

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case SET_QUEUE_VALUE:
      return set(state, 'value', action.data)
    default:
      return state
  }
}

// Action Creators
export const setQueueValue = value => ({ type: SET_QUEUE_VALUE, data: value })

// Sagas
const CREATE_NEW_QUEUE = 'react-merged/queue/create-new-queue'

export const createNewQueue = () => ({ type: CREATE_NEW_QUEUE })

function* createNewQueueWatcher () {
  yield takeLatest(CREATE_NEW_QUEUE, createNewQueueWorker)
}

function* createNewQueueWorker () {

}
// rotate queue

export const sagas = [
  createNewQueueWatcher,
]
