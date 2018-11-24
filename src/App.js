import React from 'react';
import SignInPage from './components/SignIn';
import HomePage from './components/Home';
import InventoryPage from './components/Inventory';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';

const App = () => (
  <Router>
    <div>
      <Route exact path={ROUTES.LANDING} component={HomePage} />
      <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route exact path={ROUTES.INVENTORY} component={InventoryPage} />
    </div>
  </Router>
);

export default App;
