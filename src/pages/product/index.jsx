import React, { Component } from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Home from './Home'
import AddUpdate from './AddUpdate'
import Detail from './Detail'
import './index.less'

export default class Product extends Component {
  render() {
    return (
      <Switch>
        {/* exact 开启路径完全匹配 */}
        <Route path='/product' component={Home} exact/>
        <Route path='/product/addupdate' component={AddUpdate} />
        <Route path='/product/detail' component={Detail} />
        <Redirect to='/product'/>
      </Switch>
    )
  }
}
