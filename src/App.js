import React from 'react';
import SignInPage from './components/SignIn';
import HomePage from './components/Home';
import ProductsPage from './components/Products';
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
          <Route exact path={ROUTES.HOME} component={HomePage} />
          <Route exact path={ROUTES.SIGNIN} component={SignInPage} />
          <Route exact path={ROUTES.PRODUCTS} component={ProductsPage} />
          <Route exact path={ROUTES.ORDERS} component={OrdersPage} />
        </div>
      </Router>
    );
  }
}

export default App;
