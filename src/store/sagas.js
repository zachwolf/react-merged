import { sagas as boardSagas } from '../ducks/board'
import { sagas as queueSagas } from '../ducks/queue'

export default [
	...boardSagas,
	...queueSagas,
]