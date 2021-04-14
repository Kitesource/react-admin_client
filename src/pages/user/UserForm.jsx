import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select } from 'antd'
const Item = Form.Item;
const Option = Select.Option;
/* 
  添加分类的form组件
*/
class UserForm extends PureComponent {

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
    user: PropTypes.object
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const { roles, user } = this.props;
    const { getFieldDecorator } = this.props.form;
    // 指定Form.Item的布局
    const formItemLayout = {
      labelCol: { span: 4 }, //左侧label的宽度
      wrapperCol: { span: 15 } //右侧包裹的宽度
    }
    return (
      <Form {...formItemLayout}>
        <Item label="用户名">
          {
            getFieldDecorator('username', {
              initialValue: user.username,
              rules: [
                { required: true, message: '用户名不能为空' }
              ]
            })(
              <Input placeholder="请输入用户名"></Input>
            )
          }
        </Item>
        {
          user._id ? null : (
            <Item label="密码">
              {
                getFieldDecorator('password', {
                  initialValue: user.password,
                  rules: [
                    { required: true, message: '密码不能为空' }
                  ]
                })(
                  <Input type="password" placeholder="请输入用户名"></Input>
                )
              }
            </Item>
          )
        }
        <Item label="手机号">
          {
            getFieldDecorator('phone', {
              initialValue: user.phone,
              rules: [
                { required: true, message: '手机号不能为空' },
                { pattern: /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/, message: '手机号输入不合法!' },
              ]
            })(
              <Input placeholder="请输入手机号"></Input>
            )
          }
        </Item>
        <Item label="邮箱">
          {
            getFieldDecorator('email', {
              initialValue: user.email,
              rules: [
                { required: true, message: '邮箱不能为空' },
                { pattern: /^([a-zA-Z]|[0-9])(\w)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, message: '邮箱输入不合法!' },
              ]
            })(
              <Input placeholder="请输入邮箱"></Input>
            )
          }
        </Item>
        <Item label="角色">
          {
            getFieldDecorator('role_id', {
              initialValue: user.role_id,
              rules: [
                { required: true, message: '角色不能为空' }
              ]
            })(
              <Select>
                {
                  roles.map(role => <Option key={role._id}>{role.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UserForm)
