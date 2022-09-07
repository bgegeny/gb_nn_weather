import {useEffect, useState} from 'react';
import axios from 'axios';
import { useAppSelector } from '../../api/hooks/redux-hooks';
import CurrentWeather from '../common/CurrentWeather';
import { weatherApiLinks } from '../../api/constants/open-weather-constants';
import { units } from '../../api/constants/widget-constants';
import { widgetMessages } from '../../api/constants/widget-constants';
import { hour } from '../../api/constants/time-constants';
import { isMetric } from '../../api/helpers/unit-helpers';
import HourlyWeatherWidget from './HourlyWeatherWidget';
import DailyWeatherWidget from './DailyWeatherWidget';

const { prepareText, unknownError, htmlGeolocationError, getPositionDeclineError, networkError, timeOutError } = widgetMessages;
const { userLocationData, positionData } = weatherApiLinks;

const UserLocationWidget = () => {

    const [ latitude, setLatitude ] = useState<number>();
    const [ longitude, setLongitude ] = useState<number>();
    const [ cityName, setCityName ] = useState('');
    const [ widgetStateMsg, setWidgetStateMsg ] = useState(prepareText);
    const [ currentMetricTemperature, setCurrentMetricTemperature ] = useState(0);
    const [ currentImperialTemperature, setCurrentImperialTemperature ] = useState(0);
    const [ hourlyMetricForecast, setHourlyMetricForecast ] = useState(new Array<{ dt: number, temp: number }>(12));
    const [ hourlyImperialForecast, setHourlyImperialForecast ] = useState(new Array<{ dt: number, temp: number }>(12));
    const [ dailyMetricForecast, setDailyMetricForecast ] = useState(new Array<{ dt: number, temp: { day: number, night: number } }>(6));
    const [ dailyImperialForecast, setDailyImperialForecast ] = useState(new Array<{ dt: number, temp: { day: number, night: number } }>(6));
    const unit = useAppSelector(state => state.units.value);
    const darkMode = useAppSelector(state => state.darkMode.value);

    useEffect(() => {
        const showPosition = () => {
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
            } else {
                setWidgetStateMsg(htmlGeolocationError);
            }
        };

        showPosition();
    }, []);

    useEffect(() => {
        let interval: ReturnType<typeof setTimeout>;
        const currentDate = new Date();
        const nextRequestTime = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            currentDate.getHours()+1,
        );
        const timeOutValue = nextRequestTime.getTime() - currentDate.getTime();

        async function getWeatherData() {
            if(latitude && longitude) {
                try {
                    const metricLink = userLocationData(units.METRIC, latitude, longitude);
                    const imperialLink = userLocationData(units.IMPERIAL, latitude, longitude);
                    const position = positionData(latitude, longitude)

                    const metricResponse = await axios.get(metricLink);
                    const imperialResponse = await axios.get(imperialLink);
                    const positionResponse = await axios.get(position);

                    setCurrentMetricTemperature(metricResponse.data.current.temp);
                    setCurrentImperialTemperature(imperialResponse.data.current.temp);

                    setHourlyMetricForecast(metricResponse.data.hourly.slice(1,13));
                    setHourlyImperialForecast(imperialResponse.data.hourly.slice(1,13));
                    setDailyMetricForecast(metricResponse.data.daily.slice(1,7));
                    setDailyImperialForecast(imperialResponse.data.daily.slice(1,7));

                    if(positionResponse.data[0]) {
                        setCityName(positionResponse.data[0].name);
                    }
                } catch (error) {
                    setWidgetStateMsg(unknownError)
                    console.error(error);
                }
            };
        }

        getWeatherData();

        setTimeout(() => {
            getWeatherData();
            interval = setInterval(() => {
                getWeatherData();
            }, hour);
        }, timeOutValue);

        return () => {
            clearInterval(interval);
        }
    }, [latitude, longitude]);

    const successCallback = (position: GeolocationPosition) => {
        navigator.geolocation.getCurrentPosition(function(position) {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        });
    }

    const errorCallback = (error: { code: number }) => {
        if(error.code === 1) {
            setWidgetStateMsg(getPositionDeclineError);
        } else if(error.code === 2) {
            setWidgetStateMsg(networkError);
        } else if(error.code === 3) {
            setWidgetStateMsg(timeOutError);
        } else {
            setWidgetStateMsg(unknownError);
        }
    }

    return (
        <div
            className={`component user-location-component text-center border ${darkMode ? 'border-warning' : 'border-dark'} rounded`}
        >
            <div className="text-center fw-bold">Current Location</div>
            { ((longitude && latitude) && widgetStateMsg === prepareText) ?
                <>
                    <div className="text-center">{cityName}</div>
                    <CurrentWeather
                        lon={longitude.toFixed(2)}
                        lat={latitude.toFixed(2)}
                        currentTemperature={isMetric(unit) ? currentMetricTemperature : currentImperialTemperature}
                    />
                    <HourlyWeatherWidget
                        forecast={isMetric(unit) ? hourlyMetricForecast : hourlyImperialForecast}
                    />
                    <DailyWeatherWidget
                        forecast={isMetric(unit) ? dailyMetricForecast : dailyImperialForecast}
                    />
                </> :
                widgetStateMsg
            }
        </div>
    );
}

export default UserLocationWidget;
