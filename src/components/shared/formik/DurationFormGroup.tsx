import React, {ChangeEvent, FunctionComponent, useEffect, useState} from 'react';
import {Alert, Col, FormGroup, Input, Label} from 'reactstrap';
import {colSmSize, labelSmSize} from './formik-utils';
import {connect, ErrorMessage, FormikContext} from 'formik';
import {defaultTo, toNumber} from 'lodash';

const DurationFormGroup: FunctionComponent<IDurationFormGroupProps & IDurationFormGroupPropsFormik> = ({formik, labelText, name}) => {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const MAX_MINUTES_SECONDS: number = 59;

  useEffect(() => {
    formik.values[name] = getTotalSeconds();
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
      const addMinutes = Math.floor(seconds / 60);
      if (addMinutes > 0) {
        const remainingSeconds = seconds - (addMinutes * 60);
        setMinutes(minutes + addMinutes);
        setSeconds(remainingSeconds);
      }
    }
  };

  const getTotalSeconds = (): number => ((hours * 3600) + (minutes * 60) + seconds);

  const getNumber = (e: ChangeEvent<HTMLInputElement>): number => defaultTo(toNumber(e.target.value), 0);

  const classNames = "col-3 text-center";
  
  return (<FormGroup row>
    <Label for={name} sm={labelSmSize}>{labelText}</Label>
    <Col sm={colSmSize}>
      <Input className={classNames} type="number" name="hours" onChange={e => setHours(getNumber(e))} value={hours} placeholder="Hours" />
      <Input className={classNames} type="number" name="minutes" onChange={e => setMinutes(getNumber(e))} onBlur={onBlur} value={minutes} placeholder="Minutes" max={MAX_MINUTES_SECONDS}/>
      <Input className={classNames} type="number" name="seconds" onChange={e => setSeconds(getNumber(e))} onBlur={onBlur} value={seconds} placeholder="Seconds" max={MAX_MINUTES_SECONDS}/>
      <ErrorMessage name={name}>{msg => <Alert color="warning" className="pb-0 pt-0 pl-2 pr-2 mt-2">{msg}</Alert>}</ErrorMessage>
    </Col>
  </FormGroup>);
};

interface IDurationFormGroupProps {
  labelText: string,
  name: string
}

interface IDurationFormGroupPropsFormik {
  formik: FormikContext<any>
}

export default connect<any, any>(DurationFormGroup);