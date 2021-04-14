import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd'

import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/LeftNav'
import Header from '../../components/Header'
import Home from '../home'
import Category from '../category'
import Role from '../role'
import User from '../user'
import Line from '../charts/line'
import Pie from '../charts/pie'
import Bar from '../charts/bar'
import Product from '../product';
import Order from '../order'

const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
  render () {
    const user = memoryUtils.user
    // 如果内存没有存储user ==> 当前没有登陆
    if(!user || !user._id) {
      // 自动跳转到登陆(在render()中)
      return <Redirect to='/login'/>
    }
    return (
      <Layout style={{minHeight: '100%'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{margin: 20, backgroundColor: '#fff'}}>
            <Switch>
              <Route path='/home' component={Home}/>
              <Route path='/category' component={Category}/>
              <Route path='/product' component={Product}/>
              <Route path='/user' component={User}/>
              <Route path='/role' component={Role}/>
              <Route path="/charts/bar" component={Bar}/>
              <Route path="/charts/pie" component={Pie}/>
              <Route path="/charts/line" component={Line}/>
              <Route path="/order" component={Order}/>
              <Redirect to='/home'/>
            </Switch>
          </Content>
          <Footer style={{textAlign: 'center', color: '#ccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
