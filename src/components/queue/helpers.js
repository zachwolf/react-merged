import { isNil } from 'lodash'

export const getLength = values => values.length === 1 && isNil(values[0][1]) ? 1 : 2

export const getFirstValue = values => values[0][0]