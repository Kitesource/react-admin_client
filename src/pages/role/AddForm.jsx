import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'
const Item = Form.Item;
/* 
  添加分类的form组件
*/
class AddForm extends Component {

  static propTypes = {
    setForm:PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
   
    const { getFieldDecorator } = this.props.form;
    // 指定Form.Item的布局
    const formItemLayout = {
      labelCol: { span: 4 }, //左侧label的宽度
      wrapperCol: { span: 15 } //右侧包裹的宽度
    }
    return (
      <Form {...formItemLayout}>
        <Item label="角色名称">
        {
            getFieldDecorator('roleName', {
              initialValue:'',
              rules:[
                {required:true, message:'角色名称不能为空'}
              ]
            })(
              <Input placeholder="请输入角色名称"></Input>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddForm)
