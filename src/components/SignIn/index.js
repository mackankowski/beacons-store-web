import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import '../../index.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';

const SignInPage = () => (
  <div class="aligner">
    <div>
      <h1 class="text-center">Sign in</h1>
      <SignInForm />
    </div>
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    event.preventDefault();

    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push('/inventory');
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <Paper>
        <form onSubmit={this.onSubmit} class="text-center">
          <p>
            <TextField
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
            />
          </p>
          <p>
            <TextField
              name="password"
              value={password}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
            />
          </p>
          <Button
            variant="contained"
            color="primary"
            disabled={isInvalid}
            type="submit"
          >
            Sign In
          </Button>
          {error && <p class="text-error">{error.message}</p>}
        </form>
      </Paper>
    );
  }
}

const SignInForm = compose(
  withFirebase,
  withRouter
)(SignInFormBase);

export default SignInPage;
