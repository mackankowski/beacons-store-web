import React from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

class HomeComponent extends React.Component {
  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(user => {
      if (user) {
        this.props.history.push('/products');
      } else {
        this.props.history.push('/signin');
      }
    });
  }
  render() {
    return <div />;
  }
}

const HomeCompose = compose(
  withFirebase,
  withRouter
)(HomeComponent);

export default HomeCompose;
