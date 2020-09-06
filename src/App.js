import React from 'react';
import './App.css';

import Gauge from './components/Gauge';
import { startProducing, compoundedStream } from './helper/GaugeObservable';

function App() {
  startProducing();

  compoundedStream.subscribe(([tempValue, pressureValue, humidityValue]) => {
    //console.log('pressureValue', pressureValue);
  });

  return (
    <div className="App">
      <main>
        <h1>Welcome To Measurements Center</h1>
        <Gauge observable={compoundedStream} />
      </main>
    </div>
  );
}

export default App;
