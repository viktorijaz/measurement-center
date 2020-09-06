import React from 'react';
import { act } from 'react-dom/test-utils';
import { interval, combineLatest } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import Gauge from './Gauge';
import EventEmitter from '../helper/EventEmitter';

import { mount } from 'enzyme';

const THROTTLE_TIME = 2000;

describe('Gauge component user interface', () => {
  let temperature,
    humidity,
    pressure,
    compoundedStream = null;

  /**
   * For testing changes to user interface we will need to replace the random values
   * for the stream with something reproducible and tracable, like interval()
   * This logic will need to be Encapsulated further as an helper
   * so that can be used in a same form between tests and components
   */
  beforeEach(() => {
    jest.useFakeTimers();

    temperature = new EventEmitter(interval(1000));
    temperature.startProducing('data');

    humidity = new EventEmitter(interval(2000));
    humidity.startProducing('data');

    pressure = new EventEmitter(interval(3000));
    pressure.startProducing('data');

    compoundedStream = combineLatest(
      temperature.get('data'),
      pressure.get('data'),
      humidity.get('data')
    ).pipe(throttleTime(THROTTLE_TIME));
  });

  afterEach(() => {
    jest.clearAllTimers();
    temperature.dispose();
    pressure.dispose();
    humidity.dispose();
  });

  it('renders labels for temparature, pressure and humidity', () => {
    const wrapper = mount(<Gauge observable={compoundedStream} />);

    expect(wrapper.find('p').at(0).text()).toEqual('Temperature');
    expect(wrapper.find('p').at(1).text()).toEqual('Pressure');
    expect(wrapper.find('p').at(2).text()).toEqual('Humidity');
  });

  it('at the very start the value fields are blank', () => {
    const wrapper = mount(<Gauge observable={compoundedStream} />);

    expect(wrapper.find("[data-testid='temp-value']").text()).toBe('');

    expect(wrapper.find("[data-testid='humidity-value']").text()).toBe('');

    expect(wrapper.find("[data-testid='pressure-value']").text()).toBe('');
  });

  it('value fields stay blank until all three system emit one signal ', async () => {
    const wrapper = mount(<Gauge observable={compoundedStream} />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(wrapper.find("[data-testid='temp-value']").text()).toBe('');

    expect(wrapper.find("[data-testid='humidity-value']").text()).toBe('');

    expect(wrapper.find("[data-testid='pressure-value']").text()).toBe('');
  });

  it('first value emits only after all three systems emit one signal', async () => {
    const wrapper = mount(<Gauge observable={compoundedStream} />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(wrapper.find("[data-testid='temp-value']").text()).toMatch(/2/);

    expect(wrapper.find("[data-testid='humidity-value']").text()).toMatch(/0/);

    expect(wrapper.find("[data-testid='pressure-value']").text()).toMatch(/0/);
  });

  it('inactive it throttle_time has not passed after last emit', async () => {
    const wrapper = mount(<Gauge observable={compoundedStream} />);

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(wrapper.find("[data-testid='temp-value']").text()).toMatch(/2/);

    expect(wrapper.find("[data-testid='humidity-value']").text()).toMatch(/0/);

    expect(wrapper.find("[data-testid='pressure-value']").text()).toMatch(/0/);
  });

  it('emits the last value of the stream when throttle_time passes', () => {
    const wrapper = mount(<Gauge observable={compoundedStream} />);

    act(() => {
      jest.advanceTimersByTime(6000);
    });

    expect(wrapper.find("[data-testid='temp-value']").text()).toMatch(/5/);

    expect(wrapper.find("[data-testid='humidity-value']").text()).toMatch(/1/);

    expect(wrapper.find("[data-testid='pressure-value']").text()).toMatch(/0/);
  });
});
