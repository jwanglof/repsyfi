import React, {FunctionComponent, useEffect, useState} from 'react';
import {routeNode, withRouter} from 'react-router5'
import DayViewDetailed from './components/Day/DayViewDetailed';
import StartPage from './components/StartPage/StartPage';
import firebase, {initializeFirebase} from './config/firebase';
import Footer from './components/Footer/Footer';
import AddDay from './components/Day/AddDay';
import AllDays from './components/Day/AllDays';
import EditDay from './components/Day/EditDay';
import Dashboard from './components/Dashboard/Dashboard';
import {RouteNames} from './routes';
import {Router, State} from 'router5';
import {GlobalStateProvider} from './state';
import Faq from './components/Faq/Faq';
import SettingsPolarLink from './components/Settings/SettingsPolarLink';
import SettingsMenu from './components/Settings/SettingsMenu';

const App: FunctionComponent<IAppProps & IAppRouter> = ({ route, router }) => {
  const topRouteName: string = route.name.split('.')[0];
  const params: any = router.getState().params;
  let shownComponent: any = undefined;

  const [firebaseIsInitialized, setFirebaseIsInitialized] = useState<boolean>(false);
  const [signInStatusLoading, setSignInStatusLoading] = useState<boolean>(true);
  const [userSignedIn, setUserSignedIn] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<firebase.User | undefined>(undefined);

  useEffect(() => {
    const initFirebase = async () => {
      await initializeFirebase();
      setFirebaseIsInitialized(true);
    };
    // noinspection JSIgnoredPromiseFromCall
    initFirebase();
  }, []);

  useEffect(() => {
    if (firebaseIsInitialized) {
      firebase.auth().onAuthStateChanged(function(user) {
        // console.log('Logged in???');

        if (user) {
          setUserSignedIn(true);
          setUserDetails(user);
          // User is signed in.
          // console.log('User logged in!');
          // console.log(user);
          // const name = user.displayName;
          // const email = user.email;
          // const photoUrl = user.photoURL;
          // const emailVerified = user.emailVerified;
          // const uid = user.uid;
          // console.log(name, email, photoUrl, emailVerified, uid)
        } else {
          // No user is signed in.
          // console.log('User not lgoged in');
          setUserSignedIn(false);
        }
        setSignInStatusLoading(false);
      });
    }
  }, [firebaseIsInitialized]);

  if (!firebaseIsInitialized) {
    return <div>Initializing Firebase!</div>;
  }

  if (signInStatusLoading) {
    return <div>Loading sign in status!</div>;
  }

  const signInReq = (component: any) => {
    if (userSignedIn) {
      return component;
    }
    router.navigate(RouteNames.ROOT, {}, {reload: true})
  };

  switch (topRouteName) {
    case RouteNames.SPECIFIC_DAY:
      shownComponent = signInReq(<DayViewDetailed dayUid={params.uid}/>);
      break;
    case RouteNames.ADD_DAY:
      shownComponent = signInReq(<AddDay/>);
      break;
    case RouteNames.EDIT_DAY:
      shownComponent = signInReq(<EditDay dayUid={params.dayUid}/>);
      break;
    case RouteNames.ALL_DAYS:
      shownComponent = signInReq(<AllDays/>);
      break;
    case RouteNames.DASHBOARD:
      shownComponent = signInReq(<Dashboard/>);
      break;
    case RouteNames.SETTINGS:
      shownComponent = signInReq(<SettingsMenu/>);
      break;
    case RouteNames.SETTINGS_POLAR_LINK:
      shownComponent = signInReq(<SettingsPolarLink/>);
      break;
    case RouteNames.POLAR_LINK_REDIRECT:
      shownComponent = <div>POLAR LINK REDIRECT!!!!</div>;
      break;
    case RouteNames.FAQ:
      shownComponent = <Faq/>;
      break;
    default:
      shownComponent = <StartPage userSignedIn={userSignedIn || false} userDetails={userDetails}/>;
  }

  return (<GlobalStateProvider>
    <div className="App">
      {shownComponent}
    </div>
    {userSignedIn && <Footer/>}
  </GlobalStateProvider>);
};

interface IAppProps {}

interface IAppRouter {
  route: State,
  router: Router
}

export default routeNode<any>('app')(withRouter(App));
