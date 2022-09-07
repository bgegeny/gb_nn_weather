import {useEffect, useState} from 'react';
import axios from 'axios';
import {useAppSelector} from "../../api/hooks/redux-hooks";
import CurrentWeather from "../common/CurrentWeather";
import { openWeatherMapApiKey, units } from "../../api/constants/open-weather-constants";
import { widgetMessages } from "../../api/constants/widget-constants";
import HourlyWeatherWidget from "./HourlyWeatherWidget";
import DailyWeatherWidget from "./DailyWeatherWidget";

const { prepareText, unknownError, htmlGeolocationError, getPositionDeclineError, networkError, timeOutError } = widgetMessages;

const UserLocationWidget = () => {

    const [ latitude, setLatitude ] = useState<number>();
    const [ longitude, setLongitude ] = useState<number>();
    const [ cityName, setCityName ] = useState();
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
                const metricLink = `https://api.openweathermap.org/data/2.5/onecall?units=${units.METRIC.toLowerCase()}&lat=${latitude}&lon=${longitude}&exclude=minutely&appid=${openWeatherMapApiKey}`;
                const imperialLink = `https://api.openweathermap.org/data/2.5/onecall?units=${units.IMPERIAL.toLowerCase()}&lat=${latitude}&lon=${longitude}&exclude=minutely&appid=${openWeatherMapApiKey}`;
                const metricResponse = await axios.get(metricLink);
                const imperialResponse = await axios.get(imperialLink);
                setCurrentMetricTemperature(metricResponse.data.current.temp);
                setCurrentImperialTemperature(imperialResponse.data.current.temp);

                setHourlyMetricForecast(metricResponse.data.hourly.slice(1,13));
                setHourlyImperialForecast(imperialResponse.data.hourly.slice(1,13));
                setDailyMetricForecast(metricResponse.data.daily.slice(1,7));
                setDailyImperialForecast(imperialResponse.data.daily.slice(1,7));
        }

        async function getLocation() {
            const link = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${openWeatherMapApiKey}`;
            const response = await axios.get(link);
            if(response.data[0]) {
                setCityName(response.data[0].name);
            }
        }

        const getUserLocationData = () => {
            try {
                if(latitude && longitude) {
                    getLocation();
                    getWeatherData();
                }
            }catch (error) {
                    setWidgetStateMsg(unknownError)
                    console.error(error);
                }
            }

        getUserLocationData();

        setTimeout(() => {
            getUserLocationData();
            interval = setInterval(() => {
                getUserLocationData();
            }, 60*60*1000);
        }, timeOutValue);

        return () => {
            clearInterval(interval);
        }
    }, [latitude, longitude]);

    function successCallback(position: GeolocationPosition) {
        navigator.geolocation.getCurrentPosition(function(position) {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        });
    }

    function errorCallback(error: { code: number }) {
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
            { (longitude && latitude) ?
                <>
                    { cityName !== '' ? <div className="text-center">{cityName}</div> : undefined}
                    <CurrentWeather
                        lon={longitude.toFixed(2)}
                        lat={latitude.toFixed(2)}
                        currentTemperature={unit === units.METRIC ? currentMetricTemperature : currentImperialTemperature}
                    />
                    <HourlyWeatherWidget
                        forecast={unit === units.METRIC ? hourlyMetricForecast : hourlyImperialForecast}
                    />
                    <DailyWeatherWidget
                        forecast={unit === units.METRIC ? dailyMetricForecast : dailyImperialForecast}
                    />
                </> :
                widgetStateMsg
            }
        </div>
    );
}

export default UserLocationWidget;
