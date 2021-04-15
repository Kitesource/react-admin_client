/* 
  用来根据旧的state和指定的action生成并返回新的state函数
*/
import { combineReducers } from 'redux'
import { getUser } from '../utils/storageUtils'
import { SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG } from './action-types'


// 用来管理头部标题的reducer函数
const initHeadTitle = '首页',
  headTitle = (state = initHeadTitle, action) => {
    switch (action.type) {
      case SET_HEAD_TITLE:
        return action.data
      default:
        return state;
    }
  }

// 用来管理登录用户的reducer函数
const initUser = getUser(),
  user = (state = initUser, action) => {
    switch (action.type) {
      case RECEIVE_USER:
        return action.user
      case SHOW_ERROR_MSG:
        const errorMsg = action.errorMsg;
        return {...state, errorMsg}
      default:
        return state;
    }
  }

// 向外默认暴露的是合并产总的reducer函数，管理的总的state的结构
export default combineReducers({
  headTitle,
  user
})