import React, { Component } from 'react';
import './App.css';
import { FirebaseContext } from './components/Firebase';

class App extends Component {
  render() {
    return (
      <FirebaseContext.Consumer>
        {firebase => {
          return <div>I've access to Firebase and render something.</div>;
        }}
      </FirebaseContext.Consumer>
    );
  }
}

export default App;
