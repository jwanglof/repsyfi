import React, {FunctionComponent, useEffect, useState} from 'react';
import ErrorAlert from '../../ErrorAlert/ErrorAlert';
import LoadingAlert from '../../LoadingAlert/LoadingAlert';
import classnames from 'classnames';
import firebase from '../../../config/firebase';
import {FirebaseCollectionNames} from '../../../config/FirebaseUtils';
import isEmpty from 'lodash/isEmpty';
import SetsSecondsTableRowFormEdit from './SetsSecondsTableRowFormEdit';
import {ISetBasicModel, ISetModel} from '../../../models/ISetModel';

const SetsSecondsTableRowView: FunctionComponent<ISetsRepsTableRowViewProps> = ({ setUid, disabled, setLastSetData }) => {
  const [currentData, setCurrentData] = useState<ISetModel | undefined>(undefined);
  const [editRow, setEditRow] = useState<boolean>(false);
  const [snapshotErrorData, setSnapshotErrorData] = useState<string | undefined>(undefined);

  // Effect to subscribe on changes on this specific set
  useEffect(() => {
    // TODO Need to verify that a user can't send any UID in here, somehow... That should be specified in the rules!
    const unsub = firebase.firestore()
      .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_SETS_SECONDS)
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
  }, []);

  if (snapshotErrorData) {
    return <tr><td colSpan={3}><ErrorAlert errorText={snapshotErrorData} componentName="SetsRepsTableRowView" uid={setUid}/></td></tr>;
  }

  if (!currentData) {
    return <tr><td colSpan={3}><LoadingAlert componentName="SetsRepsTableRowView"/></td></tr>;
  }

  const classNames = classnames({
    "one-set--muted": disabled
  });

  return (<>
    {editRow && !disabled && <SetsSecondsTableRowFormEdit setAddSetViewVisible={setEditRow} initialData={currentData}/>}
    {!editRow && <tr className={classNames} onClick={() => setEditRow(true)}>
      <th scope="row">{currentData.index}</th>
      <td>{currentData.amountInKg}</td>
      <td>{currentData.seconds}</td>
    </tr>}
  </>);
};

interface ISetsRepsTableRowViewProps {
  setUid: string,
  disabled: boolean,
  setLastSetData?: ((lastSetData: ISetBasicModel) => void)
}

export default SetsSecondsTableRowView;