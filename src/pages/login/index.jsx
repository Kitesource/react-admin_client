import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import {
  Form,
  Icon,
  Input,
  message,
  Button,
} from 'antd';

import './login.less'
import logo from '../../assets/images/logo.png'
import { reqLogin, } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import {saveUser} from '../../utils/storageUtils'

class Login extends Component {

  handleSubmit = (e) => {
    // 阻止事件默认行为
    e.preventDefault();

    // 对所有表单字段进行校验
    this.props.form.validateFields(async (err, values) => {
      // 校验成功
      if (!err) {
        // 请求登录
        const { username, password } = values;
        const res = await reqLogin(username, password);
        if(res.status === 0){
          // 登录成功
          message.success('登录成功');

          // 保存用户信息
          const user = res.data;
          memoryUtils.user = user; //保存在自定义内存中
          saveUser(user); //保存到local中

          // 跳转
          this.props.history.replace('/admin')

        }else{
          // 登录失败
          message.error(res.msg)
        }
      } else {
        console.log('校验失败');
      }
    });
  }

  // 对密码进行自定义验证
  validatePwd = (rule, value, callback) => {
    if (!value) {
      callback('密码必须输入!')
    } else if (value.length < 4) {
      callback('密码长度不能小于4位')
    } else if (value.length > 12) {
      callback('密码长度不能小于12位')
    } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
      callback('密码必须是英文、数字或下划线组成!')
    } else {
      callback();
    }
  }

  render() {
    // 判断用户已经登录
    const user = memoryUtils.user;
    if(user && user._id){
      return <Redirect to='/admin'/>
    }

    // 得到一个强大的form对象
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="" />
          <h1>React项目:后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {
                getFieldDecorator('username', {
                  // 声明式验证，直接别人定义好的规则进行验证
                  rules: [
                    { required: true, whitespace: true, message: '用户名必须输入!' },
                    { min: 3, message: '用户名至少3位' },
                    { max: 12, message: '用户名最多12位!' },
                    { pattern: /^[a-zA-Z0-9]+$/, message: '用户名必须是英文、数字或下划线组成!' },
                  ],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名" />,
                )
              }
            </Form.Item>

            <Form.Item>
              {
                getFieldDecorator('password', {
                  rules: [
                    {
                      validator: this.validatePwd
                    }
                  ],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码" />,
                )
              }
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }

}

// 包装Form组件,生成新组件向Form组件传递一个对象form
const WrapLogin = Form.create()(Login);
export default WrapLogin;
