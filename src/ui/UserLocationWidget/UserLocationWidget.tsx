import {useEffect, useState} from 'react';
import axios from 'axios';
import {useAppSelector} from "../../hooks";
import CurrentWeather from "../common/CurrentWeather";
import {units} from "../constants";
import HourlyWeatherWidget from "./HourlyWeatherWidget";
import DailyWeatherWidget from "./DailyWeatherWidget";

const UserLocationWidget = () => {

    const [ latitude, setLatitude ] = useState(0);
    const [ longitude, setLongitude ] = useState(0);
    const [ cityName, setCityName ] = useState();
    const [ widgetStateMsg, setWidgetStateMsg ] = useState('Getting the position information...');
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
                setWidgetStateMsg('Sorry, your browser does not support HTML5 geolocation.');
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
            try {
                const metricLink = `https://api.openweathermap.org/data/2.5/onecall?units=${units.METRIC.toLowerCase()}&lat=${latitude}&lon=${longitude}&exclude=minutely&appid=142f9ff9f92c3016c4bcf76c093b8b64`;
                const imperialLink = `https://api.openweathermap.org/data/2.5/onecall?units=${units.IMPERIAL.toLowerCase()}&lat=${latitude}&lon=${longitude}&exclude=minutely&appid=142f9ff9f92c3016c4bcf76c093b8b64`;
                const metricResponse = await axios.get(metricLink);
                const imperialResponse = await axios.get(imperialLink);
                setCurrentMetricTemperature(metricResponse.data.current.temp);
                setCurrentImperialTemperature(imperialResponse.data.current.temp);

                console.log(metricResponse.data)

                setHourlyMetricForecast(metricResponse.data.hourly.slice(1,13));
                setHourlyImperialForecast(imperialResponse.data.hourly.slice(1,13));
                setDailyMetricForecast(metricResponse.data.daily.slice(1,7));
                setDailyImperialForecast(imperialResponse.data.daily.slice(1,7));

            } catch (error) {
                console.error(error);
            }
        }

        async function getLocation() {
            const link = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=a23560fa3f2603966851cd344571833b`;
            const response = await axios.get(link);
            if(response.data[0]) {
                setCityName(response.data[0].name);
            }
        }

        const getUserLocationData = () => {
            getLocation();
            getWeatherData();
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
            setWidgetStateMsg(`POSITION -> Latitude: ${position.coords.latitude} Longitude: ${position.coords.longitude}`)
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        });
    }

    function errorCallback(error: { code: number }) {
        if(error.code === 1) {
            setWidgetStateMsg('You\'ve decided not to share your position, unfortunately it\'s necessary for the app to work properly.');
        } else if(error.code === 2) {
            setWidgetStateMsg('The network is down or the positioning service can\'t be reached.');
        } else if(error.code === 3) {
            setWidgetStateMsg('The attempt timed out before it could get the location data.');
        } else {
            setWidgetStateMsg('Geolocation failed due to unknown error.');
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
