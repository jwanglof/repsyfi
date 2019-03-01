export const fkWorkoutOne = "999eeee";
export const fkWorkoutTwo = "111fffff";
export const fkDayOne = "1eeee1";
export const fkDayTwo = "2rrr2";

export const getOneSet = () => {
  return {
    uid: "uuuid1111",
    index: 1,
    amountInKg: 55,
    reps: 10,
    fk_workout: fkWorkoutOne
  };
};
export const getTwoSet = () => {
  return {
    uid: "uuuid222",
    index: 2,
    amountInKg: 50,
    reps: 12,
    fk_workout: fkWorkoutTwo
  };
};

export const getWorkoutOne = () => {
  return {
    uid: fkWorkoutOne,
    exerciseName: "Benchpress",
    sets: [getOneSet(), getTwoSet()],
    fk_day: fkDayOne
  };
};

export const getWorkoutTwo = () => {
  return {
    uid: fkWorkoutTwo,
    exerciseName: "D-B Curl",
    sets: [getOneSet(), getTwoSet()],
    fk_day: fkDayTwo
  };
};

export const getDayOne = () => {
  return {
    startTimestamp: Date.now(),
    stopTimestamp: Date.now(),
    location: 'Kontoret',
    muscleGroups: 'Abs, biceps',
    uid: fkDayOne,
    title: null,
    workouts: [getWorkoutOne(), getWorkoutTwo()]
  };
};

export const getDays = () => {
  return [getDayOne()];
};