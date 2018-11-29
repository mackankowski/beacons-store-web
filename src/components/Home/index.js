import React from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

const HomePage = () => <HomePageComponent />;

class HomePageBase extends React.Component {
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

const HomePageComponent = compose(
  withFirebase,
  withRouter
)(HomePageBase);

export default HomePage;
