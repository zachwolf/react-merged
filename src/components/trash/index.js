// todo: re-enable after so many moves

import React, { Component, PropTypes } from 'react'
import './trash.css'

export default class Trash extends Component {
  static propTypes = {
    onDelete: PropTypes.func.isRequired
  }

  state = {
    isEnabled: true
  }

  render () {
    const {
      isEnabled
    } = this.state

    return (
      <div className="trash">
        <button className="trash__btn" onClick={ this.trashPiece } disabled={ !isEnabled }>
          <svg xmlns="http://www.w3.org/2000/svg" width="41" height="46" viewBox="0 0 82 92">
            <g fill={ isEnabled ? "#231F20" : "#666" }>
              <path d="M68.482 24v53.488c0 3.59-2.92 6.512-6.512 6.512H20.03c-3.59 0-6.513-2.92-6.513-6.512V24h54.965m8-8H5.518v61.488C5.518 85.502 12.015 92 20.028 92H61.97c8.016 0 14.512-6.497 14.512-14.512V16zM78 4H54.23c0-2.21-1.79-4-4-4H31.77c-2.21 0-4 1.79-4 4H4C1.79 4 0 5.79 0 8s1.79 4 4 4h74c2.21 0 4-1.79 4-4s-1.79-4-4-4zM24.277 80.382c-2.21 0-4-1.79-4-4v-45.49c0-2.21 1.79-4 4-4s4 1.79 4 4v45.49c0 2.21-1.79 4-4 4zM41.26 80.382c-2.21 0-4-1.79-4-4v-45.49c0-2.21 1.79-4 4-4s4 1.79 4 4v45.49c0 2.21-1.79 4-4 4zM58.242 80.382c-2.21 0-4-1.79-4-4v-45.49c0-2.21 1.79-4 4-4s4 1.79 4 4v45.49c0 2.21-1.79 4-4 4z"/>
            </g>
          </svg>
        </button>
      </div>
    )
  }

  trashPiece = e => {
    this.setState({
      isEnabled: false
    })
    this.props.onDelete()
  }
}
