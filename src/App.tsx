import React, {useEffect, useState} from 'react';
import './App.scss';

function App() {

    const [ latitude, setLatitude ] = useState(0)
    const [ longitude, setLongitude ] = useState(0)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function(position) {
            setLongitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        });
    }, []);

  return (
    <div className="App">
      <header className="App-header">
        NN Weather App
      </header>
    </div>
  );
}

export default App;
