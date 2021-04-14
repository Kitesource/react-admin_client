import React, { Component } from 'react'
import LinkButton from '../../components/LinkButton'
import { Card, Table, Button, Icon, message, Modal } from 'antd'
import { reqCategories, reqAddCategory, reqUpdateCategory } from '../../api/index'
import AddForm from './AddForm'
import UpdateForm from './UpdateForm'
import './index.less'

/* 商品分类路由 */
export default class Category extends Component {

  state = {
    isLoading: false,
    //一级分类列表
    categories: [], //一级列表数组
    subCategories: [], //二级列表数组
    parentId: '0', //当前需要显示的的分类列表的父分类id
    parentName: '', //当前显需要示的一级列表名称
    isVsible: 0, //标识添加、分类的确认框是否显示 0：都不显示， 1：显示添加，2：显示修改
  }

  // 初始化Table所有列的数组
  initColumns = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name', //显示对应的属性名
        key: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (category) => ( //返回需要显示的界面标签
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            {/* 向事件回调函数传递参数 */}
            {
              this.state.parentId === '0' ? (<LinkButton onClick={() => this.showSubCategories(category)}>查看子分类</LinkButton>) : null
            }
          </span>
        )
      }
    ]
  }
  /* 
    异步获取一级/二级列表
    parentId：如果没有指定参数根据state中的parentId请求，
  */
  getCategories = async (parentId) => {
    // 请求前显示loading
    this.setState({ isLoading: true })

    parentId = parentId || this.state.parentId;

    const res = await reqCategories(parentId);
    //请求成功后隐藏loading
    this.setState({ isLoading: false })
    // 取出分类数组（一级/二级）
    if (res.status === 0) {
      const categories = res.data;
      if (parentId === '0') {
        // 更新一级列表
        this.setState({ categories: categories })
      } else {
        // 更新二级列表状态
        this.setState({ subCategories: categories })
      }
    } else {
      message.error('获取分类列表失败')
    }
  }
  //点击查看子分类事件
  showSubCategories = (category) => {
    //调用setState()后，不能立即获取最新状态，需要传第二个参数
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => {
      // 调用函数获取二级分类列表
      this.getCategories();
    })
  }
  // 点击一级分类列表事件
  showCategories = () => {
    // 更新为一级列表显示
    this.setState({
      parentId: '0',
      parentName: '',
      subCategories: []
    })
  }
  // 显示添加确定框
  showAdd = () => {
    this.setState({ isVsible: 1 })
  }
  // 点击显示修改弹框
  showUpdate = (category) => {
    // 保存分类对象
    this.category = category;
    // 更新状态显示弹框
    this.setState({ isVsible: 2 })
  }
  // 隐藏确定框
  handleCancel = () => {
    this.form.resetFields();
    this.setState({ isVsible: 0 })
  }
  // 确认添加分类
  addCategory = () => {
    // 表单验证，通过才处理
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 隐藏弹窗
        this.setState({ isVsible: 0 })
        // 发送添加请求
        const { parentId, categoryName } = values;

        // 重置输入数据
        this.form.resetFields()

        const res = await reqAddCategory(categoryName, parentId);
        if (res.status === 0) {

          //添加的分类就是当前分类列表下的分类
          if (parentId === this.state.parentId) {
            // 重新获取分类列表显示
            this.getCategories();
          } else if (parentId === '0') { //在二级分类列表下添加一级分类
            this.getCategories('0')
          }
        }

      }
    })
  }
  // 确认修改分类
  updateCategory = () => {
    // 表单验证，通过才处理
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 1.隐藏弹框
        this.setState({ isVsible: 0 })

        const categoryId = this.category._id;
        const { categoryName } = values;

        // 重置输入数据
        this.form.resetFields()

        // 发送请求更新
        const res = await reqUpdateCategory({ categoryId, categoryName })
        if (res.status === 0) {
          // 重新心事列表
          this.getCategories();
        }
      }
    })
  }

  // 为第一次render() 准备数据
  UNSAFE_componentWillMount() {
    this.initColumns();
  }
  // 执行异步任务：发送ajax请求
  componentDidMount() {
    // 获取一级列表
    this.getCategories();
  }


  render() {
    const { categories, subCategories, isLoading, parentName, parentId, isVsible } = this.state;
    //读取指定的分类
    const category = this.category || {};

    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategories}>一级分类列表</LinkButton>
        <Icon type="arrow-right" style={{ marginRight: 5 }}></Icon>
        <span>{parentName}</span>
      </span>
    )
    const extra = (
      <Button type="primary" onClick={this.showAdd}><Icon type="plus" />添加</Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={isLoading}
          dataSource={parentId === '0' ? categories : subCategories}
          columns={this.columns}
          pagination={{ defaultPageSize: 7, showQuickJumper: true }}
        />
        {/* 添加分类 */}
        <Modal
          title="添加分类"
          visible={isVsible === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            categories={categories}
            parentId={parentId}
            setForm={(form) => { this.form = form }}
          />
        </Modal>

        {/* 修改分类 */}
        <Modal
          title="更新分类"
          visible={isVsible === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm
            categoryName={category.name}
            setForm={(form) => { this.form = form }}
          />
        </Modal>
      </Card>
    )
  }
}
