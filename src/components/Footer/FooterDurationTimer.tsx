import React, {FunctionComponent, useState} from 'react';
import {formatSecondsToPrettyPrint} from '../../utils/time-utils';
import {useGlobalState} from '../../state';
import useInterval from './useInterval';

const FooterDurationTimer: FunctionComponent<IFooterDurationTimerProps> = () => {
  const [duration, setDuration] = useState<number>(0);

  const timerShouldRun = useGlobalState('timerRunning')[0];

  const durationCb = () => {
    // Only run the timer IF it should
    if (timerShouldRun) {
      setDuration(duration + 1);
    }
  };
  useInterval(durationCb, 1000);

  if (!timerShouldRun) {
    // Reset the timer if it was set
    if (duration > 0) {
      setDuration(0);
    }
    return null;
  }

  return (<span className="text-muted text-lowercase">
    <small>- {formatSecondsToPrettyPrint(duration)}</small>
  </span>);
};

interface IFooterDurationTimerProps {

}

export default FooterDurationTimer;