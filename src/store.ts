import unitsReducer from "./features/units-slice";
import darkModeReducer from "./features/dark-mode-slice";
import intervalReducer from "./features/interval-slice";
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
