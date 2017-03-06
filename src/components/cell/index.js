import React, { Component, PropTypes } from 'react'
import { isBoolean, isNil, reduce } from 'lodash'
import classnames from 'classnames'
import './cell.css'

const CLASS_NAME_MAP = {
  1: 'cell--one',
  2: 'cell--two',
  3: 'cell--three',
  4: 'cell--four',
  5: 'cell--five',
  6: 'cell--six',
  7: 'cell--seven',
  default: 'cell--empty',
}

const isSequential = (...vals) => 
  !!reduce(vals, (prev, next) =>
    isBoolean(prev) ?
      prev :
      prev < next ?
        next :
        false
  )

export default class Cell extends Component {
  static propTypes = {
    isHeld: PropTypes.bool,
    value: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }

  render () {
    const {
      value,
    } = this.props

    return (
      <div
        className={ this.getClassName() }
        ref={ el => { this.el = el } }
      >
        { value }
      </div>
    )
  }

  getClassName () {
    const { isHeld, value } = this.props
    const cellNumber = CLASS_NAME_MAP[value]

    return classnames('cell', {
      [cellNumber]: !isNil(cellNumber),
      'cell--empty': isNil(cellNumber),
      'cell--is-held': isHeld,
    })
  }
}
