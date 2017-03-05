import { flattenDeep, get } from 'lodash'
import { createSelector } from 'reselect'

export const getQueue = state => get(state, 'queue', [])

export const getQueueValues = createSelector(
	getQueue,
	queue => get(queue, 'values')
)

export const getFlatQueue = createSelector(
  getQueueValues,
  values => flattenDeep(values)
)

export const getQueueLength = createSelector(
  getFlatQueue,
  queues => queues.length
)

export const isRotatable = createSelector(
  getQueueLength,
  length => length === 2
)

export const isHorizontal = createSelector(
  getQueueValues,
  values => values.length === 1 && values[0].length === 2
)
