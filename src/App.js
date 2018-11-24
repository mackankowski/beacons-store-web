import React, { Component } from 'react';
import './App.css';
import { FirebaseContext } from './components/Firebase';
import SignInPage from './components/SignIn';

class App extends Component {
  render() {
    return (
      <FirebaseContext.Consumer>
        {firebase => {
          return <SignInPage />;
        }}
      </FirebaseContext.Consumer>
    );
  }
}

export default App;
