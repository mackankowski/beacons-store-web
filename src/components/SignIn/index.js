import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import '../../index.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null
};

class SignInComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE, isUserLogged: true };
  }

  componentWillMount() {
    this.props.firebase.auth.onAuthStateChanged(user => {
      if (user) {
        this.props.history.push('/products');
      } else {
        this.setState({ isUserLogged: false });
      }
    });
  }

  onSubmit = event => {
    event.preventDefault();

    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push('/products');
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error, isUserLogged } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      !isUserLogged && (
        <div>
          <div className="aligner">
            <div>
              <h1 className="text-center">Sign in</h1>
              <Paper>
                <form onSubmit={this.onSubmit} className="text-center">
                  <TextField
                    className="default-margins"
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                  />
                  <br />
                  <TextField
                    className="default-margins"
                    name="password"
                    value={password}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                  />
                  <br />
                  <br />
                  <Button
                    className="default-margins"
                    variant="contained"
                    color="primary"
                    disabled={isInvalid}
                    type="submit"
                  >
                    Sign In
                  </Button>
                  <br />
                  {error && <p className="text-error">{error.message}</p>}
                </form>
              </Paper>
            </div>
          </div>
        </div>
      )
    );
  }
}

const SignInCompose = compose(
  withFirebase,
  withRouter
)(SignInComponent);

export default SignInCompose;
