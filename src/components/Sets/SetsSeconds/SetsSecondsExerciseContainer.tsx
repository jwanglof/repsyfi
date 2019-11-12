import React, {FunctionComponent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ErrorAlert from '../../ErrorAlert/ErrorAlert';
import {isEmpty} from 'lodash';
import {withRouter} from 'react-router5';
import {Router} from 'router5';
import {RouteNames} from '../../../routes';
import firebase from '../../../config/firebase';
import {FirebaseCollectionNames} from '../../../config/FirebaseUtils';
import {ISetsSecondsModel} from '../../../models/ISetsSecondsModel';
import LoadingAlert from '../../LoadingAlert/LoadingAlert';

import isWithinInterval from 'date-fns/isWithinInterval';
import fromUnixTime from 'date-fns/fromUnixTime';
import addSeconds from 'date-fns/addSeconds';
import subSeconds from 'date-fns/subSeconds';
import {ISetBasicModel} from '../../../models/ISetModel';
import SetsExerciseContainerRender from '../SetsExerciseContainerRender';
import {SetTypesEnum} from '../../../enums/SetTypesEnum';

const SetsSecondsExerciseContainer: FunctionComponent<SetsSecondsExerciseContainerRouter & SetsSecondsExerciseContainerProps> = ({router, setsSecondsExerciseUid, exerciseUid}) => {
  const { t } = useTranslation();

  const {name: routeName} = router.getState();
  const detailedDayView: boolean = (routeName === RouteNames.SPECIFIC_DAY);

  const [currentExerciseData, setCurrentExerciseData] = useState<ISetsSecondsModel | undefined>(undefined);
  const [snapshotErrorData, setSnapshotErrorData] = useState<string | undefined>(undefined);
  const [addSetViewVisible, setAddSetViewVisible] = useState<boolean>(false);

  useEffect(() => {
    // TODO Need to verify that a user can't send any UID in here, somehow... That should be specified in the rules!
    const unsub = firebase.firestore()
      .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_SECONDS)
      // .where("ownerUid", "==", uid)
      .doc(setsSecondsExerciseUid)
      .onSnapshot({includeMetadataChanges: true}, doc => {
        if (doc.exists && !isEmpty(doc.data())) {
          const snapshotData: any = doc.data();
          // Open a new set if this exercise is not older than 10 seconds, and the sets-array is empty
          const createdDate = fromUnixTime(snapshotData.createdTimestamp);
          const nowDate = new Date();
          const isNewExercise = isWithinInterval(createdDate, {start: subSeconds(nowDate, 10), end: addSeconds(nowDate, 10)});
          if (isNewExercise && !snapshotData.sets.length) {
            setAddSetViewVisible(true);
          }

          setCurrentExerciseData({
            version: snapshotData.version,
            createdTimestamp: snapshotData.createdTimestamp,
            uid: doc.id,
            ownerUid: snapshotData.ownerUid,
            sets: snapshotData.sets
          });
        }
      }, err => {
        console.error('error:', err);
        setSnapshotErrorData(err.message);
      });

    // Unsubscribe on un-mount
    return () => {
      unsub();
    };
  }, []);

  if (isEmpty(setsSecondsExerciseUid)) {
    return <ErrorAlert errorText="Must have the exercises's UID to proceed!" componentName="SetsSecondsExerciseContainer"/>;
  }

  if (snapshotErrorData) {
    return <ErrorAlert errorText={snapshotErrorData} componentName="SetsSecondsExerciseContainer"/>;
  }

  if (!currentExerciseData) {
    return <LoadingAlert componentName="SetsSecondsExerciseContainer"/>;
  }

  return <SetsExerciseContainerRender router={router} detailedDayView={detailedDayView} addSetViewVisible={addSetViewVisible} t={t} currentExerciseData={currentExerciseData} setAddSetViewVisible={setAddSetViewVisible} exerciseUid={exerciseUid} setsSecondsExerciseUid={setsSecondsExerciseUid} type={SetTypesEnum.SET_TYPE_SECONDS}/>
};

interface SetsSecondsExerciseContainerProps {
  setsSecondsExerciseUid: string
  exerciseUid: string,
}

interface SetsSecondsExerciseContainerRouter {
  router: Router
}

export default withRouter(SetsSecondsExerciseContainer);