import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import formatTime from '../../utils/dateUtils'
import LinkButton from '../../components/LinkButton'
import { reqDeleteUsers, reqUsers, reqAddUpdateUsers } from '../../api/index'
import UserForm from './UserForm'

export default class User extends Component {

  state = {
    users: [], //所有用户列表
    roles: [], //所有角色列表
    isVsible: false, //是否显示弹框
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formatTime
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => this.roleNames[role_id]
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        )
      },
    ]
  }
  // 根据role的数组，生成所有角色名称的对象(属性名为角色id值：属性值为角色name)
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name;
      return pre;
    }, {})
    this.roleNames = roleNames;
  }

  getUsers = async () => {
    const res = await reqUsers();
    if (res.status === 0) {
      const { users, roles } = res.data;
      this.initRoleNames(roles);
      this.setState({ users, roles })
    }
  }
  
  // 添加或更新用户
  AddUpdateUser = async () => {
    // 1.收集表单数据
    this.form.validateFields(async (err, values) => {
      if (!err) {
        const user = values;
        this.form.resetFields();
        // 如果是更新，需要给user指定_id属性
        if(this.user) {
          user._id = this.user._id;
          delete user.password;
        } 

        // 2.发送请求
        const res = await reqAddUpdateUsers(user);
        if (res.status === 0) {
          message.success(`${this.user ?'修改':'添加'}用户成功`)
          // 3.更新列表显示
          this.getUsers();
        }
        // 隐藏弹窗
        this.setState({ isVsible: false })
      }
    })
  }

  // 删除指定用户
  deleteUser = (user) => {
    Modal.confirm(
      {
        title: `确认删除${user.username}吗?`,
        onOk: async () => {
          const res = await reqDeleteUsers(user._id);
          if (res.status === 0) {
            message.success(`删除用户${user.username}成功`)
            this.getUsers();
          }
        }
      }
    )
  }
  // 显示修改界面
  showUpdate = (user) => {
    // 保存user对象信息
    this.user = user;
    this.setState({isVsible:true})
  }
  // 显示添加界面
  showAdd = () => {
    this.user = null;
    this.setState({isVsible:true})
  }

  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getUsers()
  }

  render() {
    const { users, isVsible, roles } = this.state;
    const user = this.user || {};
    const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>
    return (
      <div>
        <Card title={title}>
          <Table
            bordered
            rowKey='_id'
            dataSource={users}
            columns={this.columns}
            pagination={{ defaultPageSize: 6, showQuickJumper: true }}
          />

          {/* 添加用户 */}
          <Modal
            title={user._id ? '修改用户' : '添加用户' }
            visible={isVsible}
            onOk={this.AddUpdateUser}
            onCancel={() => { 
              this.form.resetFields()
              this.setState({ isVsible: false })
             }}
          >
            <UserForm 
              setForm={form => this.form = form} 
              roles={roles}
              user={user}
              />
          </Modal>
        </Card>
      </div>
    )
  }
}
