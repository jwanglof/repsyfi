import firebase from 'firebase/app';
import 'firebase/firestore';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyD426b8CtK-kFld65Hh95amZqbChVfk9FI",
  authDomain: "whalreps.firebaseapp.com",
  databaseURL: "https://whalreps.firebaseio.com",
  projectId: "whalreps",
  storageBucket: "whalreps.appspot.com",
  messagingSenderId: "475543210600"
};

// Collection names
export const FIRESTORE_COLLECTION_EXERCISES = "exercises";
export const FIRESTORE_COLLECTION_DAYS = "days";
export const FIRESTORE_COLLECTION_SETS = "sets";

export default firebase.initializeApp(config);
