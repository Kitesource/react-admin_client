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
        <Route path='/admin/product' component={Home} exact/>
        <Route path='/admin/product/addupdate' component={AddUpdate} />
        <Route path='/admin/product/detail' component={Detail} />
        <Redirect to='/admin/product'/>
      </Switch>
    )
  }
}
