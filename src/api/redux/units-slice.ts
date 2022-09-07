import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import { units } from '../constants/widget-constants';
import {getLocalStorageValue, setLocalStorageValue} from './slice-helper';

interface UnitsState {
    value: string
}

const initialState: UnitsState = {
    value: getLocalStorageValue('unit', units.METRIC),
}

export const unitsSlice = createSlice({
    name: 'units',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        toggle: (state) =>  {
            state.value = state.value === units.METRIC ? state.value=units.IMPERIAL : state.value=units.METRIC
            setLocalStorageValue('unit', state.value);
        }
    },
})

export const { toggle } = unitsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUnits = (state: RootState) => state.units.value;

export default unitsSlice.reducer;
