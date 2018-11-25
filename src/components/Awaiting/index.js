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
import { throws } from 'assert';

const AwaitingPage = () => (
  <div>
    <Navigation />
    <h1>Awaiting orders to confirm</h1>
    <div>
      <div>
        <AwaitingList />
      </div>
    </div>
  </div>
);

var unsubscribe = null;
var tr_iter = 0;
class AwaitingListBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      orders: [],
      isListener: false
    };
  }

  componentDidMount() {
    // if (!this.props.firebase.isUserLogged()) this.props.history.push('/');
    this.setState({ loading: true });
    this.onLoad();
  }

  onLoad = () => {
    let fb = this.props.firebase;
    let orders = [];
    let orders_iter = 0;
    let orders_products_iter = 0;
    fb.allOrders()
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.map(doc => {
          var obj = {};
          obj['order_id'] = doc.id;
          obj['state'] = doc.data().state;
          obj['user_mail'] = doc.data().user_mail;
          orders.push(obj);
          orders[orders_iter++].products = [];
          fb.allOrders()
            .doc(doc.id)
            .collection('products')
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                orders[orders_products_iter].products.push(doc.data());
              });
            })
            .then(() => {
              orders_products_iter++;
            })
            .then(() => {
              this.setState({ orders });
              this.setState({ loading: false });
            });
        });
      })
      .then(() => {
        this.setState({ orders });
      })
      .then(() => {
        if (!this.state.isListener) {
          this.setState({ isListener: true });
          this.setDatabaseListener(fb);
        }
      });
  };

  setDatabaseListener(fb) {
    unsubscribe = fb.allOrders().onSnapshot(querySnapshot => {
      this.onLoad();
    });
  }

  confirmClicked(order_id, order_state) {
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

  componentWillUnmount() {
    if (unsubscribe) unsubscribe();
  }

  render() {
    const { orders, loading } = this.state;
    return (
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order number</TableCell>
                  <TableCell>User mail</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => (
                  <TableRow
                    key={tr_iter++}
                    className={
                      order.state === 'waiting' ? 'bg_waiting' : 'bg_confirmed'
                    }
                  >
                    <TableCell>
                      <p>{order.order_id}</p>
                    </TableCell>
                    <TableCell>
                      <p>{order.user_mail}</p>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          this.confirmClicked(order.order_id, order.state)
                        }
                        // disabled={order.state === 'confirmed' ? true : false}
                      >
                        {order.state === 'confirmed'
                          ? 'Set waiting'
                          : 'Set confirmed'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </div>
    );
  }
}

const AwaitingList = compose(
  withFirebase,
  withRouter
)(AwaitingListBase);

export default AwaitingPage;
