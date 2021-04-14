import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Tree } from 'antd'
import menuList from '../../config/menuConfig'
const Item = Form.Item;
const { TreeNode } = Tree;
/* 
  添加分类的form组件
*/
export default class AuthForm extends Component {
  
  static propTypes ={
    role: PropTypes.object
  }

  constructor(props) {
    super(props);

    // 根据传入的角色的menus生成初始状态
    const {menus} = this.props.role;
    this.state = {
      checkedKeys:menus,
    }
  }

  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      );
      return pre;
    },[])
  }
  // 选中某个node节点回调
  onCheck = (checkedKeys, info) => {
    this.setState({checkedKeys})
  }

  // 为父组件提供最新menus的方法
  getMenus = () => {
    return this.state.checkedKeys;
  }

  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList);
  }
  // 组件接收到新的props时调用
  componentWillReceiveProps(nextProps) {
    const menus = nextProps.role.name;
    this.setState({
      checkedKeys:menus
    })
  }

  render() {
    const {role} = this.props;
    const {checkedKeys} = this.state;
    // 指定Form.Item的布局
    const formItemLayout = {
      labelCol: { span: 4 }, //左侧label的宽度
      wrapperCol: { span: 15 } //右侧包裹的宽度
    }
    return (
      <Form {...formItemLayout}>
        <Item label="角色名称">
          <Input value={role.name} disabled/>
        </Item>

        <Tree
          checkable
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
        <TreeNode title="平台权限" key="all">
          {this.treeNodes}
        </TreeNode>
      </Tree>
      </Form>
    )
  }
}
