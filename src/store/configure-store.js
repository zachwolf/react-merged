import { forEach } from 'lodash'
import initialState from './initial-state'
import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import createLogger from 'redux-logger'

import rootReducer from '../ducks'
import sagas from './sagas'

const sagaMiddleware = createSagaMiddleware()
const logger = createLogger()

export default createStore(rootReducer, initialState, applyMiddleware(sagaMiddleware, logger))

forEach(sagas, saga => sagaMiddleware.run(saga))