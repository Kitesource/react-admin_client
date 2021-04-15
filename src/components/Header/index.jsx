import React, { Component, } from 'react'
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'

import formateTime from '../../utils/dateUtils.js'
import memoryUtils from '../../utils/memoryUtils'
import {removeUser} from '../../utils/storageUtils'
import menuConfig from '../../config/menuConfig'
import { reqWeather } from '../../api'
import {Modal} from 'antd'
import LinkButton from '../../components/LinkButton'
import './index.less'

class Header extends Component {

  state = {
    currentTime: formateTime(new Date()),
    city: '',//地点
    weather: '', //天气
    temperature: '', //温度
  }

  getTime = () => {
    this.timer = setInterval(() => {
      const currentTime = formateTime(new Date());
      this.setState({ currentTime })
    }, 1000)
  }
  getWeather = async () => {
    const res = await reqWeather('赣州');
    const { city, weather, temperature } = res;
    this.setState({ city, weather, temperature })
  }

  getTitle = () => {
    // 得到当前请求路径
    const path = this.props.location.pathname
    let title
    menuConfig.forEach(item => {
      if (item.key===path) { // 如果当前item对象的key与path一样,item的title就是需要显示的title
        title = item.title
      } else if (item.children) {
        // 在所有子item中查找匹配的
        const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
        // 如果有值才说明有匹配的
        if(cItem) {
          // 取出它的title
          title = cItem.title
        }
      }
    })
    return title
  }
  // 退出登录
  logout = (event) => {
    event.preventDefault();
    Modal.confirm({
      content:'确定退出吗？',
      onOk: ()=> {
        // 删除保存的数据
        removeUser();
        memoryUtils.user = {};
        // 跳转到登录
        this.props.history.replace('/login');
      }

    })
  }

  /* 第一次render() 之后执行 */
  componentDidMount() {
    // 获取当前时间
    this.getTime();
    // 获取天气信息
    this.getWeather();
  }
  componentWillUnmount(){
    // 清楚定时器
    clearInterval(this.timer);
  }

  render() {
    const { currentTime, city, weather, temperature } = this.state;
    const username = memoryUtils.user.username;
    // const title = this.getTitle();
    const title = this.props.headTitle;
    return (
      <div className="header">
        <div className="header_top">
          <span>欢迎，{username}</span>
          {/* <a href='/#' onClick={this.logout}>退出</a> */}
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header_bottom">
          <div className="header_bottom_left">{title}</div>
          <div className="header_bottom_right">
            <span>{currentTime}</span>
            <span>{city}</span>
            <span>{temperature}℃</span>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({headTitle:state.headTitle}),
  {}
)(withRouter(Header)) 