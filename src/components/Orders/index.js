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
import Chip from '@material-ui/core/Chip';

const OrdersPage = () => <OrdersList />;

var unsubscribeOrders = null;
var unsubscribeProducts = null;

class OrdersListBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      orders: [],
      products: {},
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
    let orders = [];
    let products = {};
    let fb = this.props.firebase;
    unsubscribeOrders = fb.allOrders().onSnapshot(querySnapshot => {
      orders = [];
      querySnapshot.forEach(doc => {
        orders.push(Object.assign({ id: doc.id }, doc.data()));
      });
      this.setState({ orders });
    });

    unsubscribeProducts = fb.allProducts().onSnapshot(querySnapshot => {
      products = [];
      querySnapshot.forEach(doc => {
        let obj = {};
        obj[doc.id] = doc.data();
        Object.assign(products, obj);
      });
      this.setState({ products });
      this.setState({ loading: false });
    });
  };

  actionButtonClicked(order_id, order_state) {
    let fb = this.props.firebase;
    if (order_state === 'waiting') {
      fb.allOrders()
        .doc(order_id)
        .update({ state: 'confirmed' });
    } else {
      fb.allOrders()
        .doc(order_id)
        .update({ state: 'waiting' });
    }
  }

  setRowStyle = order_state => {
    let className = 'bg_row_idle';
    switch (order_state) {
      case 'waiting':
        className = 'bg_row_waiting';
        break;
      case 'confirmed':
        className = 'bg_row_confirmed';
        break;
      default:
        break;
    }
    return className;
  };

  renderProducts = order_products => {
    let products = [];
    for (let product_id in order_products) {
      products.push(
        <p key={product_id}>
          {this.state.products[product_id].name}{' '}
          <Chip
            label={order_products[product_id].count}
            className="chip_default"
          />
        </p>
      );
    }
    return products;
  };

  componentWillUnmount() {
    if (unsubscribeOrders) unsubscribeOrders();
    if (unsubscribeProducts) unsubscribeProducts();
  }

  render() {
    const { orders, loading, isUserLogged } = this.state;
    return (
      isUserLogged && (
        <div>
          <Navigation />
          <h1>Orders</h1>
          <p>Pending orders from mobile customers</p>
          <div>
            <div>
              <div>
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <div>
                    <Paper>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Order number</TableCell>
                            <TableCell>User mail</TableCell>
                            <TableCell>Products</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orders.map(order => (
                            <TableRow
                              key={order.id}
                              className={this.setRowStyle(order.state)}
                            >
                              <TableCell>
                                <p>{order.id}</p>
                              </TableCell>
                              <TableCell>
                                <p>{order.user_mail}</p>
                              </TableCell>
                              <TableCell>
                                {this.renderProducts(
                                  order.products,
                                  this.props.firebase
                                )}
                              </TableCell>
                              <TableCell>
                                {(order.state === 'waiting' ||
                                  order.state === 'confirmed') && (
                                  <Button
                                    variant="outlined"
                                    onClick={() =>
                                      this.actionButtonClicked(
                                        order.id,
                                        order.state
                                      )
                                    }
                                  >
                                    {order.state === 'confirmed'
                                      ? 'Set waiting'
                                      : 'Set confirmed'}
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Paper>
                    <br />
                    <span className="bg_row_idle white_text span_legend">
                      Idle
                    </span>{' '}
                    <span className="bg_row_waiting white_text span_legend">
                      Waiting
                    </span>{' '}
                    <span className="bg_row_confirmed white_text span_legend">
                      Confirmed
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

const OrdersList = compose(
  withFirebase,
  withRouter
)(OrdersListBase);

export default OrdersPage;
