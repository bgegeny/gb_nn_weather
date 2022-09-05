import '../styles/common.scss'
import UserLocationWidget from "./UserLocationWidget/UserLocationWidget";
import CitiesWidget from "./CitiesWidget/CitiesWidget";
import SetupComponent from "./SetupComponent";
import { useAppSelector } from "../hooks";
import { useEffect } from "react";

const Main = () => {

    const darkMode = useAppSelector(state => state.darkMode.value);
    const unit = useAppSelector(state => state.units.value);

    return (
        <>
            <div
                className={`main ${darkMode ? 'dark-mode' : 'light-mode'}`}
            >
                <SetupComponent
                    darkMode={darkMode}
                    unit={unit}
                />
                <UserLocationWidget />
                <CitiesWidget />
            </div>
        </>
    );
}

export default Main;
