import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Input } from 'antd'
const Item = Form.Item;
const Option = Select.Option;
/* 
  添加分类的form组件
*/
class AddForm extends Component {

  static propTypes = {
    categories:PropTypes.array.isRequired, //用来传递form对象的函数
    parentId:PropTypes.string.isRequired, //一级分类的数组
    setForm:PropTypes.func.isRequired //父分类id
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
   
    const {categories,parentId} = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Item>
          {
            getFieldDecorator('parentId', {
              initialValue:parentId
            })(
              <Select>
                <Option value="0">一级分类</Option>
                {
                  categories.map(c => <Option value={c._id}>{c.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
        <Item>
        {
            getFieldDecorator('categoryName', {
              initialValue:'',
              rules:[
                {required:true, message:'分类名称不能为空'}
              ]
            })(
              <Input placeholder="请输入分类名称"></Input>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddForm)
