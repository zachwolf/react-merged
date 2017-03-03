import { get } from 'lodash'
import { createSelector } from 'reselect'

export const getQueue = state => get(state, 'queue', [])

export const getQueueValues = createSelector(
	getQueue,
	queue => {
    console.log('getQueueValues', queue)
    return get(queue, 'values')
  }
)