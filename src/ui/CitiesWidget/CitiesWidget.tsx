import {useAppSelector} from "../../hooks";
import CurrentWeather from "../common/CurrentWeather";
import {cityCodes, units} from "../constants";
import {useEffect, useState} from "react";
import axios from "axios";


const CitiesWidget = () => {

    const darkMode = useAppSelector(state => state.darkMode.value);
    const unit = useAppSelector(state => state.units.value);
    const [ currentMetricInformation, setCurrentMetricInformation ] = useState([]);
    const [ currentImperialInformation, setCurrentImperialInformation ] = useState([]);
    const [ cityName, setCityName ] = useState('John Doe City');
    const [ widgetStateMsg, setWidgetStateMsg ] = useState('Getting the position information...');

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
                const metricLink = `https://api.openweathermap.org/data/2.5/group?id=${cityCodes.SZEGED},${cityCodes.BAJA},${cityCodes.BUDAPEST},${cityCodes.EGER},${cityCodes.PECS},${cityCodes.SOPRON}&units=${units.METRIC.toLowerCase()}&appid=a23560fa3f2603966851cd344571833b`;
                const imperialLink = `https://api.openweathermap.org/data/2.5/group?id=${cityCodes.SZEGED},${cityCodes.BAJA},${cityCodes.BUDAPEST},${cityCodes.EGER},${cityCodes.PECS},${cityCodes.SOPRON}&units=${units.IMPERIAL.toLowerCase()}&appid=a23560fa3f2603966851cd344571833b`;
                const metricResponse = await axios.get(metricLink);
                const imperialResponse = await axios.get(imperialLink);
            } catch (error) {
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
            { (currentImperialInformation.length === 0 && currentImperialInformation.length === 0) ?
                <>
                    { cityName !== '' ? <div className="text-center">{cityName}</div> : undefined}

                </> :
                widgetStateMsg
            }
        </div>
    );
}

export default CitiesWidget;
