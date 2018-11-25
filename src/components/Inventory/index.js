import React from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import '../../index.css';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Navigation from '../Navigation';
import { withRouter } from 'react-router-dom';

const InventoryPage = () => (
  <div>
    <Navigation />
    <h1>Realtime storage overview</h1>
    <div>
      <div>
        <InventoryList />
      </div>
    </div>
  </div>
);

var unsubscribe = null;
var tr_iter = 0;

class InventoryListBase extends React.Component {
  constructor(props) {
    super(props);
    // if (!this.props.firebase.isUserLogged()) this.props.history.push('/');

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
      .allProducts()
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          products.push(doc.data());
        });
      })
      .then(() => {
        this.setState({ products });
        this.setState({ loading: false });
      })
      .then(() => {
        unsubscribe = this.props.firebase
          .allProducts()
          .onSnapshot(querySnapshot => {
            console.log('data changed');
            products = [];
            querySnapshot.forEach(doc => {
              products.push(doc.data());
            });
            this.setState({ products });
          });
      });
  };

  componentWillUnmount() {
    if (unsubscribe) unsubscribe();
  }

  render() {
    const { products, loading } = this.state;
    return (
      <div>
        {loading ? <p>Loading...</p> : <ProductList products={products} />}
      </div>
    );
  }
}

const ProductList = ({ products }) => (
  <Paper>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Product name</TableCell>
          <TableCell>Count</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {console.log(products)}
        {products.map(product => (
          <TableRow key={tr_iter++}>
            <TableCell>
              <p>{product.name}</p>
            </TableCell>
            <TableCell>
              <p>{product.count}</p>
            </TableCell>
            <TableCell>
              <Button variant="contained" color="primary" disabled>
                Remove
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
);

const InventoryList = compose(
  withFirebase,
  withRouter
)(InventoryListBase);

export default InventoryPage;
