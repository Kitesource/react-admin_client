/* 
  用来进行local数据存储管理的工具模块
  store.js库 提供非常简洁的 API 来实现跨浏览器的本地存储功能
*/
import store from 'store'

const USER_KEY = 'user_key'

// 保存user
export function saveUser(user) {
  // localStorage.setItem(USER_KEY, JSON.stringify(user))
  store.set(USER_KEY, user);
}

// 读取user
export function getUser() {
  // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
  return store.get(USER_KEY) || {};
}

// 删除user
export function removeUser() {
  // localStorage.removeItem(USER_KEY)
  store.remove(USER_KEY);
}