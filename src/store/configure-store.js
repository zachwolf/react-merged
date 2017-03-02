import rootReducer from '../ducks'
import { applyMiddleware, createStore } from 'redux'
import createLogger from 'redux-logger'

const logger = createLogger()

export default (initialState) => createStore(rootReducer, initialState, applyMiddleware(logger))