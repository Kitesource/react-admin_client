/* 
入口文件
*/
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'antd/dist/antd.css'
import {Provider} from 'react-redux'

import store from './redux/store'
import { getUser } from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'

// 读取local存取的user,保存到内存中
const user = getUser();
memoryUtils.user = user;

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'))