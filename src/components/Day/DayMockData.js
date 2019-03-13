import subDays from 'date-fns/subDays';
import addHours from 'date-fns/addHours';
import getUnixTime from "date-fns/getUnixTime";
import take from 'lodash/take';
import {addNewDay} from './DayService';

export const fkWorkoutOne = "999eeee";
export const fkWorkoutTwo = "111fffff";
export const fkDayOne = "1eeee1";
export const fkDayTwo = "2rrr2";

const gangstaLoremIpsumString = "Vivamizzle nizzle mauris its fo rizzle nisi crunk pretizzle. Fo sizzle get down get down lacizzle. Fo shizzle eu we gonna chung eget lacizzle auctizzle da bomb. Praesent suscipizzle tellivizzle ipsum. Curabitizzle fo arcu. Vestibulum enim enim, auctizzle boofron, congue eu, fo shizzle mah nizzle fo rizzle, mah home g-dizzle funky fresh, check out this. Crazy vitae fizzle nizzle eros posuere pharetra. Quisque pede pimpin', gangsta pulvinar, auctor crackalackin, i'm in the shizzle fo amizzle, erizzle. Tellivizzle izzle dui. Aliquizzle break it down purizzle, shiznit shiznit, sollicitudizzle in, dawg imperdizzle, daahng dawg. Quisque a crackalackin bizzle cool gangster vehicula. Pizzle mofo sagittizzle ipsizzle. I saw beyonces tizzles and my pizzle went crizzle habitant morbi tristique shiznit izzle we gonna chung izzle malesuada famizzle izzle turpizzle own yo'. Shiz est. Curabitizzle elementum. Ut bling bling sheezy, shiz shizzlin dizzle, dang izzle, fo pulvinizzle, nisl. Nulla sagittis pot that's the shizzle.".split(" ");

export const getOneSet = () => {
  return {
    uid: "uuuid1111",
    index: 1,
    amountInKg: 55,
    reps: 10
  };
};
export const getTwoSet = () => {
  return {
    uid: "uuuid222",
    index: 2,
    amountInKg: 50,
    reps: 12
  };
};

export const getWorkoutOne = () => {
  return {
    uid: fkWorkoutOne,
    exerciseName: "Benchpress",
    sets: [getOneSet(), getTwoSet()],
    feeling: true,
  };
};

export const getWorkoutTwo = () => {
  return {
    uid: fkWorkoutTwo,
    exerciseName: "D-B Curl",
    sets: [getOneSet(), getTwoSet()],
    feeling: false,
  };
};

export const getDayOne = () => {
  return {
    uid: fkDayOne,
    startTimestamp: Date.now(),
    endTimestamp: Date.now(),
    location: 'Kontoret',
    muscleGroups: 'Abs, biceps',
    title: null,
    notes: take(gangstaLoremIpsumString, 20),
    workouts: [getWorkoutOne(), getWorkoutTwo()],
  };
};

export const allDays = [getDayOne()];

export const getDays = () => {
  return allDays;
};

export const getSpecificDay = uid => {
  return getDays().filter(d => d.uid === uid)[0];
};

var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
var stringLength = 5;

function pickRandom() {
  return possible[Math.floor(Math.random() * possible.length)];
}

for(let i = 1, len = 4; i <= len; i++) {
  const thisDay = {...getDayOne()};
  const startDate = subDays(new Date(), i);
  const endDate = addHours(startDate, 1);
  const nullTitle = 5 > Math.floor(Math.random() * 10) + 1;

  thisDay.startTimestamp = getUnixTime(startDate);
  thisDay.endTimestamp = getUnixTime(endDate);
  thisDay.uid = Array.from({ length: stringLength }, pickRandom).join('');
  thisDay.title =  nullTitle ? null : take(gangstaLoremIpsumString, Math.floor(Math.random() * 7) + 1).join(" ");

  addNewDay(thisDay);
}