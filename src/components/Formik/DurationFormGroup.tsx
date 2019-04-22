import React, {ChangeEvent, FunctionComponent, useEffect, useState} from 'react';
import {Alert, Col, FormGroup, Input, Label} from 'reactstrap';
import {connect, ErrorMessage, FormikContext} from 'formik';
import defaultTo from 'lodash/defaultTo';
import toNumber from 'lodash/toNumber';
import {getHoursMinutesSecondsFromSeconds, getMinutesSecondsFromSeconds} from '../../utils/time-utils';

const DurationFormGroup: FunctionComponent<IDurationFormGroupProps & IDurationFormGroupPropsFormik> = ({formik, labelText, name, autoFocus=false}) => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const MAX_MINUTES_SECONDS: number = 59;

  useEffect(() => {
    // The first time, set the current data
    if (hours === 0 && minutes === 0 && seconds === 0) {
      let t = getHoursMinutesSecondsFromSeconds(formik.values[name]);
      setHours(t.hours);
      setMinutes(t.minutes);
      setSeconds(t.seconds);
    } else {
      formik.values[name] = getTotalSeconds();
    }
  }, [hours, minutes, seconds]);


  const onBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (name === 'minutes' && minutes > MAX_MINUTES_SECONDS) {
      const addHours = Math.floor(minutes / 60);
      if (addHours > 0) {
        const remainingMinutes = minutes - (addHours * 60);
        setHours(hours + addHours);
        setMinutes(remainingMinutes);
      }
    } else if (name === 'seconds' && (seconds > MAX_MINUTES_SECONDS)) {
      const {seconds: s, minutes: m} = getMinutesSecondsFromSeconds(seconds);
      if (m > 0) {
        setMinutes(minutes + m);
        setSeconds(s);
      }
    }
    formik.values[name] = getTotalSeconds();
  };

  const getTotalSeconds = (): number => ((hours * 3600) + (minutes * 60) + seconds);

  const getNumber = (e: ChangeEvent<HTMLInputElement>): number => defaultTo(toNumber(e.target.value), 0);

  return (<FormGroup row>
    <Label for={name} xs={12}>{labelText}</Label>
    <Col xs={4}>
      <Input className="text-center" type="number" name="hours" onChange={e => setHours(getNumber(e))} onBlur={onBlur} value={hours} placeholder="Hours" autoFocus={autoFocus}/>
    </Col>
    <Col xs={4}>
      <Input className="text-center" type="number" name="minutes" onChange={e => setMinutes(getNumber(e))} onBlur={onBlur} value={minutes} placeholder="Minutes" max={MAX_MINUTES_SECONDS}/>
    </Col>
    <Col xs={4}>
      <Input className="text-center" type="number" name="seconds" onChange={e => setSeconds(getNumber(e))} onBlur={onBlur} value={seconds} placeholder="Seconds" max={MAX_MINUTES_SECONDS}/>
    </Col>
    <ErrorMessage name={name}>{msg => <Alert color="warning" className="pb-0 pt-0 pl-2 pr-2 mt-2">{msg}</Alert>}</ErrorMessage>
  </FormGroup>);
};

interface IDurationFormGroupProps {
  labelText: string,
  name: string,
  autoFocus?: boolean
}

interface IDurationFormGroupPropsFormik {
  formik: FormikContext<any>
}

export default connect<any, any>(DurationFormGroup);