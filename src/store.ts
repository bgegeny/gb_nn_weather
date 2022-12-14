import unitsReducer from "./api/redux/units-slice";
import darkModeReducer from "./api/redux/dark-mode-slice";
import intervalReducer from "./api/redux/interval-slice";
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        darkMode: darkModeReducer,
        units: unitsReducer,
        interval: intervalReducer,
    },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
