import { useAppSelector } from '../../api/hooks/redux-hooks';
import { isMetric } from '../../api/helpers/unit-helpers';

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
                <img alt="Thermometer" id="thermometer-img" src="./thermometer.jpg"/>
                <div>Current Temperature: {`${currentTemperature} ${isMetric(unit) ? '°C' : '°F'}`}</div>
            </div>
        </>

    );
}

export default CurrentWeather;
