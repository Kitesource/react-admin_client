import React, { Component } from 'react'
import { Card, Select, Input, Button, Icon, Table, message } from 'antd'
import LinkButton from '../../components/LinkButton'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api/index'
import { PAGE_SIZE } from '../../utils/constants'
/* 
  procuct的默认子路由组件
*/
const Option = Select.Option;
export default class Home extends Component {

  state = {
    products: [],
    total: 0,//商品总数量
    isLoading: false,
    searchName: '', //搜索的关键字
    searchType: 'productName', //搜索类型
  }

  // 更新指定商品的状态
  updateStatus = async (productId, status) => {
    const res = await reqUpdateStatus({productId, status});
    if(res.status === 0){
      message.success('更新成功');
      this.getProducts(this.pageNum);
    }
  }

  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        width: 200,
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '￥' + price
      },
      {
        title: '状态',
        width: 100,
        render: (product) => {
          const {status,_id} = product;
          const newStatus = status===1 ? 2 : 1;
          return (
            <span>
              <Button type='primary' onClick={() => this.updateStatus(_id, newStatus)}>
                {status===1 ? '下架' : '上架'}
              </Button>
              <span>{status===1 ? '在售' : '已下架'}</span>
            </span>
          )
        }
      },
      {
        title: '操作',
        width: 100,
        render: (product) => {
          return (
            <span>
              {/* 将product对象使用state传递给目标路由组件 */}
              <LinkButton 
                onClick={() => {this.props.history.push('/admin/product/detail', {product} )}}
              >
              详情
              </LinkButton>
              
              <LinkButton 
                onClick={() => {this.props.history.push('/admin/product/addupdate', {product} )}}
              >
                修改
              </LinkButton>
            </span>
          )
        }
      },
    ];
  }
  // 获取指定野马的列表数据显示
  getProducts = async (pageNum) => {
    //保存pageNum,供updateStatus()方法使用
    this.pageNum = pageNum;
    this.setState({ isLoading: true })

    const {searchName,searchType} = this.state;
    // 如果搜索关键字有值，说明我们要进行搜索分页
    let result;
    if(searchName) {
      result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
    } else{
      //一般分页
      result = await reqProducts(pageNum, PAGE_SIZE);
    }
    this.setState({ isLoading: false })

    if (result.status === 0) {
      const { total, list } = result.data;
      this.setState({
        total,
        products: list
      })
    }
  }

  UNSAFE_componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getProducts(1);
  }

  render() {
    const { products, total, isLoading, searchName, searchType } = this.state;
    const title = (
      <span>
        <Select
          style={{ width: 150 }}
          value={searchType}
          onChange={value => this.setState({ searchType: value })}
        >
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{ width: 200, margin: '0 15px' }}
          value={searchName}
          onChange={event => this.setState({ searchName: event.target.value })}
        />
        <Button type='primary' onClick={()=> this.getProducts(1)}>搜索</Button>
      </span>
    )
    const extra = (
      <Button type="primary" onClick={()=>{this.props.history.push('/admin/product/addupdate')}}>
        <Icon type="plus" />
        添加商品
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey="_id"
          loading={isLoading}
          dataSource={products}
          columns={this.columns}
          pagination={{
            defaultPageSize: PAGE_SIZE,
            total,
            showQuickJumper: true,
            onChange: (pageNum) => { this.getProducts(pageNum) }
          }}
        />
      </Card>
    )
  }
}
