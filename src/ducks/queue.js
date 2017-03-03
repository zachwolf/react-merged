import { set } from 'lodash'

// Actions
const SET_DROP_LOCATION = 'react-merged/queue/set-drop-location'

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
  	case SET_DROP_LOCATION:
  		return set(state, 'dropLocation', action.data)
    default:
    	return state
  }
}

// Action Creators
export function setDropLocation (data) {
	return {
		type: SET_DROP_LOCATION,
		data
	}
}
