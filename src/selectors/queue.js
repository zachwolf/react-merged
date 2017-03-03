import { get } from 'lodash'

export const getQueue = state => get(state, 'queue', [])