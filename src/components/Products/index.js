import React from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import Navigation from '../Navigation';
import '../../index.css';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const ProductsPage = () => <ProductsList />;

var unsubscribe = null;

class ProductsListBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      products: [],
      isUserLogged: false
    };
  }

  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ isUserLogged: true });
      } else {
        this.props.history.push('/signin');
      }
    });
    this.setState({ loading: true });
    this.parseData();
  }
  parseData = () => {
    let products = [];
    let fb = this.props.firebase;
    unsubscribe = fb.allProducts().onSnapshot(querySnapshot => {
      products = [];
      querySnapshot.forEach(doc => {
        products.push(Object.assign({ id: doc.id }, doc.data()));
      });
      this.setState({ products });
      this.setState({ loading: false });
    });
  };

  actionButtonClicked(product_id, product_state) {
    let fb = this.props.firebase;
    if (product_state === 'inactive') {
      fb.allProducts()
        .doc(product_id)
        .update({ state: 'active' });
    } else {
      fb.allProducts()
        .doc(product_id)
        .update({ state: 'inactive' });
    }
  }

  componentWillUnmount() {
    if (unsubscribe) unsubscribe();
  }

  render() {
    const { products, loading, isUserLogged } = this.state;
    return (
      isUserLogged && (
        <div>
          <Navigation />
          <h1>Products</h1>
          <p>Available products</p>
          <div>
            <div>
              <div>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <div>
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
                            <TableRow
                              key={product.id}
                              className={
                                product.state === 'inactive'
                                  ? 'bg_row_idle'
                                  : 'bg_row_confirmed'
                              }
                            >
                              <TableCell>
                                <p>{product.name}</p>
                              </TableCell>
                              <TableCell>
                                <p>{product.count}</p>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outlined"
                                  onClick={() =>
                                    this.actionButtonClicked(
                                      product.id,
                                      product.state
                                    )
                                  }
                                >
                                  {product.state === 'inactive'
                                    ? 'enable'
                                    : 'disable'}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Paper>
                    <br />
                    <span className="bg_row_confirmed white_text span_legend">
                      Active
                    </span>{' '}
                    <span className="bg_row_idle white_text span_legend">
                      Inactive
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    );
  }
}
const ProductsList = compose(
  withFirebase,
  withRouter
)(ProductsListBase);

export default ProductsPage;
