import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyAbBmvUiJIY4kBNmJJnzUkdRVm2vAzi6Rc",
  authDomain: "repsyfi.firebaseapp.com",
  databaseURL: "https://repsyfi.firebaseio.com",
  projectId: "repsyfi",
  storageBucket: "",
  messagingSenderId: "843330542148"
};

export const initializeFirebase = async () => {
  await firebase.initializeApp(config);
  return firebase;
};

export const getCurrentUsersUid = async () => {
  const currentUser = firebase.auth().currentUser;
  if (currentUser) {
    return currentUser.uid;
  }
  return null;
};

export default firebase;
