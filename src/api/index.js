/* 
   包含应用中所有接口请求函数的模块
   每个函数的返回值都是promise
   要求：根据接口文档定义接口请求函数
*/
import { message } from 'antd';
import jsonp from 'jsonp'
import ajax from './ajax'

// const BASEURL = 'http://localhost:5000'
const BASEURL = '';
// 登录
/* export function reqLogin(username.password) {
  return ajax('/login', {username,password}, 'POST')
} */

export const reqLogin = (username, password) => ajax(BASEURL + '/login', { username, password }, "POST")

// 添加用户
export const reqAddUser = (user) => ajax(BASEURL + '/manage/user/add', user, 'POST')

// jsonp请求的接口函数
export const reqWeather = (city) => {
  return new Promise((resolve) => {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&output=JSON&key=7a1316d9a46ad3f8f5e6a6dd2594f43b`
    jsonp(url, {}, (err, data) => {
      // 请求成功
      if (!err && data.status === '1') {
        resolve(data.lives[0]);
      } else { //请求失败
        message.error('获取天气信息失败');
      }
    })
  })
}