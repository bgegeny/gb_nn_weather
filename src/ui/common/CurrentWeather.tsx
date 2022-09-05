import { useAppSelector } from '../../hooks';
import { units } from '../constants';

const CurrentWeather = (props: {
    currentTemperature : number,
}) => {
    const unit = useAppSelector(state => state.units.value);



    return (
        <div
            className="current-temp"
        >
            <img alt='Thermometer' className="thermometer-img" src='./thermometer.jpg'/>
            <div>Current Temperature: {`${props.currentTemperature} ${unit === units.METRIC ? '°C' : '°F'}`}</div>
        </div>
    );
}

export default CurrentWeather;
