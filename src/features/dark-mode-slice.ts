import { createSlice } from '@reduxjs/toolkit';
import {getLocalStorageValue, setLocalStorageValue} from "./slice-helper";

interface DarkModeState {
    value: boolean
}

const initialState: DarkModeState = {
    value: getLocalStorageValue('darkMode', false),
}

export const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState,
    reducers: {
        toggle: (state) =>  {
            state.value = !state.value;
            setLocalStorageValue('darkMode', state.value)
        }
    },
})

export const { toggle } = darkModeSlice.actions;

export default darkModeSlice.reducer;
