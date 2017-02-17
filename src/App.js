import React, { Component } from 'react'
import './App.css'
import Board from './board'
import Queue from './queue'

const DEFAULT_DROP_LOCATION = [ null, null ]

class App extends Component {
  state = {
    board: [
      [ 1, 2, 3, 4, 5 ],
      [ 6, 7, null, null, null ],
      [ null, null, null, null, null ],
      [ null, null, null, null, null ],
      [ null, null, null, null, null ],
    ],
    isHeld: false,
    dropLocation: DEFAULT_DROP_LOCATION
  }

  componentDidMount () {
    window.addEventListener('mouseup', this.release)
  }

  componentWillUnmount () {
    window.removeEventListener('mouseup', this.release)
  }

  render () {
    const {
      board,
      isHeld,
    } = this.state

    return (
      <div className="game">
        <Board game={ board } setDropLocation={ this.setDropLocation } />
        <Queue isHeld={ isHeld } setIsHeld={ this.setIsHeld } />
      </div>
    )
  }

  release = () => {
    this.setIsHeld(false)
    this.tryPlacePiece()
  }

  setIsHeld = isHeld => {
    this.setState({
      isHeld: isHeld
    })
  }

  setDropLocation = (y, x) => {
    this.setState({
      dropLocation: [ y, x ]
    })
  }

  tryPlacePiece () {
    console.log(this.state)
    this.setState({
      dropLocation: DEFAULT_DROP_LOCATION
    })
  }
}

export default App
