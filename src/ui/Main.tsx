import '../ui/_styles/common.scss'
import UserLocationWidget from './UserLocationWidget/UserLocationWidget';
import CitiesWidget from './CitiesWidget/CitiesWidget';
import SetupComponent from './SetupComponent';
import { useAppSelector } from '../api/hooks/redux-hooks';

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
                <div
                    className="weather-widgets"
                >
                    <UserLocationWidget />
                    <CitiesWidget />
                </div>

            </div>
        </>
    );
}

export default Main;
