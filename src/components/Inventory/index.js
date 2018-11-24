import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';

const InventoryPage = () => (
  <div>
    <InventoryList />
  </div>
);

class InventoryListBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      products: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.onLoad();
  }
  onLoad = () => {
    let products = [];
    this.props.firebase
      .getAllProducts()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          products.push(doc.data());
        });
      })
      .then(() => {
        this.setState({ products });
        this.setState({ loading: false });
      });
  };

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { products, loading } = this.state;
    return (
      <div>
        {loading ? <p>Loading...</p> : <ProductList products={products} />}
        {/* <ProductList products={products} /> */}
      </div>
    );
  }
}

const ProductList = ({ products }) => (
  <table>
    <thead>
      <tr>
        <th>Product name</th>
        <th>Count</th>
      </tr>
    </thead>
    <tbody>
      {console.log(products)}
      {products.map(product => (
        <tr>
          <td>
            <p>{product.name}</p>
          </td>
          <td>
            <p>{product.count}</p>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const InventoryList = compose(withFirebase)(InventoryListBase);

export default InventoryPage;
