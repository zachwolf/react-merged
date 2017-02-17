import React, { Component } from 'react'
import './App.css'
import Board from './board.js'

class App extends Component {
  state = {
    board: [
      [ null, null, null, null, null ],
      [ null, null, null, null, null ],
      [ null, null, null, null, null ],
      [ null, null, null, null, null ],
      [ null, null, null, null, null ],
    ]
  }

  render() {
    return (
      <Board game={ this.state.board } />
    )
  }
}

export default App
