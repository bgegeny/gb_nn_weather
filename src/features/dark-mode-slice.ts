import { createSlice } from '@reduxjs/toolkit';

interface DarkModeState {
    value: boolean
}

const initialState: DarkModeState = {
    value: false,
}

export const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState,
    reducers: {
        toggle: (state) =>  {
            state.value = !state.value;
        }
    },
})

export const { toggle } = darkModeSlice.actions

export default darkModeSlice.reducer
