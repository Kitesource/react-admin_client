// 发送异步请求的函数模块
import axios from 'axios'
import {message} from 'antd'

export default function ajax(url, data = {}, methods = 'GET') {

  return new Promise((resolve, reject) => {
    let promise;
    // 1.执行异步ajax异步请求
    if (methods === 'GET') {
      promise = axios.get(url, {
        params: data //指定请求参数
      })
    } else { //post请求
      promise = axios.post(url, data);
    }
    // 2.成功的回调
    promise.then(response => {
      resolve(response.data);
    }).catch(error => { //3.失败了不调用reject,而是提示异常信息
      message.error('请求出错:'+error.message);
    })

  })


}