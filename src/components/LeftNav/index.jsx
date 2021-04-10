import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd';

import './index.less'
import logo from '../../assets/images/logo.png'
import menuConfig from '../../config/menuConfig'

const { SubMenu } = Menu;

class LeftNav extends Component {

  // 根基menu的数据生成对应的标签数组
  /* 
    使用map() + 递归调用
  */
  /* getMenuNodes_map = (menuConfig) => {
    return menuConfig.map(item => {
      if(!item.children) {
        return(
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      }else{
        return(
          <SubMenu
            key={item.key}
            title={
            <span>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </span>}>
            {this.getMenuNodes_map(item.children)}
          </SubMenu>
        )
      }
    })
  } */
  /* 
    使用reduce() + 递归调用
  */
  getMenuNodes_reduce = (menuConfig) => {
    // 得到当前请求路径
    const path = this.props.location.pathname;

    return menuConfig.reduce((pre,item)=> {
      if(!item.children){
        pre.push((
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        ))
      }else{
        // 查找一个与当前请求路径匹配的子item
       const cItem = item.children.find(cItem => cItem.key === path)
       if(cItem){
         this.openKey = item.key;
       }

        pre.push((
          <SubMenu
            key={item.key}
            title={
            <span>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </span>}>
            {this.getMenuNodes_reduce(item.children)}
          </SubMenu>
        ))
      }

      return pre;
    }, [])
  }

  UNSAFE_componentWillMount() {
    this.getMenuNodes = this.getMenuNodes_reduce(menuConfig)
  }

  render() {
    // 得到当前请求路径
    const path = this.props.location.pathname;
    // 得到需要打开菜单项的key
    const openKey = this.openKey;
    return (
      <div className="left_nav">
        {/* 菜单头部 */}
        <Link to="/admin/home" className="left_nav_header">
          <img src={logo} alt="atguigu" />
          <h1>硅谷后台</h1>
        </Link>

        {/* 菜单内容 */}
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          {
            this.getMenuNodes
          }
        </Menu>
      </div>
    )
  }
}
/* 
  高阶组件，包装非路由组件，返回一个新组件
    新的组件向非路由组件传递3个属性：history/location
*/

export default withRouter(LeftNav);