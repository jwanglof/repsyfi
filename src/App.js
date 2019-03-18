import React, {useEffect, useState} from 'react';
import {routeNode} from 'react-router5'
import './App.css';
import AllDays from './components/Day/AllDays';
import {
  routeNameAddDay,
  routeNameAddExerciseToSpecificDay,
  routeNameAddSetToSpecificExercise,
  routeNameAllDays,
  routeNameSpecificDay
} from './routes';
import Day from './components/Day/Day';
import AddDay from './components/Day/AddDay';
import AddExerciseForm from './components/Exercise/AddExerciseForm';
import AddSetForm from './components/Set/AddSetForm';
import Login from './components/Login/Login';
import firebase, {initializeFirebase} from './config/firebase';
import Footer from './components/Footer/Footer';

const App = ({ route }) => {
  const topRouteName = route.name.split('.')[0];
  let shownComponent = null;

  const [firebaseIsInitialized, setFirebaseIsInitialized] = useState(false);
  const [signInStatusLoading, setSignInStatusLoading] = useState(true);
  const [userSignedIn, setUserSignedIn] = useState(null);

  useEffect(() => {
    const initFirebase = async () => {
      await initializeFirebase();
      setFirebaseIsInitialized(true);
    };
    initFirebase();
  }, []);

  useEffect(() => {
    if (firebaseIsInitialized) {
      firebase.auth().onAuthStateChanged(function(user) {
        console.log('Logged in???');
        setSignInStatusLoading(false);

        if (user) { // KeDpGnOg4zdzq3jIoJVUOjywwEB3
          setUserSignedIn(true);
          // User is signed in.
          console.log('User logged in!', user);
          const name = user.displayName;
          const email = user.email;
          const photoUrl = user.photoURL;
          const emailVerified = user.emailVerified;
          const uid = user.uid;
          console.log(name, email, photoUrl, emailVerified, uid)
        } else {
          // No user is signed in.
          console.log('User not lgoged in');
          setUserSignedIn(false);
        }
      });
    }
  }, [firebaseIsInitialized]);

  if (!firebaseIsInitialized) {
    return <div>Initializing Firebase!</div>;
  }

  if (signInStatusLoading) {
    return <div>Loading sign in status!</div>;
  }

  if (!userSignedIn) {
    shownComponent = <Login/>;
  } else {
    switch (topRouteName) {
      case routeNameSpecificDay:
        shownComponent = <Day uid={route.params.uid}/>;
        break;
      case routeNameAddDay:
        shownComponent = <AddDay/>;
        break;
      case routeNameAddExerciseToSpecificDay:
        shownComponent = <AddExerciseForm dayUid={route.params.dayUid}/>;
        break;
      case routeNameAddSetToSpecificExercise:
        shownComponent = <AddSetForm exerciseUid={route.params.exerciseUid}/>;
        break;
      case routeNameAllDays:
        shownComponent = <AllDays/>;
        break;
      default:
        shownComponent = <div>This is where you'll see your dashboard with some stats. Because everyone loves stats, right? <span role="img" aria-label="" aria-labelledby="">😉</span></div>;
    }
  }

  return (
    <>
      <div className="App">
        {shownComponent}
      </div>
      {userSignedIn && <Footer/>}
    </>
  );
};

export default routeNode('')(App);

