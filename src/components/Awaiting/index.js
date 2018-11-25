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

class AwaitingListBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      orders: []
    };
  }

  componentDidMount() {
    if (!this.props.firebase.isUserLogged()) this.props.history.push('/');
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
        querySnapshot.forEach(doc => {
          var obj = {};
          obj['order_id'] = doc.id;
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
            });
        });
      })
      .then(() => {
        this.setState({ orders });
        this.setState({ loading: false });
      })
      .then(() => {
        unsubscribe = fb.allOrders().onSnapshot(querySnapshot => {
          querySnapshot.forEach(doc => {
            fb.allOrders()
              .doc(doc.id)
              .collection('products')
              .onSnapshot(querySnapshot => {
                querySnapshot.forEach(doc => {
                  //console.log('changed');
                });
              });
          });
        });
      });
  };

  componentWillUnmount() {
    if (unsubscribe) unsubscribe();
  }

  render() {
    const { orders, loading } = this.state;
    return (
      <div>{loading ? <p>Loading...</p> : <OrdersList orders={orders} />}</div>
    );
  }
}

const OrdersList = ({ orders }) => (
  <p>OK</p>
  // <Paper>
  //   <Table>
  //     <TableHead>
  //       <TableRow>
  //         <TableCell>Order number</TableCell>
  //         <TableCell>User mail</TableCell>
  //         <TableCell>Action</TableCell>
  //       </TableRow>
  //     </TableHead>
  //     <TableBody>
  //       {console.log(orders)}
  //       {orders.map(product => (
  //         <TableRow>
  //           <TableCell>
  //             <p>{product.name}</p>
  //           </TableCell>
  //           <TableCell>
  //             <p>{product.count}</p>
  //           </TableCell>
  //           <TableCell>
  //             <Button variant="contained" color="secondary">
  //               Confirm
  //             </Button>
  //           </TableCell>
  //         </TableRow>
  //       ))}
  //     </TableBody>
  //   </Table>
  // </Paper>
);

const AwaitingList = compose(
  withFirebase,
  withRouter
)(AwaitingListBase);

export default AwaitingPage;
