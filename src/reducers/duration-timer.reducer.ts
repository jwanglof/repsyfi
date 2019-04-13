const durationTimerReducer = (
  state: IDurationTimerReducerState = durationTimerInitialState,
  action: IDurationTimerReducerAction
): any => {
  switch (action.type) {
    case DurationTimerReducerActionTypes.START_TIMER:
      return {...state, timerRunning: true};
    case DurationTimerReducerActionTypes.STOP_TIMER:
      return {...state, timerRunning: false};
    default:
      return state;
  }
};

export const durationTimerInitialState: IDurationTimerReducerState = {
  timerRunning: false
};

export enum DurationTimerReducerActionTypes {
  START_TIMER = 'start-timer',
  STOP_TIMER = 'stop-timer'
}

export interface IDurationTimerReducerState {
  timerRunning: boolean
}

export interface IDurationTimerReducerAction {
  type: string
}

export default durationTimerReducer;