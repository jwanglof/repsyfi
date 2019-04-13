import React, {FunctionComponent, MutableRefObject, useEffect, useRef, useState} from 'react';
import {formatSecondsToPrettyPrint} from '../../utils/time-utils';
import {useGlobalState} from '../../state';

const FooterDurationTimer: FunctionComponent<IFooterDurationTimerProps> = () => {
  const [duration, setDuration] = useState<number>(0);

  const timerShouldRun = useGlobalState('timerRunning')[0];

  // Stolen from: https://overreacted.io/making-setinterval-declarative-with-react-hooks/ (with some modifications)
  const delay = 1000;
  const savedCallback: MutableRefObject<any> = useRef();
  const durationCb = () => {
    if (timerShouldRun) {
      setDuration(duration + 1);
    }
  };

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = durationCb;
  }, [durationCb]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);

  if (!timerShouldRun) return null;

  return (<span className="text-muted text-lowercase">
    <small>- {formatSecondsToPrettyPrint(duration)}</small>
  </span>);
};

interface IFooterDurationTimerProps {

}

export default FooterDurationTimer;