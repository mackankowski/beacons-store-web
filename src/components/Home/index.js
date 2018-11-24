import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class HomePage extends Component {
  isLogged = false;
  render() {
    return this.isLogged ? <p>It's logged.</p> : <Redirect to="/signin" />;
  }
}

export default HomePage;
