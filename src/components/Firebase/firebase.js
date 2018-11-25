import app from 'firebase/app';
import config from './config.js';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
    this.fs = app.firestore();
    const settings = { /* your settings... */ timestampsInSnapshots: true };
    this.fs.settings(settings);
  }
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);
  doSignOut = () => this.auth.signOut();
  allProducts = () => this.fs.collection('products');
  allOrders = () => this.fs.collection('user_orders');
  isUserLogged = () => {
    /* @todo: fixit */
    let user = this.auth.currentUser;
    if (user) {
      return true;
    } else {
      return false;
    }
  };
}

export default Firebase;
