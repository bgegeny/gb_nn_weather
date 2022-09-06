import { useAppSelector } from '../../hooks';
import { units } from '../constants';

const CurrentWeather = (props: {
    lon: string,
    lat: string
    currentTemperature : number,
}) => {

    const { lon, lat, currentTemperature} = props;
    const unit = useAppSelector(state => state.units.value);



    return (
        <>
            <div
                className="text-center border-bottom"
            >
                Latitude: {lat} Longitude: {lon}
            </div>
            <div
                className="current-temp pb-3 pt-3 border-bottom"
            >
                <img alt='Thermometer' id="thermometer-img" src='./thermometer.jpg'/>
                <div>Current Temperature: {`${currentTemperature} ${unit === units.METRIC ? '°C' : '°F'}`}</div>
            </div>
        </>

    );
}

export default CurrentWeather;
