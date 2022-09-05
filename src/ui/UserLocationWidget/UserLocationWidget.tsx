import {useEffect, useState} from 'react';


const UserLocationWidget = () => {

    const [ latitude, setLatitude ] = useState(0);
    const [ longitude, setLongitude ] = useState(0);
    const [ widgetStateMsg, setWidgetStateMsg ] = useState('');

    useEffect(() => {
        const showPosition = () => {
            // If geolocation is available, try to get the visitor's position
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
                setWidgetStateMsg('Getting the position information...');
            } else {
                setWidgetStateMsg('Sorry, your browser does not support HTML5 geolocation.');
            }
        };

        showPosition();
    }, []);

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

    const link = 'https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=a23560fa3f2603966851cd344571833b';

    return (
        <div
            className='component weather-component text-center'
        >
            {widgetStateMsg}
        </div>
    );
}

export default UserLocationWidget;
