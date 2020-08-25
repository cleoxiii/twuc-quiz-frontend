import React, {Component} from 'react';
import {Table, Button, notification} from 'antd';
import './Order.css';

class Order extends Component {
  state = {
    data: [],
    products: [],
    orders: []
  }

  getOrders() {
    fetch("/orders", {method: 'GET'})
      .then(res => res.json())
      .then(data => {
        this.setState({orders: data})
        return fetch("/products", { method: 'GET'})
      })
      .then(res => res.json())
      .then(data => {this.setState({products: data})})
      .then(() => this.setState({data: this.state.orders.map(item => {
          let currentProduct = this.state.products.find(product => product.id === item.productId);
          return {
            id: item.id,
            name: currentProduct.name,
            price: currentProduct.price,
            count: item.count,
            unit: currentProduct.unit,
          }
        })}))
      .catch(error => console.error(error))
  }

  openNotificationWithIcon(type) {
    notification[type]({
      message: 'Error',
      description:
        '订单删除失败，请稍后再试',
    });
  }

  handleDelete(id) {
    const req = new Request(`/order/${id}`, {
      method: 'DELETE'
    })
    fetch(req)
      .then((response) => {
        if(!response.ok) {
          throw new Error();
        }
        this.getOrders()
      })
      .catch(() => {
        this.openNotificationWithIcon('error');
      });
  }

  componentDidMount() {
    this.getOrders();
  }

  render() {
    const columns = [
      {
        title: '名字',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: '数量',
        dataIndex: 'count',
        key: 'count',
      },
      {
        title: '单位',
        key: 'unit',
        dataIndex: 'unit',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Button danger onClick={() => this.handleDelete(record.id)}>删 除</Button>
        )
      },
    ];

    const data = this.state.data;

    return (
      <div className="order-list">
        {data.length === 0 ?
          <span>暂无订单，返回<a href="/">商城页面</a>继续购买</span> :
          <Table columns={columns} dataSource={data} pagination={false}/>}
      </div>
      );
  }
}

export default Order;