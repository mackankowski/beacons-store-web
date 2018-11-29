import React from 'react';
import SignInPage from './components/SignIn';
import HomePage from './components/Home';
import InventoryPage from './components/Inventory';
import OrdersPage from './components/Orders';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';

class App extends React.Component {
  componentDidMount() {
    document.title = 'Beacon Store';
  }
  render() {
    return (
      <Router>
        <div>
          <Route exact path={ROUTES.HOMEPAGE} component={HomePage} />
          <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route exact path={ROUTES.INVENTORY} component={InventoryPage} />
          <Route exact path={ROUTES.ORDERS} component={OrdersPage} />
        </div>
      </Router>
    );
  }
}

export default App;
