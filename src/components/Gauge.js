import React, { useState } from 'react';
import useObservable from '../helper/useObservable';

const Gauge = ({ observable }) => {
  const [currentTemp, setTemp] = useState();
  const [currentPressure, setPressure] = useState();
  const [currentHumidity, setHumidity] = useState();

  const callback = ([tempValue, pressureValue, humidityValue]) => {
    setTemp(tempValue);
    setPressure(pressureValue);
    setHumidity(humidityValue);
  };

  useObservable(observable, callback);

  return (
    <div className="gauge-container">
      <div>
        <p>Temperature</p>
        <h2 data-testid="temp-value">{currentTemp}</h2>
      </div>
      <div>
        <p>Pressure</p>
        <h2 data-testid="pressure-value">{currentPressure}</h2>
      </div>
      <div>
        <p>Humidity</p>
        <h2 data-testid="humidity-value">{currentHumidity}</h2>
      </div>
    </div>
  );
};

export default Gauge;
