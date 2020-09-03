/*
 * similar as here, reworked in ES6 manner, added methods + producer
 * https://xgrommx.github.io/rx-book/content/how_do_i/simple_event_emitter.html
 *
 *
 * Usage
 * var emitter = new EventEmitter();
 * var subcription = emitter.on('data', data => console.log(`data: ${data}`)
 * emitter.emit('data', 3); // => data: 3
 * subscription.dispose(); // Destroy the subscription
 */

import { of, range, Subject } from 'rxjs';
import { delay, concatMap, repeat } from 'rxjs/operators';

const randomDelay = (bottom, top) => {
  let delay = Math.floor(Math.random() * (top - bottom)) + bottom;
  return delay;
};

const defaultProducer = range(1, 5).pipe(
  concatMap((x) => of(x).pipe(delay(randomDelay(100, 2000)))),
  repeat(5)
);

var hasOwnProp = {}.hasOwnProperty;

const createName = (name) => {
  return `$ ${name}`;
};

class EventEmitter {
  constructor(producer) {
    this.subjects = {};
    this.producer = producer || defaultProducer;
  }

  startProducing = (name) => {
    var fnName = createName(name);
    this.subjects[fnName] || (this.subjects[fnName] = new Subject());
    this.producer.subscribe((i) => this.subjects[fnName].next(i));
  };

  emit = (name, data) => {
    var fnName = createName(name);
    this.subjects[fnName] || (this.subjects[fnName] = new Subject());
    this.subjects[fnName].next(data);
  };

  get = (name) => {
    var fnName = createName(name);
    this.subjects[fnName] || (this.subjects[fnName] = new Subject());
    return this.subjects[fnName];
  };

  on = (name, handler) => {
    var fnName = createName(name);
    this.subjects[fnName] || (this.subjects[fnName] = new Subject());
    return this.subjects[fnName].subscribe(handler);
  };

  dispose = () => {
    var subjects = this.subjects;
    for (var prop in subjects) {
      if (hasOwnProp.call(subjects, prop)) {
        subjects[prop].dispose();
      }
    }
    this.subjects = {};
  };
}

export default EventEmitter;
