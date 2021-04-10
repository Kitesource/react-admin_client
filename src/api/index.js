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

// 获取一级、二级分类
export const reqCategories = (parentId) => ajax(BASEURL + '/manage/category/list', {parentId}, 'GET')

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASEURL + '/manage/category/add', { categoryName, parentId }, 'POST')
// 更新分类
export const reqUpdateCategory = ({ categoryName, categoryId }) => ajax(BASEURL + '/manage/category/update', { categoryName, categoryId }, 'POST')
// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASEURL + '/manage/product/list', { pageNum, pageSize }, 'GET')
/* 
根据条件搜素产品列表
seacrchType 搜索类型，productName/productDesc
*/
export const reqSearchProducts = ({pageNum, pageSize,searchName,searchType}) => 
ajax(BASEURL + '/manage/product/search', {pageNum, pageSize, [searchType]:searchName})

// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASEURL + '/manage/category/info', {categoryId})

// 更新商品状态（上架/下架）
export const reqUpdateStatus = ({productId,status}) => ajax(BASEURL + '/manage/product/updateStatus', {productId,status}, 'POST')

// 删除图片
export const reqDeleteImg = (name) => ajax(BASEURL + '/manage/img/delete', {name}, 'POST')

// 添加/修改商品
export const reqAddUpdateProduct = (product) => 
ajax(BASEURL + '/manage/product/'+ (product._id ? 'update' : 'add'), product, 'POST')

//获取所有角色列表
export const reqRoles = () => ajax(BASEURL + '/manage/role/list', 'GET')
// 添加角色
export const reqAddRoles = (roleName) => ajax(BASEURL + '/manage/role/add',{roleName}, 'POST')
