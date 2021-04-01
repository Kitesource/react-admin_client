/* 
  应用根组件
*/
import React, { Component } from 'react'
import { BrowserRouter, Redirect, Route, Switch, } from 'react-router-dom'

import Login from './pages/login'
import Admin from './pages/admin'


export default class App extends Component {


  render() {
    return (
      <BrowserRouter>
        <Switch>{/*只匹配其中一个 */}
          <Route path='/login' component={Login}></Route>
          <Route path='/admin' component={Admin}></Route>
          <Redirect to='/login'/>
        </Switch>
      </BrowserRouter>
    )
  }
}
