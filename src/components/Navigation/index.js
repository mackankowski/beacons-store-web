import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import Button from '@material-ui/core/Button';
import '../../index.css';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

const Navigation = () => (
  <div>
    <NavigationComponent />
  </div>
);

class NavigationBase extends React.Component {
  signOut = () => {
    this.props.firebase.doSignOut().then(() => {
      this.props.history.push('/');
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
            to={ROUTES.INVENTORY}
            component={Link}
            disabled={this.props.location.pathname === '/inventory'}
          >
            Inventory
          </Button>
        </span>

        <span className="button">
          <Button
            variant="contained"
            color="primary"
            to={ROUTES.AWAITING}
            component={Link}
            disabled={this.props.location.pathname === '/awaiting'}
          >
            Awaiting
          </Button>
        </span>
      </div>
    );
  }
}

const NavigationComponent = compose(
  withFirebase,
  withRouter
)(NavigationBase);

export default Navigation;
