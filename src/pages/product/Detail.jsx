import React, { Component } from 'react'
import {Card, List, Icon} from 'antd'
import {reqCategory} from '../../api/index.js'
import LinkButton from '../../components/LinkButton'
import {BASE_IMG_URL} from '../../utils/constants'

/* 
  产品的详情页组件
*/
const Item = List.Item;
export default class Detail extends Component {

  state = {
    cName1:'', //一级分类名称
    cName2:'', //二级分类名称
  }

  async componentDidMount() {
    // 得到当前商品的分类ID
    const {pCategoryId, categoryId} = this.props.location.state.product;
    if(pCategoryId === '0') { //一级分类下的商品
      const res = await reqCategory(categoryId);
      const cName1 = res.data.name;
      this.setState({cName1})
    } else { //二级分类下的商品
      /* const res1 = await reqCategory(pCategoryId); //获取一级分类名称
      const res2 = await reqCategory(categoryId); //获取二级分类名称
      const cName1 = res1.data.name;
      const cName2 = res2.data.name; */ //效率偏低，后面的请求实在前一个await请求成功后才发送
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      const cName1 = results[0].data.name;
      const cName2 = results[1].data.name;
      this.setState({cName1, cName2})
    }
  }

  render() {
    // 接收路由携带过来的参数
    const {name, desc, price, detail, imgs} = this.props.location.state.product;
    const {cName1, cName2} = this.state;

    const title = (
      <span>
        <LinkButton>
          <Icon 
            type="arrow-left" 
            style={{marginRight:'5px',fontSize:'18px'}}
            onClick={() => {this.props.history.goBack()}}
          ></Icon>
        </LinkButton>
        <span>商品详情</span>
      </span>
    )
    return (
      <Card title={title} className='product_detail'>
        <List>
          <Item>
            <span className="left">商品名称:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className="left">商品描述:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className="left">商品价格:</span>
            <span>{price}元</span>
          </Item>
          <Item>
            <span className="left">所属分类:</span>
            <span>{cName1} {cName2 ? '-->'+cName2 : ''}</span>
          </Item>
          <Item>
            <span className="left">商品图片:</span>
            <span>
              <img 
                className="product_img" 
                src="https://img13.360buyimg.com/n7/jfs/t1/149176/29/19382/70573/5fe19d90E5fb9ff50/efb30a9684813fac.jpg" 
                alt="img"
                />
                {
                  imgs.map(img => (
                    <img
                      key={img}
                      className='product_img'
                      src={BASE_IMG_URL + img}
                      alt="images"
                    />
                  ))
                }
            </span>
          </Item>
          <Item>
            <span className="left">商品详情:</span>
            <span dangerouslySetInnerHTML={{__html:detail}}></span>
          </Item>
        </List>
      </Card>
    )
  }
}
