export const getHourMinuteSecondsFromSeconds = (seconds: number): IGetHourMinuteSecondsFromSeconds => {
  const date = new Date(seconds * 1000);
  let hh: number = date.getUTCHours();
  let mm: number = date.getUTCMinutes();
  let ss: number = date.getSeconds();
  return {seconds: ss, minutes: mm, hours: hh};
};

interface IGetHourMinuteSecondsFromSeconds {
  seconds: number,
  minutes: number,
  hours: number
}