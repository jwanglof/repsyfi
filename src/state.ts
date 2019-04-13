import {createGlobalState} from 'react-hooks-global-state';

const initialState: IGlobalState = {
  timerRunning: false
};
export interface IGlobalState {
  timerRunning: boolean
}

export const {GlobalStateProvider, useGlobalState} = createGlobalState(initialState);