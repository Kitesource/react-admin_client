/* 
入口文件
*/
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'antd/dist/antd.css'


import {getUser} from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'
// 读取local存取的user,保存到内存中
const user = getUser();
memoryUtils.user = user;

ReactDOM.render(<App/>,document.getElementById('root'))