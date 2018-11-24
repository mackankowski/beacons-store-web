import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import Button from '@material-ui/core/Button';
import '../../index.css';

const Navigation = () => (
  <div>
    <span class="button">
      {' '}
      <Button
        variant="contained"
        color="default"
        to={ROUTES.HOMEPAGE}
        component={Link}
      >
        LogOut
      </Button>
    </span>

    <span class="button">
      {' '}
      <Button
        variant="contained"
        color="primary"
        to={ROUTES.INVENTORY}
        component={Link}
      >
        Inventory
      </Button>
    </span>

    <span class="button">
      <Button
        variant="contained"
        color="primary"
        to={ROUTES.AWAITING}
        component={Link}
      >
        Awaiting
      </Button>
    </span>
  </div>
);

export default Navigation;
