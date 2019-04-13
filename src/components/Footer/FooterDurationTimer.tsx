import React, {FunctionComponent, useState} from 'react';
import useInterval from './useInterval';
import {formatSecondsToPrettyPrint} from '../../utils/time-utils';

const FooterDurationTimer: FunctionComponent<IFooterDurationTimerProps> = () => {
  const [duration, setDuration] = useState<number>(7159);

  // const store = useContext(GlobalStateContext);
  // console.log("FooterDurationTimer::", store);
  // if (store.)

  useInterval(() => {
    setDuration(duration + 1);
  }, 1000);

  return (<span className="text-muted text-lowercase">
    <small>- {formatSecondsToPrettyPrint(duration)}</small>
  </span>);
};

interface IFooterDurationTimerProps {

}

export default FooterDurationTimer;