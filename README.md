# Beacons Store for Web

Built with React, React-Router and Google Firebase as backend services.

## Demo

 [beacons.store](https://beacon-store-android.firebaseapp.com/)

To sign in:

- email: `demo@beacons.store`
- password: `beacons.store`

## Get started

- Create Firebase configuration file `<project_directory>/src/components/Firebase/config.js` and fill up by following template:
```
const config = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: ''
};

export default config;
```

- Make sure you have installed **node.js** with **npm** [https://nodejs.org/en/](https://nodejs.org/en/).

In project directory run `npm install` to verify that all dependencies are fetched.

In the project directory run `npm start` to launch app in the development mode via [http://localhost:3000](http://localhost:3000).
