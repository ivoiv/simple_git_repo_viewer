import { createStore, compose, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from "redux-logger"
import frontpageReducer from "./ducks/frontpage"
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'

/*********************************
 * Store creator and exports
*********************************/

export const history = createBrowserHistory()

const reducers = combineReducers({
    frontpage: frontpageReducer
})

/**
 * Create the store with middleware
 */

const logger = createLogger()

const store = createStore(
  connectRouter(history)(reducers),
  compose(
   // applyMiddleware(routerMiddleware(history)),
    applyMiddleware(thunkMiddleware),
    applyMiddleware(logger), //Logger for debuging dispatch and state in console
    window.devToolsExtension ? window.devToolsExtension() : f => f //Console log and dev tooling

  )
)

/**
 * Export store
 */
export default store
