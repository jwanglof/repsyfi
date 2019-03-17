import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

let app = undefined;

// Initialize Firebase
// TODO Remove the API key from GitHub!
const config = {
  apiKey: "AIzaSyAbBmvUiJIY4kBNmJJnzUkdRVm2vAzi6Rc",
  authDomain: "repsyfi.firebaseapp.com",
  databaseURL: "https://repsyfi.firebaseio.com",
  projectId: "repsyfi",
  storageBucket: "",
  messagingSenderId: "843330542148"
};

export const initializeFirebase = async () => {
  console.log('Initializing firebase!!');
  app = await firebase.initializeApp(config);
  console.log('Firebase is initialized!', app);
  return firebase;
};

export const getCurrentUsersUid = async () => {
  const currentUser = firebase.auth().currentUser;
  return currentUser.uid;
};

// Collection names
export const FIRESTORE_COLLECTION_EXERCISES = "exercises";
export const FIRESTORE_COLLECTION_DAYS = "days";
export const FIRESTORE_COLLECTION_SETS = "sets";

export default firebase;
