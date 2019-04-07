import './Day.scss';

import React, {FunctionComponent, useEffect, useState} from 'react';
import {FIRESTORE_COLLECTION_DAYS} from '../../config/firebase';
import TSLoadingAlert from '../LoadingAlert/TSLoadingAlert';
import TSEmptyCollection from '../EmptyCollection/TSEmptyCollection';
import {orderBy} from "lodash";
import {getAllDays10DaysBackInTime} from './TSDayService';
import {IDayModel} from '../../models/IDayModel';
import {Col, Row} from 'reactstrap';
import Day from './TSDayView';
import TSDayView from './TSDayView';

const TSAllDays: FunctionComponent<TSAllDaysProps> = () => {
  const [allDays, setAllDays] = useState<Array<IDayModel> | undefined>(undefined);

  useEffect(() => {
    getAllDays10DaysBackInTime().then(res => setAllDays(orderBy(res, ['startTimestamp'], ['desc'])));
  }, []);

  if (!allDays) {
    return <TSLoadingAlert componentName="TSAllDays"/>;
  }

  if (!allDays.length) {
    return <TSEmptyCollection componentName="TSAllDays" collectionName={FIRESTORE_COLLECTION_DAYS}/>
  }

  return (
    <Row>
      <Col xs={12}>
        {allDays.map(d => <TSDayView key={d.uid} data={d}/>)}
      </Col>
    </Row>
  );
};

interface TSAllDaysProps {}

export default TSAllDays;