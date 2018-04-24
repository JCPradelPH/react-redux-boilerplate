import {combineReducers} from 'redux'

const containers = ['firebaseIntegration'] //list of modules that contains reducers and actions

const reducers = [] //container for reducers
export const actions = [] //container for actions

containers.forEach( container => {
  let c = require(`./modules/${container}`) //import each module
  reducers[container] = c.reducers //assign module's reducer into the reducers array container
  actions[container] = c.actions || [] //assign module's actions into the actions array container
} )

export const rootReducer = combineReducers(reducers) //combine and export reducers
