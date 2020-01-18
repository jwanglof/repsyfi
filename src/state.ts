import {createGlobalState} from 'react-hooks-global-state';

interface IGlobalState {
  timerRunning: boolean
  debugInformationShown: boolean
}
const initialState: IGlobalState = {
  timerRunning: false,
  debugInformationShown: false
};

export const {GlobalStateProvider, useGlobalState} = createGlobalState(initialState);