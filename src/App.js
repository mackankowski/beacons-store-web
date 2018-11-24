import React from 'react';
import SignInPage from './components/SignIn';
import HomePage from './components/Home';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';

const App = () => (
  <Router>
    <div>
      <Route exact path={ROUTES.LANDING} component={HomePage} />
      <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
    </div>
  </Router>
);

export default App;
