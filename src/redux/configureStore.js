import {applyMiddleware, createStore, compose} from 'redux'
import {createApiMiddleware} from 'redux-module-builder/api'
import {bindActionCreatorsToStore} from 'redux-module-builder'
import thunk from 'redux-thunk'
import {createLogger} from 'redux-logger'

import {rootReducer, actions} from './rootReducer'

export const configureStore = ({ initialState = {} }) => {
  let middleware = [
    createApiMiddleware({ baseUrl: process.env.BASE_URL }),
    thunk
  ] //list of middlewares to be used

  const finalCreateStore = compose( applyMiddleware(...middleware) )(createStore) //create the store
  const store = finalCreateStore(rootReducer, initialState) //bind reducers and initialState into store
  let action = bindActionCreatorsToStore(actions, store) //bind actions to store
  return {store,action}
}
