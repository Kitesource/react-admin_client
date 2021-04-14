import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd';
import memoryUtils from '../../utils/memoryUtils'

import './index.less'
import logo from '../../assets/images/fu.png'
import menuList from '../../config/menuConfig'

const { SubMenu } = Menu;

class LeftNav extends Component {

  // 判断当前登录用户对item是否有权限
  hasAuth = (item) => {
    const {key,isPublic} = item;

    const menus = memoryUtils.user.role.menus;
    const username = memoryUtils.user.username;
    // 1.如果当前用户是admin
    // 2.如果当前页面是公开的
    // 3.当前用户有此item的权限： key包含在menus中
    if(username === 'admin' || isPublic || menus.indexOf(key) !== -1){
      return true;
    } else if(item.children){ //4. 如果当前用户有此item的某个子item的权限
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)
    }
    return false;
  }

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
  getMenuNodes_reduce = (menuList) => {
    // 得到当前请求路径
    const path = this.props.location.pathname;

    return menuList.reduce((pre, item) => {
      // 如果当前用户有item对应的权限，才需要显示对应的菜单项
      if(this.hasAuth(item)){
        if (!item.children) {
          pre.push((
            <Menu.Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ))
        } else {
          // 查找一个与当前请求路径匹配的子item
          const cItem = item.children.find(cItem => cItem.key === path)
          if (cItem) {
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
      }
      return pre;
    }, [])
  }

  UNSAFE_componentWillMount() {
    this.getMenuNodes = this.getMenuNodes_reduce(menuList);
  }

  render() {
    // 得到当前请求路径
    const path = this.props.location.pathname;
    // 得到需要打开菜单项的key
    const openKey = this.openKey;
    return (
      <div className="left_nav">
        {/* 菜单头部 */}
        <Link to="/home" className="left_nav_header">
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