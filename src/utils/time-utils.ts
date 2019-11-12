export const getMinutesSecondsFromSeconds = (seconds: number): IMinutesSeconds => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds - (minutes * 60);
  return {seconds: remainingSeconds, minutes: minutes};
};

export const getHoursMinutesSecondsFromSeconds = (seconds: number): IHoursMinutesSeconds => {
  const {seconds: s, minutes: m} = getMinutesSecondsFromSeconds(seconds);
  const hours = Math.floor(m / 60);
  const minutes = m - (hours * 60);
  return {seconds: s, minutes, hours}
};

export const getTotalSeconds = (hours: number, minutes: number, seconds: number): number => {
  let total: number = 0;
  if (hours) {
    total += (hours * 3600);
  }
  if (minutes) {
    total += (minutes * 60);
  }
  if (seconds) {
    total += seconds;
  }
  // return ((hours * 3600) + (minutes * 60) + seconds);
  return total;
};

interface ISeconds {
  seconds: number
}

interface IMinutes {
  minutes: number
}

interface IMinutesSeconds extends IMinutes, ISeconds {}

interface IHoursMinutesSeconds extends IMinutesSeconds {
  hours: number
}

export const formatSecondsToPrettyPrint = (seconds: number): string => {
  let t = getHoursMinutesSecondsFromSeconds(seconds);
  let hh: number | string = t.hours;
  let mm: number | string = t.minutes;
  let ss: number | string = t.seconds;
  if (hh < 10) hh = "0"+hh;
  if (mm < 10) mm = "0"+mm;
  if (ss < 10) ss = "0"+ss;
  return `${hh}:${mm}:${ss}`;
};

// TODO! AFTER COMMIT!!!!!! RENAME 'models' TO TYPES AND MOVE ALL INTERFACES THERE!!!!