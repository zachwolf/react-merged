import React, { Children, Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import selectors from '../../selectors'
import { createNewQueue } from '../../ducks/queue'

import Trash from '../trash'

import spinner from '../../assets/spinner.svg'
import './queue.css'

class QueueWrapper extends Component {
  state = {
    isHeld: false,
  }

  componentDidMount () {
    this.props.createNewQueue()
  }

  render () {
    const { children, createNewQueue, isRotatable } = this.props
    const { isHeld } = this.state

    const spinnerClassnames = classnames('queue__spinner', {
      'queue__spinner--is-faded': this.state.isHeld
    })

    return (
      <div className="queue">
        { Children.map(children, (child, index) => {
          return React.cloneElement(child, {
            isHeld,
            setIsHeld: this.setIsHeld,
          })
        }) }
        { isRotatable && (
          <div className={ spinnerClassnames }>
            <img src={ spinner } className="App-logo" alt="logo" />
          </div>
        ) }
        <div className="queue__aside">
          <Trash onDelete={ createNewQueue } />
        </div>
      </div>
    )
  }

  setIsHeld = isHeld => {
    this.setState({
      isHeld
    })
  }
}

const mapStateToProps = state => ({
  isRotatable: selectors.queue.isRotatable(state),
})

export default connect(mapStateToProps, {
  createNewQueue,
})(QueueWrapper)
