import React, { Component } from 'react';
import './App.css';
import { FirebaseContext } from './components/Firebase';
import SignInPage from './components/SignIn';

class App extends Component {
  isLogged = false;
  render() {
    return (
      <FirebaseContext.Consumer>
        {firebase => {
          if (this.isLogged) {
            return <p>It's logged.</p>;
          } else {
            return <SignInPage />;
          }
        }}
      </FirebaseContext.Consumer>
    );
  }
}

export default App;
