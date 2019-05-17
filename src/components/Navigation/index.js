import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import Button from '@material-ui/core/Button';
import '../../index.css';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';


class NavigationComponent extends React.Component {
  signOut = () => {
    this.props.firebase.doSignOut().then(() => {
      this.props.history.push(ROUTES.HOME);
    });
  };
  render() {
    return (
      <div>
        <span className="button">
          <Button variant="contained" color="default" onClick={this.signOut}>
            LogOut
          </Button>
        </span>

        <span className="button">
          <Button
            variant="contained"
            color="primary"
            to={ROUTES.PRODUCTS}
            component={Link}
            disabled={this.props.location.pathname === '/products'}
          >
            Products
          </Button>
        </span>

        <span className="button">
          <Button
            variant="contained"
            color="primary"
            to={ROUTES.ORDERS}
            component={Link}
            disabled={this.props.location.pathname === '/orders'}
          >
            Orders
          </Button>
        </span>
      </div>
    );
  }
}

const NavigationCompose = compose(
  withFirebase,
  withRouter
)(NavigationComponent);

export default NavigationCompose;
