import React, {useEffect, useReducer, useState} from 'react';
import {routeNode} from 'react-router5'
import TSDay from './components/Day/DayViewDetailed';
import Login from './components/Login/Login';
import firebase, {initializeFirebase} from './config/firebase';
import Footer from './components/Footer/Footer';
import TSAddEditDay from './components/Day/AddDay';
import AllDays from './components/Day/AllDays';
import EditDay from './components/Day/EditDay';
import Dashboard from './components/Dashboard/Dashboard';
import {RouteNames} from './routes';
import {GlobalStateContext, initialStore} from './index';
import durationTimerReducer from './reducers/duration-timer.reducer';

const App = ({ route }) => {
  const topRouteName = route.name.split('.')[0];
  let shownComponent = null;

  const [firebaseIsInitialized, setFirebaseIsInitialized] = useState(false);
  const [signInStatusLoading, setSignInStatusLoading] = useState(true);
  const [userSignedIn, setUserSignedIn] = useState(null);

  const [store, dispatch] = useReducer(durationTimerReducer, initialStore);

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

        if (user) {
          setUserSignedIn(true);
          // User is signed in.
          console.log('User logged in!');
          // console.log(user);
          const name = user.displayName;
          const email = user.email;
          const photoUrl = user.photoURL;
          const emailVerified = user.emailVerified;
          const uid = user.uid;
          // console.log(name, email, photoUrl, emailVerified, uid)
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
      case RouteNames.SPECIFIC_DAY:
        shownComponent = <TSDay dayUid={route.params.uid}/>;
        break;
      case RouteNames.ADD_DAY:
        shownComponent = <TSAddEditDay/>;
        break;
      case RouteNames.EDIT_DAY:
        shownComponent = <EditDay dayUid={route.params.dayUid}/>;
        break;
      case RouteNames.ALL_DAYS:
        shownComponent = <AllDays/>;
        break;
      default:
        shownComponent = <Dashboard/>;
    }
  }

  // return (<GlobalStateContext.Provider value={[ store, dispatch ]}>
  return (<GlobalStateContext.Provider value={{ store, dispatch }}>
    {/*{userSignedIn && <Header/>}*/}
    <div className="App">
      {shownComponent}
    </div>
    {userSignedIn && <Footer/>}
  </GlobalStateContext.Provider>);
};

export default routeNode('')(App);

