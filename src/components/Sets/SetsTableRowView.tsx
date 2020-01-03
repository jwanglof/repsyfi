import React, {FunctionComponent, useEffect, useState} from 'react';
import {ISetBasicModel, ISetBasicUpdateModel, ISetModel} from '../../models/ISetModel';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import classnames from 'classnames';
import firebase from '../../config/firebase';
import {FirebaseCollectionNames} from '../../config/FirebaseUtils';
import isEmpty from 'lodash/isEmpty';
import {SetTypesEnum} from '../../enums/SetTypesEnum';
import SetsTableRowFormRender from './SetsTableRowFormRender';
import {FormikHelpers} from 'formik';
import {updateSetsRepsExercise} from './SetsReps/SetsRepsService';
import {useTranslation} from 'react-i18next';
import {updateSetsSecondsExercise} from './SetsSeconds/SetsSecondsService';

const SetsTableRowView: FunctionComponent<ISetsTableRowView> = ({ setUid, disabled, setLastSetData, setTypeShown }) => {
  const { t } = useTranslation();

  const [currentData, setCurrentData] = useState<ISetModel | undefined>(undefined);
  const [editRow, setEditRow] = useState<boolean>(false);
  const [snapshotErrorData, setSnapshotErrorData] = useState<string | undefined>(undefined);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  // Effect to subscribe on changes on this specific set
  useEffect(() => {
    let collectionName: string;
    if (setTypeShown === SetTypesEnum.SET_TYPE_SECONDS) {
      collectionName = FirebaseCollectionNames.FIRESTORE_COLLECTION_SETS_SECONDS;
    } else if (setTypeShown === SetTypesEnum.SET_TYPE_REPS) {
      collectionName = FirebaseCollectionNames.FIRESTORE_COLLECTION_SETS;
    } else {
      throw new Error("Invalid set type!");
    }

    // TODO Need to verify that a user can't send any UID in here, somehow... That should be specified in the rules!
    const unsub = firebase.firestore()
      .collection(collectionName)
      // .where("ownerUid", "==", uid)
      .doc(setUid)
      .onSnapshot({includeMetadataChanges: true}, doc => {
        if (doc.exists && !isEmpty(doc.data())) {
          const snapshotData: any = doc.data();
          const res: ISetModel = {
            ownerUid: snapshotData.ownerUid,
            uid: doc.id,
            createdTimestamp: snapshotData.createdTimestamp,
            version: snapshotData.version,
            reps: snapshotData.reps,
            seconds: snapshotData.seconds,
            amountInKg: snapshotData.amountInKg,
            index: snapshotData.index
          };
          setCurrentData(res);
          if (setLastSetData) {
            setLastSetData(res);
          }
        }
      }, err => {
        console.error('error:', err);
        setSnapshotErrorData(err.message);
      });

    // Unsubscribe on un-mount
    return () => {
      unsub();
    };
  }, [setLastSetData, setTypeShown, setUid]);

  if (snapshotErrorData) {
    return <tr><td colSpan={3}><ErrorAlert errorText={snapshotErrorData} componentName="SetsRepsTableRowView" uid={setUid}/></td></tr>;
  }

  if (!currentData) {
    return <tr><td colSpan={3}><LoadingAlert componentName="SetsRepsTableRowView"/></td></tr>;
  }

  if (submitErrorMessage) {
    return <tr><td colSpan={3}><ErrorAlert errorText={submitErrorMessage} componentName="SetsRepsTableRowAdd"/></td></tr>;
  }

  const onSubmit = async (values: ISetBasicModel, actions: FormikHelpers<ISetBasicModel>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    try {
      const data: ISetBasicUpdateModel = {
        amountInKg: values.amountInKg,
      };

      if (setTypeShown === SetTypesEnum.SET_TYPE_REPS) {
        data.reps = values.reps;
        await updateSetsRepsExercise(currentData.uid, data);
      } else if (setTypeShown === SetTypesEnum.SET_TYPE_SECONDS) {
        data.seconds = values.seconds;
        await updateSetsSecondsExercise(currentData.uid, data);
      }

      // Hide this form
      setEditRow(false);
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(e.data.message);
    }
    actions.setSubmitting(false);
  };

  const classNames = classnames({
    "one-set--muted": disabled
  });

  return (<>
    {editRow && !disabled && <SetsTableRowFormRender initialData={currentData} editOnSubmit={onSubmit} t={t} setTypeShown={setTypeShown} setAddSetViewVisible={setEditRow} exerciseUid=""/>}

    {!editRow && <tr className={classNames} onClick={() => setEditRow(true)}>
      <th scope="row">{currentData.index}</th>
      <td>{currentData.amountInKg}</td>
      {setTypeShown === SetTypesEnum.SET_TYPE_REPS && <td>{currentData.reps}</td>}
      {setTypeShown === SetTypesEnum.SET_TYPE_SECONDS && <td>{currentData.seconds}</td>}
    </tr>}
  </>);
};

interface ISetsTableRowView {
  setUid: string,
  disabled: boolean,
  setLastSetData?: ((lastSetData: ISetBasicModel) => void),
  setTypeShown: SetTypesEnum,
}

export default SetsTableRowView;