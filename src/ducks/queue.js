// Actions
const LOAD = 'react-merged/queue/LOAD'

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
  	case LOAD:
  		return { foo: 'bar' }
    default:
    	return state
  }
}

// Action Creators
export function TEMP_TEST_FN () {
  return { type: LOAD };
}
