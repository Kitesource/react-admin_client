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
  render() {
    const user = memoryUtils.user;
    // 内存中没有存储user => 没有登录
    if (!user || !user._id) {
      // 自动跳转到登录(render())中
      return <Redirect to='/login' />
    }
    
    return (
      <Layout style={{ height: '100%' }}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{ backgroundColor: '#fff', margin:20 }}>
            <Switch>
              <Route path="/admin/home" component={Home}/>
              <Route path="/admin/category" component={Category}/>
              <Route path="/admin/product" component={Product}/>
              <Route path="/admin/role" component={Role}/>
              <Route path="/admin/user" component={User}/>
              <Route path="/admin/charts/bar" component={Bar}/>
              <Route path="/admin/charts/line" component={Line}/>
              <Route path="/admin/charts/pie" component={Pie}/>
              <Route path='/admin/order' component={Order}/>
              <Redirect to="/admin/home"/>
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center', color: '#666', backgroundColor:'#fff' }}>推荐使用谷歌浏览器，可以获取更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
