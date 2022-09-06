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
                className="text-center pb-3 border-bottom"
            >
                Latitude: {lat} Longitude: {lon}
            </div>
            <div
                className="current-temp pt-3"
            >
                <img alt='Thermometer' className="thermometer-img" src='./thermometer.jpg'/>
                <div>Current Temperature: {`${props.currentTemperature} ${unit === units.METRIC ? '°C' : '°F'}`}</div>
            </div>
        </>

    );
}

export default CurrentWeather;
