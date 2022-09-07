import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'underscore';
import {useAppDispatch, useAppSelector} from '../../api/hooks/redux-hooks';
import { intervalSlice } from '../../api/redux/interval-slice';
import { cityCodes, openWeatherMapApiKey, units } from '../../api/constants/open-weather-constants';
import { widgetMessages } from '../../api/constants/widget-constants';
import CurrentWeather from '../common/CurrentWeather';

interface CityInformation {
    name: string,
    coord: { lon: number, lat: number },
    main: { temp: number },
}

const { prepareText, unknownError } = widgetMessages;

const CitiesWidget = () => {

    const dispatch = useAppDispatch();

    const darkMode = useAppSelector(state => state.darkMode.value);
    const unit = useAppSelector(state => state.units.value);
    const cityLoopInterval = useAppSelector(state => state.interval.value);

    const [ currentCityIndex, setCurrentCityIndex ] = useState(0);
    const [ currentMetricInformation, setCurrentMetricInformation ] = useState(new Array<CityInformation>());
    const [ currentImperialInformation, setCurrentImperialInformation ] = useState(new Array<CityInformation>());

    const [ widgetStateMsg, setWidgetStateMsg ] = useState(prepareText);

    useEffect(() => {
        let interval = setInterval(() => {
            if(currentMetricInformation.length !== 0 && currentImperialInformation.length !== 0) {
                setCurrentCityIndex(value => currentImperialInformation.length-1 !== value ?  value+1 : 0);
            }
        }, cityLoopInterval);

        return () => {
            clearInterval(interval);
        }
    }, [cityLoopInterval, currentMetricInformation.length, currentImperialInformation.length])

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

        async function getCitiesWeatherData() {
            try {
                const metricLink = `https://api.openweathermap.org/data/2.5/group?id=${Object.values(cityCodes).join(',')}&units=${units.METRIC.toLowerCase()}&appid=${openWeatherMapApiKey}`;
                const imperialLink = `https://api.openweathermap.org/data/2.5/group?id=${Object.values(cityCodes).join(',')}}&units=${units.IMPERIAL.toLowerCase()}&appid=${openWeatherMapApiKey}`;
                const metricResponse = await axios.get(metricLink);
                const imperialResponse = await axios.get(imperialLink);
                setCurrentMetricInformation(metricResponse.data.list);
                setCurrentImperialInformation(imperialResponse.data.list);
            } catch (error) {
                setWidgetStateMsg(unknownError);
                console.error(error);
            }
        }

        getCitiesWeatherData();

        setTimeout(() => {
            getCitiesWeatherData();
            interval = setInterval(() => {
                getCitiesWeatherData();
            }, 60*60*1000);
        }, timeOutValue);

        return () => {
            clearInterval(interval);
        }
    }, []);

    const handleIntervalChange = _.debounce(async (e: ChangeEvent) => {
        if(!_.isNaN(parseFloat((e.target as HTMLInputElement).value))) {
            dispatch(intervalSlice.actions.set(parseFloat((e.target as HTMLInputElement).value)*1000));
        }
    }, 500);

    return (
        <div
            className={`component weather-component text-center border ${darkMode ? 'border-warning' : 'border-dark'} rounded`}
        >
            { (currentMetricInformation.length !== 0 && currentImperialInformation.length !== 0) ?
                <>
                    <div className="text-center fw-bold">Cities around Hungary</div>
                    <div className="text-center">{currentMetricInformation[currentCityIndex].name}</div>
                    <CurrentWeather
                        lon={currentMetricInformation[currentCityIndex].coord.lon.toFixed(2)}
                        lat={currentMetricInformation[currentCityIndex].coord.lat.toFixed(2)}
                        currentTemperature={unit === units.METRIC ? currentMetricInformation[currentCityIndex].main.temp : currentImperialInformation[currentCityIndex].main.temp}
                    />
                    <div
                        className="interval-setter"
                    >

                        <label
                            htmlFor="setInterval"
                            className="m-1"
                        >
                            Interval (in s):
                        </label>
                        <input
                            type="number"
                            name="setInterval"
                            placeholder={(cityLoopInterval/1000).toString()}
                            onChange={handleIntervalChange}
                        />
                    </div>
                </> :
                widgetStateMsg
            }
        </div>
    );
}

export default CitiesWidget;
