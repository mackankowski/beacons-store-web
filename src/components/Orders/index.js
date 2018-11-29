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

const OrdersPage = () => <OrdersList />;

var unsubscribe = null;

class OrdersListBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      orders: [],
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
    this.onLoad();
  }

  onLoad = () => {
    let fb = this.props.firebase;
    let orders = [];
    fb.allOrders()
      .get()
      .then(() => {
        unsubscribe = this.props.firebase
          .allOrders()
          .onSnapshot(querySnapshot => {
            orders = [];
            querySnapshot.forEach(doc => {
              orders.push(Object.assign({ id: doc.id }, doc.data()));
            });
            this.setState({ orders });
            this.setState({ loading: false });
          });
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
    for (let value in order_products) {
      products.push(
        <p key={value}>
          {value} x {order_products[value].count}
        </p>
      );
    }
    return products;
  };

  componentWillUnmount() {
    if (unsubscribe) unsubscribe();
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
                          {console.log(orders)}
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
                                {this.renderProducts(order.products)}
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
