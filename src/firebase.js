import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyANkmN06RMh21v2lCIkcuXL-mqa9LYALTw",
  authDomain: "stackathon-5385b.firebaseapp.com",
  databaseURL: "https://stackathon-5385b.firebaseio.com",
  projectId: "stackathon-5385b",
  storageBucket: "stackathon-5385b.appspot.com",
  messagingSenderId: "102954687569"
};
firebase.initializeApp(config);

export default firebase;
