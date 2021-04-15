/* 
  包含多个action creator 函数的模块
同步action: 对象 {type:'xxx', data:数据}
异步action: 函数 dispatch => {}
*/

import {SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG} from './action-types'
import {reqLogin} from '../api/index'
import { saveUser } from '../utils/storageUtils'
import { message } from 'antd'

// 设置头部标题的同步action
export const setHeadTitle = (headTitle) => ({type:SET_HEAD_TITLE, data: headTitle})

// 接收用户信息的同步action
export const receiveUser = (user) => ({type:RECEIVE_USER, user})

// 显示错误信息的同步action
export const showErrorMsg = (errorMsg) => ({type:SHOW_ERROR_MSG, errorMsg})


// 登录的异步action
export const login = (username, password) => {
  return  async dispatch => {
    // 1.执行异步ajax请求
    const res = await reqLogin(username, password);
    if(res.status === 0) {
      // 保存到local中
      saveUser(user);
      // 2 .1 如果成功，分发成功的同步action
      const user = res.data;
      dispatch(receiveUser(user));
    }else {
      //2.2 如果失败，分发失败的同步action
      const msg = res.msg;
      // dispatch(showErrorMsg(msg))
      message.error(msg);
    }

  }
}