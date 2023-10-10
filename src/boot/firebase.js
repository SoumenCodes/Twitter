import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAk8ZWSr6UrqGxxn4qNSGdPSOh6Nz-nMdw",
  authDomain: "qweet-e0f0c.firebaseapp.com",
  projectId: "qweet-e0f0c",
  storageBucket: "qweet-e0f0c.appspot.com",
  messagingSenderId: "439426396538",
  appId: "1:439426396538:web:633cd0406737e8c5d2a6c3",
};

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();

export default db;
