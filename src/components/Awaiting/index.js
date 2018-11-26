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

const AwaitingPage = () => <AwaitingList />;

var unsubscribe = null;

class AwaitingListBase extends React.Component {
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

  componentWillUnmount() {
    if (unsubscribe) unsubscribe();
  }

  render() {
    const { orders, loading, isUserLogged } = this.state;
    return (
      isUserLogged && (
        <div>
          <Navigation />
          <h1>Awaiting orders to confirm</h1>
          <div>
            <div>
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
                        {console.log(orders)}
                        {orders.map(order => (
                          <TableRow
                            key={order.id}
                            className={
                              order.state === 'waiting'
                                ? 'bg_waiting'
                                : 'bg_confirmed'
                            }
                          >
                            <TableCell>
                              <p>{order.id}</p>
                            </TableCell>
                            <TableCell>
                              <p>{order.user_mail}</p>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                onClick={() =>
                                  this.actionButtonClicked(
                                    order.order_id,
                                    order.state
                                  )
                                }
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
            </div>
          </div>
        </div>
      )
    );
  }
}

const AwaitingList = compose(
  withFirebase,
  withRouter
)(AwaitingListBase);

export default AwaitingPage;
