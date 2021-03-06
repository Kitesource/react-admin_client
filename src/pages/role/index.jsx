import React, { Component } from 'react'
import { Card, Button, Table,Modal, message } from 'antd'
import { reqRoles,reqAddRoles,reqUpdateRoles } from '../../api/index'
import memoryUtils from '../../utils/memoryUtils'
import {removeUser} from '../../utils/storageUtils'
import formatTime from '../../utils/dateUtils'
import AddForm from './AddForm'
import AuthForm from './AuthForm'

export default class Role extends Component {

  state = {
    roles: [],//所有角色的列表
    role: {}, //选中的role,
    isShowAdd:false,
    isShowAuth:false, 
  }

  auth = React.createRef();

  initColumns = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time) => formatTime(create_time)
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: (auth_time) => formatTime(auth_time)
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      }
    ]
  }
  // 表格每行事件
  onRow = (role) => {
    return {
      // 每行的点击事件
      onClick: event => {
        this.setState({
          role
        })
      }
    }
  }
  // 获取所有角色列表
  getRoles = async () => {
    const res = await reqRoles();
    if (res.status === 0) {
      const roles = res.data;
      this.setState({ roles })
    }
  }
  // 点击ok添加角色
  addRole = () => {
    // 表单验证
    this.form.validateFields( async (err, values)=> {
      if(!err){
        // 收集数据
        const {roleName} = values;
        // 重置输入数据
        this.form.resetFields();
        const res = await reqAddRoles(roleName);
        if(res.status === 0){
          message.success('添加角色成功!');
          // this.getRoles();
          // 新产生的角色
          const role = res.data;
          // 更新状态，基于原本状态更新
          this.setState(state =>({
            roles:[...state.roles, role]
          }))
        } else{
          message.error('添加角色失败!')
        }
        // 隐藏弹窗框
        this.setState({isShowAdd:false})
      }
    })
  }

  // 点击ok设置权限
  updateRole = async () => {
    const role = this.state.role;
    // 得到最新的menus
    const menus = this.auth.current.getMenus();
    role.menus = menus;
    role.auth_name = memoryUtils.user.username;
    role.auth_time = Date.now();
    // 请求更新
    const res = await reqUpdateRoles(role);
    if(res.status === 0){
      // 如果当前更新的是自己对应角色的权限，强制退出
      if(role._id === memoryUtils.user.role_id){
        message.success('当前角色权限更新,请重新登录!');
        memoryUtils.user = {};
        removeUser();
        this.props.history.replace('/login');
      } else{
        message.success('更新权限成功!');
        this.setState({
          roles:[...this.state.roles]
        })
      }
    } else{
      message.error('更新权限失败!')
    }
    // 隐藏弹窗
    this.setState({isShowAuth:false})
  }

  UNSAFE_componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getRoles();
  }

  render() {
    const { roles, role, isShowAdd, isShowAuth } = this.state;

    const title = (
      <span>
        <Button 
          type="primary"
          style={{ marginRight: 15 }}
          onClick={()=>{this.setState({isShowAdd:true})}}
        >
          创建角色
        </Button>
        <Button 
          type="primary" 
          disabled={ !role._id }
          onClick={()=>{this.setState({isShowAuth:true})}}
        >
          设置角色分配权限
        </Button>
      </span>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          rowSelection={{ 
            type: 'radio', selectedRowKeys: [role._id],
            onSelect: (role)=>{ //选择某个radio的回调
              this.setState({role})
            }
          }}
          dataSource={roles}
          columns={this.columns}
          pagination={{ defaultPageSize: 6, showQuickJumper: true }}
          onRow={this.onRow}
        />
        {/*新建角色弹出框 */}
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={()=> {
            this.setState({isShowAdd:false})
            this.form.resetFields();
          }}
        >
          <AddForm
            setForm={(form) => { this.form = form }}
          />
        </Modal>

        {/*角色分配权限弹出框 */}
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={()=> {
            this.setState({isShowAuth:false})
          }}
        >
          <AuthForm ref={this.auth} role={role} />
        </Modal>
      </Card>
    )
  }
}
