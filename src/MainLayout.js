import React from 'react'
import {BrowserRouter} from 'react-router-dom'
import Routers from './Routers'
export default class MainLayout extends React.Component{

  render(){
    return(
      <BrowserRouter>
        <Routers />
      </BrowserRouter>
    )
  }
}
