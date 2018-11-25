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
    this.setState({ loading: true });
    this.onLoad();
  }
  onLoad = () => {
    let orders = [];
    this.props.firebase
      .allOrders()
      .doc('2xU2LI210teUYYK8qawa')
      .collection('products')
      .get()
      .then()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data());
          // this.props.firebase
          //   .allOrders()
          //   .doc(doc.id)
          //   .get(doc => {
          //     console.log(doc.data());
          //   });
          //orders.push(doc.data());
        });
      })
      .then(() => {
        this.setState({ orders });
        this.setState({ loading: false });
      });
    // .then(() => {
    //   unsubscribe = this.props.firebase
    //     .allOrders()
    //     .onSnapshot(querySnapshot => {
    //       orders = [];
    //       querySnapshot.forEach(doc => {
    //         orders.push(doc.data());
    //       });
    //       this.setState({ orders });
    //     });
    // });
  };

  componentWillUnmount() {
    if (unsubscribe) unsubscribe();
  }

  render() {
    const { orders, loading } = this.state;
    return <div>{loading ? <p>Loading...</p> : console.log(orders)}</div>;
  }
}

const ProductList = ({ orders }) => (
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
        {orders.map(product => (
          <TableRow>
            <TableCell>
              <p>{product.name}</p>
            </TableCell>
            <TableCell>
              <p>{product.count}</p>
            </TableCell>
            <TableCell>
              <Button variant="contained" color="secondary">
                Confirm
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
);

const AwaitingList = compose(withFirebase)(AwaitingListBase);

export default AwaitingPage;
