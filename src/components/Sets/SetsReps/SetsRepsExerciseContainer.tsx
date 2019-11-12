import React, {FunctionComponent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ISetsRepsModel} from '../../../models/ISetsRepsModel';
import ErrorAlert from '../../ErrorAlert/ErrorAlert';
import LoadingAlert from '../../LoadingAlert/LoadingAlert';
import {ISetBasicModel} from '../../../models/ISetModel';
import firebase from '../../../config/firebase';
import {FirebaseCollectionNames} from '../../../config/FirebaseUtils';
import {isEmpty} from 'lodash';
import {withRouter} from 'react-router5';
import {Router} from 'router5';
import {RouteNames} from '../../../routes';
import isWithinInterval from 'date-fns/isWithinInterval';
import fromUnixTime from 'date-fns/fromUnixTime';
import addSeconds from 'date-fns/addSeconds';
import subSeconds from 'date-fns/subSeconds';
import {SetTypesEnum} from '../../../enums/SetTypesEnum';
import SetsExerciseContainerRender from '../SetsExerciseContainerRender';

const SetsRepsExerciseContainer: FunctionComponent<ISetsRepsExerciseContainerRouter & ISetsRepsExerciseContainerProps> = ({router, setsRepsExerciseUid, exerciseUid}) => {
  const { t } = useTranslation();

  const {name: routeName} = router.getState();
  const detailedDayView: boolean = (routeName === RouteNames.SPECIFIC_DAY);

  const [currentExerciseData, setCurrentExerciseData] = useState<ISetsRepsModel | undefined>(undefined);
  const [snapshotErrorData, setSnapshotErrorData] = useState<string | undefined>(undefined);
  const [addSetViewVisible, setAddSetViewVisible] = useState<boolean>(false);
  const [lastSetData, setLastSetData] = useState<ISetBasicModel | undefined>(undefined);

  useEffect(() => {
    // TODO Need to verify that a user can't send any UID in here, somehow... That should be specified in the rules!
    const unsub = firebase.firestore()
      .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS)
      // .where("ownerUid", "==", uid)
      .doc(setsRepsExerciseUid)
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

  if (isEmpty(setsRepsExerciseUid)) {
    return <ErrorAlert errorText="Must have the exercises's UID to proceed!" componentName="SetsRepsExerciseContainer"/>;
  }

  if (snapshotErrorData) {
    return <ErrorAlert errorText={snapshotErrorData} componentName="SetsRepsExerciseContainer"/>;
  }

  if (!currentExerciseData) {
    return <LoadingAlert componentName="SetsRepsExerciseContainer"/>;
  }

  // Return the last set's data so that it can be pre-filled to the new set
  const getLastSetData = (): ISetBasicModel => {
    if (!lastSetData) {
      return {
        index: 1,
        amountInKg: 0,
        reps: 0
      }
    }
    return {
      index: (lastSetData.index + 1),
      amountInKg: lastSetData.amountInKg,
      reps: lastSetData.reps
    };
  };

  return <SetsExerciseContainerRender router={router} detailedDayView={detailedDayView} addSetViewVisible={addSetViewVisible} t={t} currentExerciseData={currentExerciseData} setLastSetData={setLastSetData} setAddSetViewVisible={setAddSetViewVisible} getLastSetData={getLastSetData} exerciseUid={exerciseUid} setsRepsExerciseUid={setsRepsExerciseUid} type={SetTypesEnum.SET_TYPE_REPS}/>
};

interface ISetsRepsExerciseContainerProps {
  setsRepsExerciseUid: string
  exerciseUid: string,
}

interface ISetsRepsExerciseContainerRouter {
  router: Router
}

export default withRouter(SetsRepsExerciseContainer);