import board from './board.js'
import queue from './queue.js'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
	board,
  queue,
})

export default rootReducer