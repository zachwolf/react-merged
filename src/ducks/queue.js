import { takeLatest } from 'redux-saga/effects'
import { createNewQueueWorker } from './queue/create-new-queue'
import { rotateQueueWorker } from './queue/rotate'
// Actions
const SET_QUEUE_VALUE = 'react-merged/queue/set-queue-value'

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case SET_QUEUE_VALUE:
      return {
        ...state,
        values: action.data
      }
    default:
      return state
  }
}

// Action Creators
export const setQueueValue = value => ({ type: SET_QUEUE_VALUE, data: value })

// Sagas
// Create New Queue
const CREATE_NEW_QUEUE = 'react-merged/queue/create-new-queue'

export const createNewQueue = () => ({ type: CREATE_NEW_QUEUE })

function* createNewQueueWatcher () {
  yield takeLatest(CREATE_NEW_QUEUE, createNewQueueWorker)
}

// Rotate Queue
const ROTATE_QUEUE = 'react-merged/queue/rotate'

export const rotate = () => ({ type: ROTATE_QUEUE })

function* rotateWatcher () {
  yield takeLatest(ROTATE_QUEUE, rotateQueueWorker)
}

export const sagas = [
  createNewQueueWatcher,
  rotateWatcher,
]
