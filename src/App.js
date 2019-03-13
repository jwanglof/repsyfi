import React, {Fragment} from 'react';
import {Link, routeNode} from 'react-router5'
import './App.css';
import AllDays from './components/Day/AllDays';
import {
  routeNameAddDay,
  routeNameAddSetToSpecificExercise,
  routeNameAddExerciseToSpecificDay,
  routeNameSpecificDay
} from './routes';
import Day from './components/Day/Day';
import AddDay from './components/Day/AddDay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AddExerciseForm from './components/Exercise/AddExerciseForm';
import AddSetForm from './components/Set/AddSetForm';

const App = ({ route }) => {
  const topRouteName = route.name.split('.')[0];

  let shownComponent = null;
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
    default:
      shownComponent = <AllDays/>;
  }

  return (
    <Fragment>
      <div className="App">
        {shownComponent}
      </div>
      <footer className="footer container text-muted">
        <div className="row">
          <div className="col">
            <Link routeName="root">
              <FontAwesomeIcon icon="home" /> Home
            </Link>
          </div>
          <div className="col-8">
            <Link routeName={routeNameAddDay}>
              {/* TODO Refactor to a button! */}
              <span className="d-none d-lg-inline d-xl-inline">Add day</span>
              <FontAwesomeIcon icon="plus-circle"/>
            </Link>
          </div>
        </div>
      </footer>
    </Fragment>
  );
};

export default routeNode('')(App);
