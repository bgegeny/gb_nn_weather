import { createSlice } from '@reduxjs/toolkit';
import {getLocalStorageValue, setLocalStorageValue} from "./slice-helper";

interface IntervalState {
    value: number
}

const initialState: IntervalState = {
    value: getLocalStorageValue('interval', 5000),
}

export const intervalSlice = createSlice({
    name: 'interval',
    initialState,
    reducers: {
        set: (state, action) =>  {
            state.value = action.payload;
            setLocalStorageValue('interval', state.value)
        }
    },
})

export const { set } = intervalSlice.actions

export default intervalSlice.reducer
