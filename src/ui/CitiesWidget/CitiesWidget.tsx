import {useAppSelector} from "../../hooks";
import CurrentWeather from "../common/CurrentWeather";
import {cityCodes, units} from "../constants";
import {useEffect, useState} from "react";
import axios from "axios";

interface CityInformation {
    name: string,
    coord: { lon: number, lat: number },
    main: { temp: number },
}


const CitiesWidget = () => {

    const darkMode = useAppSelector(state => state.darkMode.value);
    const unit = useAppSelector(state => state.units.value);
    const [ currentCityIndex, setCurrentCityIndex ] = useState(0);
    const [ cityLoopInterval, setCityLoopInterval ] = useState(5000);
    const [ currentMetricInformation, setCurrentMetricInformation ] = useState(new Array<CityInformation>());
    const [ currentImperialInformation, setCurrentImperialInformation ] = useState(new Array<CityInformation>());
    const [ widgetStateMsg, setWidgetStateMsg ] = useState('Getting the position information...');

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
                const metricLink = `https://api.openweathermap.org/data/2.5/group?id=${Object.values(cityCodes).join(',')}&units=${units.METRIC.toLowerCase()}&appid=a23560fa3f2603966851cd344571833b`;
                const imperialLink = `https://api.openweathermap.org/data/2.5/group?id=${Object.values(cityCodes).join(',')}}&units=${units.IMPERIAL.toLowerCase()}&appid=a23560fa3f2603966851cd344571833b`;
                const metricResponse = await axios.get(metricLink);
                const imperialResponse = await axios.get(imperialLink);
                console.log(metricResponse.data.list);
                console.log(typeof metricResponse.data.list[0].coord.lon);
                setCurrentMetricInformation(metricResponse.data.list);
                setCurrentImperialInformation(imperialResponse.data.list);
            } catch (error) {
                setWidgetStateMsg('Unknown Error occured, please try again later!')
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

    return (
        <div
            className={`component weather-component text-center border ${darkMode ? 'border-warning' : 'border-dark'} rounded`}
        >
            { (currentMetricInformation.length !== 0 && currentImperialInformation.length !== 0) ?
                <>
                    <div className="text-center">{currentMetricInformation[currentCityIndex].name}</div>
                    <CurrentWeather
                        lon={currentMetricInformation[currentCityIndex].coord.lon.toFixed(2)}
                        lat={currentMetricInformation[currentCityIndex].coord.lat.toFixed(2)}
                        currentTemperature={unit === units.METRIC ? currentMetricInformation[currentCityIndex].main.temp : currentImperialInformation[currentCityIndex].main.temp}
                    />
                </> :
                widgetStateMsg
            }
        </div>
    );
}

export default CitiesWidget;
