import './Day.scss';

import React, {FunctionComponent, useEffect, useState} from 'react';
import {FIRESTORE_COLLECTION_DAYS} from '../../config/firebase';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import EmptyCollection from '../EmptyCollection/EmptyCollection';
import {orderBy} from "lodash";
import {getAllDays10DaysBackInTime} from './DayService';
import {IDayModel} from '../../models/IDayModel';
import {Col, Row} from 'reactstrap';
import Day from './DayView';
import TSDayView from './DayView';

const AllDays: FunctionComponent<IAllDaysProps> = () => {
  const [allDays, setAllDays] = useState<Array<IDayModel> | undefined>(undefined);

  useEffect(() => {
    getAllDays10DaysBackInTime().then(res => setAllDays(orderBy(res, ['startTimestamp'], ['desc'])));
  }, []);

  if (!allDays) {
    return <LoadingAlert componentName="AllDays"/>;
  }

  if (!allDays.length) {
    return <EmptyCollection componentName="AllDays" collectionName={FIRESTORE_COLLECTION_DAYS}/>
  }

  return (
    <Row>
      <Col xs={12}>
        {allDays.map(d => <TSDayView key={d.uid} data={d}/>)}
      </Col>
    </Row>
  );
};

interface IAllDaysProps {}

export default AllDays;