import React from 'react';
import App from './App';
import { mount } from 'enzyme';

describe('Main App component', () => {
  it('renders Welcome header', () => {
    const wrapper = mount(<App />);

    expect(wrapper.find('h1').text()).toMatch(/Welcome/);
  });
});
