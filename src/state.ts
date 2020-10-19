import {createGlobalState} from 'react-hooks-global-state';

interface IGlobalState {
  timerRunning: boolean
  debugInformationShown: boolean
  newDayUid: string | null
}
const initialState: IGlobalState = {
  timerRunning: false,
  debugInformationShown: false,
  newDayUid: null
};

export const {useGlobalState} = createGlobalState(initialState);
