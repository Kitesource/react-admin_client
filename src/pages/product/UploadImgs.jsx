import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd';
import {reqDeleteImg} from '../../api/index'
import {BASE_IMG_URL} from '../../utils/constants'
/* 
  用于图片上传的组件
*/
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class UploadImgs extends React.Component {

  static propTypes = {
    imgs:PropTypes.array,
  }
  constructor(props) {
    super(props);

    let fileList = [];
    // 如果传入了imgs属性
    const {imgs} = this.props;
    if(imgs && imgs.length > 0){
      fileList = imgs.map((img,index) => ({
        uid: -index,
        name:img,
        staus:'done',
        url:BASE_IMG_URL + img
      }))
    }

    // 初始化状态
    this.state = {
      previewVisible: false, //标识是否显示大图预览
      previewImage: '', //大图的url
      fileList, //所有已上传图片文件对象的数组 (为空/所在包含已上传的图片对象)
    }
  }

  // 隐藏Modal
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  /* 
    file:当前操作的图片文件(上传/删除)
    fileList：所有已上传图片文件对象的数组
  */
  handleChange = async ({ file,fileList }) => {
    // 文件一旦上传成功，将当前上传的file的信息修正(name,url)
    if(file.status === 'done') {
      const res = file.response; // 服务端响应内容
      if(res.status === 0){
        message.success('图片上传成功!')
        const {name,url} = res.data;
        file = fileList[fileList.length - 1];
        file.name = name;
        file.url = url;
      }else{
        message.error('图片上传失败!')
      }
    }else if(file.status === 'removed'){ //图片删除
      const res = await reqDeleteImg(file.name);
      if(res.status === 0){
        message.success('图片删除成功!')
      }else{
        message.error('图片删除失败!')
      }
    }

    this.setState({ fileList })
  };

  /* 
    用来所有已上传图片的文件名的数组
  */
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload"
          accept="image/*" /* 只接收图片类型文件 */
          name="image" /* 请求参数名 */
          listType="picture-card"
          fileList={fileList} /* 已上传图片文件对象的数组 */
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}