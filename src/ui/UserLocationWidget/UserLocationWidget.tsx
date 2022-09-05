import { useEffect, useState } from 'react';
import axios from 'axios';
import {useAppSelector} from "../../hooks";

const UserLocationWidget = () => {

    const [ latitude, setLatitude ] = useState(0);
    const [ longitude, setLongitude ] = useState(0);
    const [ widgetStateMsg, setWidgetStateMsg ] = useState('');
    const unit = useAppSelector(state => state.units.value);

    useEffect(() => {
        const showPosition = () => {
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
                setWidgetStateMsg('Getting the position information...');
            } else {
                setWidgetStateMsg('Sorry, your browser does not support HTML5 geolocation.');
            }
        };

        showPosition();
    }, []);

    useEffect(() => {
        let interval: ReturnType<typeof setTimeout>;
        const currentDate = new Date();
        const nextRequestTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours()+1);
        const timeOutValue = nextRequestTime.getTime() - currentDate.getTime();


        async function getWeatherData() {
            try {
                const link = `https://api.openweathermap.org/data/2.5/onecall?units=${unit.toLowerCase()}&lat=${latitude}&lon=${longitude}&exclude=minutely&appid=a23560fa3f2603966851cd344571833b`;
                const response = await axios.get(link);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        getWeatherData();

        setTimeout(() => {
            getWeatherData();
            interval = setInterval(() => {
                getWeatherData();
            }, 60*60*1000);
        }, timeOutValue);

        return () => {
            clearInterval(interval);
        }
    }, [latitude, longitude, unit])

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
            className='component weather-component text-center'
        >
            { (longitude && latitude) ?
                <>

                </> :
                widgetStateMsg
            }
        </div>
    );
}

export default UserLocationWidget;
