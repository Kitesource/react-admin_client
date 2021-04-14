import React, { Component } from 'react'
import { Card, Form, Icon, Input, Cascader, Button, message } from 'antd'
import LinkButton from '../../components/LinkButton'
import { reqCategories, reqAddUpdateProduct } from '../../api/index'
import UploadImgs from './UploadImgs'
import RichTextEdit from './RichTextEdit'
/*
  产品的添加和更新子路由组件
*/
const { Item } = Form;
const { TextArea } = Input;


class AddUpdate extends Component {
  constructor(props) {
    super(props);
    this.uploadimgs = React.createRef();
    this.editor = React.createRef();
  }

  state = {
    options: [],
  }

  // 获取一级/二级分类列表
  getCategories = async (parentId) => {
    const res = await reqCategories(parentId);
    if (res.status === 0) {
      const categories = res.data;
      if (parentId === '0') {
        // 获取的是一级分类列表
        this.initOptions(categories);
      } else { //获取的是二级列表
        return categories //返回二级列表
      }
    }
  }
  initOptions = async (categories) => {
    // 根据categories生成options数组
    const options = categories.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false,
    }))

    // 如果是一个二级分类商品的更新
    const { isUpdate, product } = this;
    const { pCategoryId } = product;
    if (isUpdate && pCategoryId !== '0') {
      // 获取二级分类列表
      const subCategories = await this.getCategories(pCategoryId);
      // 生成二级下拉列表的options
      const childrenOptions = subCategories.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: false,
      }))
      // 找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value === pCategoryId)
      // 关联到对应的一级option
      targetOption.children = childrenOptions;
    }

    this.setState({ options })
  }

  // 用于cascader加载下一项的回调
  loadData = async selectedOptions => {
    // 得到选择的option对象
    const targetOption = selectedOptions[0];
    // 显示loading
    targetOption.loading = true;

    // 根据选中的分类，获取二级分类列表
    const subCategories = await this.getCategories(targetOption.value);
    // 隐藏loading
    targetOption.loading = false;
    // 生成一个二级列表的options
    if (subCategories && subCategories.length > 0) {
      const cOptions = subCategories.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))
      // 关联到当前option
      targetOption.children = cOptions;
    } else { //当前选中的分类没有二级分类
      targetOption.isLeaf = true;
    }

    // 更新状态
    this.setState({
      options: [...this.state.options],
    })
  }

  // 价格输入验证
  validatorPrice = (rule, value, callback) => {
    if (value * 1 > 0) {
      callback(); //验证通过
    } else {
      callback('价格必须大于0')
    }
  }

  // 点击提交
  submit = () => {
    //提交前 表单验证
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // 验证通过
        // 收集数据,并封装成product对象
        const {name, desc, price, categoryIds} = values;
        let pCategoryId, categoryId;
        if(categoryIds.length === 1){
          pCategoryId = '0';
          categoryId = categoryIds[0];
        } else{
          pCategoryId = categoryIds[0];
          categoryId = categoryIds[1];
        }
        const imgs = this.uploadimgs.current.getImgs();
        const detail = this.editor.current.getDetail();

        const product = {pCategoryId, categoryId, name, desc, price,imgs, detail};
        // 如果是更新需要添加_id
        if(this.isUpdate){
          product._id = this.product._id;
        }
        // 发送请求
        const res = await reqAddUpdateProduct(product);
        if(res.status === 0){
          message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`);
          this.props.history.goBack();
        } else {
          message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`);
        }
      }
    })
  }

  componentDidMount() {
    this.getCategories('0')
  }
  componentWillMount() {
    // 取出携带的state
    const { product } = this.props.location.state || {};
    // 保存一个是否是更新商品的标识 （product有值则是修改商品页面，isUpdate为true）
    this.isUpdate = !!product;
    // 保存产品对象信息
    this.product = product || {};
  }

  render() {
    const { isUpdate, product } = this;
    // 用来接收级联ID分类的数组
    const { pCategoryId, categoryId, imgs, detail } = product;
    const categoryIds = [];
    if (isUpdate) {
      // 商品是一个一级分类的商品
      if (pCategoryId === '0') {
        categoryIds.push(pCategoryId)
      } else {
        // 商品是一个二级分类的商品
        categoryIds.push(pCategoryId);
        categoryIds.push(categoryId);
      }
    }

    const title = (
      <span>
        <LinkButton onClick={() => { this.props.history.goBack() }}>
          <Icon type="arrow-left" style={{ fontSize: 20 }} />
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
      </span>
    )
    // 指定Form.Item的布局
    const formItemLayout = {
      labelCol: { span: 2 }, //左侧label的宽度
      wrapperCol: { span: 8 } //右侧包裹的宽度
    }

    const { getFieldDecorator } = this.props.form;
    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="商品名称" >
            {
              getFieldDecorator('name', {
                initialValue: product.name,
                rules: [
                  { required: true, message: '商品名称不能为空' }
                ]
              })(<Input placeholder="请输入商品名称" />)
            }
          </Item>
          <Item label="商品描述" >
            {
              getFieldDecorator('desc', {
                initialValue: product.desc,
                rules: [
                  { required: true, message: '商品描述不能为空' }
                ]
              })(<TextArea placeholder="请输入商品描述" autosize={{ minRows: 2, maxRows: 6 }} />)
            }
          </Item>
          <Item label="商品价格" >
            {
              getFieldDecorator('price', {
                initialValue: product.price,
                rules: [
                  { required: true, message: '商品价格不能为空' },
                  { validator: this.validatorPrice }
                ]
              })(<Input type="number" placeholder="请输入商品价格" addonAfter="元" />)
            }
          </Item>
          <Item label="商品分类" >
            {
              getFieldDecorator('categoryIds', {
                initialValue: categoryIds,
                rules: [
                  { required: true, message: '商品分类不能为空' },
                ]
              })(
                <Cascader
                  options={this.state.options}/* 需要显示的列表数据 */
                  loadData={this.loadData} /* 加载下一级列表的回调 */
                />
              )
            }
          </Item>
          <Item label="商品图片" >
            <UploadImgs ref={this.uploadimgs} imgs={imgs}/>
          </Item>
          <Item label="商品详情" labelCol={{span:2}} wrapperCol={{span:16}}>
            <RichTextEdit ref={this.editor} detail={detail}/>
          </Item>
          <Item>
            <Button type="primary" onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(AddUpdate)

/*
  子组件调用父组件的方法， 将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
  父组件调用子组件的方法，在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法
*/
