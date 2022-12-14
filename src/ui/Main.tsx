import '../ui/_styles/common.scss'
import UserLocationWidget from './UserLocationWidget/UserLocationWidget';
import CitiesWidget from './CitiesWidget/CitiesWidget';
import SetupComponent from './SetupComponent';
import { useAppSelector } from '../api/hooks/redux-hooks';

const Main = () => {

    const darkMode = useAppSelector(state => state.darkMode.value);

    return (
        <>
            <main
                className={`${darkMode ? 'dark-mode' : 'light-mode'}`}
            >
                <SetupComponent />
                <div
                    className="weather-widgets"
                >
                    <UserLocationWidget />
                    <CitiesWidget />
                </div>

            </main>
        </>
    );
}

export default Main;
