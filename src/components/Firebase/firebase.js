import app from 'firebase/app';
import config from './config.js';
import 'firebase/auth';

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
  }
  // *** Auth API ***

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);
  doSignOut = () => this.auth.signOut();
}

export default Firebase;
