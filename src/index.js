import React from 'react'
import ReactDOM from 'react-dom'
import Game from './components/game'
import './assets/reset.css'
import {Provider} from 'react-redux'
import configureStore from './store/configure-store'

const store = configureStore()

ReactDOM.render(
	<Provider store={ store }>
	  <Game />
  </Provider>,
  document.getElementById('root')
)
