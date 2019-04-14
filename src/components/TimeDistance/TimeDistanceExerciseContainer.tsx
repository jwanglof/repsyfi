import React, {FunctionComponent, useEffect, useState} from 'react';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import {ITimeDistanceModel} from '../../models/ITimeDistanceModel';
import TimeDistanceView from './TimeDistanceView';
import TimeDistanceForm from './TimeDistanceForm';
import firebase from '../../config/firebase';
import {FirebaseCollectionNames} from '../../config/FirebaseUtils';
import isEmpty from 'lodash/isEmpty';

const TimeDistanceExerciseContainer: FunctionComponent<ITimeDistanceExerciseContainerProps> = ({exerciseUid}) => {
  const [currentExerciseData, setCurrentExerciseData] = useState<ITimeDistanceModel | undefined>(undefined);
  const [fetchDataError, setFetchDataError] = useState<string | undefined>(undefined);
  const [editVisible, setEditVisible] = useState<boolean>(false);

  useEffect(() => {
    // TODO Need to verify that a user can't send any UID in here, somehow... That should be specified in the rules!
    const unsub = firebase.firestore()
      .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_TIME_DISTANCE)
      // .where("ownerUid", "==", uid)
      .doc(exerciseUid)
      .onSnapshot({includeMetadataChanges: true}, doc => {
        if (doc.exists && !isEmpty(doc.data())) {
          const snapshotData: any = doc.data();
          setCurrentExerciseData({
            ownerUid: snapshotData.ownerUid,
            uid: doc.id,
            createdTimestamp: snapshotData.createdTimestamp,
            version: snapshotData.version,
            totalTimeSeconds: snapshotData.totalTimeSeconds,
            totalDistanceMeter: snapshotData.totalDistanceMeter,
            totalWarmupSeconds: snapshotData.totalWarmupSeconds,
            totalKcal: snapshotData.totalKcal,
            speedMin: snapshotData.speedMin,
            speedMax: snapshotData.speedMax,
            inclineMin: snapshotData.inclineMin,
            inclineMax: snapshotData.inclineMax
          });
        }
      }, err => {
        console.error('error:', err);
        setFetchDataError(err.message);
      });

    // Unsubscribe on un-mount
    return () => {
      unsub();
    };
  }, []);

  if (fetchDataError) {
    return <ErrorAlert errorText={fetchDataError} componentName="TimeDistanceExerciseContainer"/>;
  }

  if (!currentExerciseData) {
    return <LoadingAlert componentName="TimeDistanceExerciseContainer"/>;
  }

  return (
    <>
      {!editVisible && <TimeDistanceView currentExerciseData={currentExerciseData} setEditVisible={setEditVisible}/>}
      {editVisible && <TimeDistanceForm currentExerciseData={currentExerciseData} setEditVisible={setEditVisible}/>}
    </>
  );
};

interface ITimeDistanceExerciseContainerProps {
  exerciseUid: string
}

export default TimeDistanceExerciseContainer;
