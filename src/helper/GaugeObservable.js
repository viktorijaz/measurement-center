import { of, range, combineLatest } from 'rxjs';
import {
  concatMap,
  repeat,
  throttleTime,
  delay,
  map,
  debounceTime,
} from 'rxjs/operators';

import EventEmitter from './EventEmitter';

const LOWER_TIME = 100;
const UPPER_TIME = 2000;

const LOWER_TEMP = 10;
const UPPER_TEMP = 40;

const LOWER_HUM = 30;
const UPPER_HUM = 50;

const LOWER_PRES = 950;
const UPPER_PRES = 1050;

const IDLE_NAN = 1000;
const THROTTLE_TIME = 100;

const randomBetween = (bottom, top) => {
  let delay = Math.floor(Math.random() * (top - bottom)) + bottom;
  return delay;
};

const producer = (bottom, top) => {
  const producer = range(1, 5).pipe(
    concatMap((x) => of(x).pipe(delay(randomBetween(LOWER_TIME, UPPER_TIME)))),
    map((i) => randomBetween(bottom, top)),
    repeat(5)
  );
  return producer;
};

let temperature = new EventEmitter(producer(LOWER_TEMP, UPPER_TEMP));
temperature.startProducing('data');

let humidity = new EventEmitter(producer(LOWER_HUM, UPPER_HUM));
humidity.startProducing('data');

let pressure = new EventEmitter(producer(LOWER_PRES, UPPER_PRES));
pressure.startProducing('data');

const compoundedStream = combineLatest(
  temperature.get('data'),
  pressure.get('data'),
  humidity.get('data')
).pipe(throttleTime(THROTTLE_TIME));

const produceNaN = (subj) => {
  subj
    .get('data')
    .pipe(
      debounceTime(IDLE_NAN),
      map((i) => 'NaN')
    )
    .subscribe((i) => subj.emit('data', i));
};
const startProducing = () => {
  produceNaN(temperature);
  produceNaN(humidity);
  produceNaN(pressure);
};

export { startProducing, compoundedStream };
