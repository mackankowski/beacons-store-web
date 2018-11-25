import React from 'react';
import { Redirect } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';

const HomePage = () => (
  <div>
    <HomePageComponent />
  </div>
);

class HomePageBase extends React.Component {
  render() {
    return this.props.firebase.isUserLogged() ? (
      <Redirect to="/inventory" />
    ) : (
      <Redirect to="/signin" />
    );
  }
}

const HomePageComponent = compose(withFirebase)(HomePageBase);

export default HomePage;
