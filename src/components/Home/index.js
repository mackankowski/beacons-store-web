import React from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes'

class HomeComponent extends React.Component {
  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(user => {
      if (user) {
        this.props.history.push(ROUTES.PRODUCTS);
      } else {
        this.props.history.push(ROUTES.SIGNIN);
      }
    });
  }
  render() {
    return null;
  }
}

const HomeCompose = compose(
  withFirebase,
  withRouter
)(HomeComponent);

export default HomeCompose;
