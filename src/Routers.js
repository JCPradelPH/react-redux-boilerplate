import React from 'react'
import {Switch, Route} from 'react-router-dom'
import {configureStore} from './redux/configureStore'
import {initialState,BASE_URL} from './js'

import Home from './containers/Home'
const {store, action} = configureStore(initialState())

export default class Routers extends React.Component{
  render(){
    return(
      <Switch>
        <Route exact path={`/`} render={ props => (
          <Home {...props} store={store} action={action} />
        ) } />
      </Switch>
    )
  }
}
