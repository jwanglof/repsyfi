import './Day.scss';

import React, {FunctionComponent, useEffect, useState} from 'react';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import EmptyCollection from '../EmptyCollection/EmptyCollection';
import {getLatest10Days} from './DayService';
import {IDayModel} from '../../models/IDayModel';
import {Col, Row} from 'reactstrap';
import DayView from './DayView';
import {FirebaseCollectionNames} from '../../config/FirebaseUtils';

const AllDays: FunctionComponent<IAllDaysProps> = () => {
  const [allDays, setAllDays] = useState<Array<IDayModel> | undefined>(undefined);

  useEffect(() => {
    getLatest10Days()
      .then(setAllDays)
      .catch(err => {
        console.error(err);
      });
  }, []);

  if (!allDays) {
    return <LoadingAlert componentName="AllDays"/>;
  }

  if (!allDays.length) {
    return <EmptyCollection componentName="AllDays" collectionName={FirebaseCollectionNames.FIRESTORE_COLLECTION_DAYS}/>
  }

  return (
    <Row>
      <Col xs={12}>
        {allDays.map(d => <DayView key={d.uid} data={d}/>)}
      </Col>
    </Row>
  );
};

interface IAllDaysProps {}

export default AllDays;