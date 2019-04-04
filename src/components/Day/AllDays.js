import React, {useEffect, useState} from 'react';
import {Col, Row} from 'reactstrap';
import Loading from '../shared/Loading';
import Day from './TSDay';
import {getAllDays10DaysBackInTime} from './DayService';
import EmptyCollection from '../EmptyCollection/EmptyCollection';
import {FIRESTORE_COLLECTION_DAYS} from '../../config/firebase';
import orderBy from 'lodash/orderBy';

const AllDays = () => {
  const [allDays, setAllDays] = useState(null);

  useEffect(() => {
    getAllDays10DaysBackInTime().then(res => setAllDays(orderBy(res, ['startTimestamp'], ['desc'])));
  }, []);

  if (allDays === null) {
    return <Loading componentName="AllDays"/>;
  }

  if (!allDays.length) {
    return <EmptyCollection componentName="AllDays" collectionName={FIRESTORE_COLLECTION_DAYS}/>
  }

  return (
    <Row>
      <Col xs={12}>
        {allDays.map(d => <Day key={d.uid} data={d}/>)}
      </Col>
    </Row>
  );
};

AllDays.propTypes = {};

export default AllDays;