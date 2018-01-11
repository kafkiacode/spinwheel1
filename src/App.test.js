/* global it, expect, describe */
import React from 'react';
import { shallow } from 'enzyme';
import ReactDOM from 'react-dom';
import {
  default as App,
  App as SourceApp,
  stateHandlerStartWheel,
  stateHandlerStopWheel,
} from './App';
import { Motion } from 'react-motion';
import Wheel from './Wheel';

describe('Global application', () => {
  it('renders shallowly without crashing', () => {
    const component = shallow(<App />);
    expect(component.exists()).toEqual(true);
  });
  it('renders on DOM without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });
});

describe('Internal application component', () => {
  const component = shallow(<SourceApp {...{
    isSpinning: false,
    wheelRotation: 0,
    startWheel: () => null,
    stopWheel: () => null,
    chosenNumbers: [],
    numbersList: [],
  }}
  />);
  it('renders shallowly without crashing', () => {
    expect(component.exists()).toEqual(true);
  });
  it('contains one Motion element and one Wheel element', () => {
    expect(component.find(Motion).first().exists()).toEqual(true);
    expect(component.find(Wheel).first().exists()).toEqual(true);
  });
  // it('calls props.stopWheel() some time after setting a new rotation', (done) => {
  //   const stopWheel = () => {
  //     console.log(stopWheel);
  //     done();
  //   };
  //   mount(<SourceApp {...{
  //     isSpinning: true,
  //     wheelRotation: 0.9,
  //     startWheel: () => null,
  //     stopWheel,
  //     chosenNumbers: [],
  //     numbersList: [],
  //   }}
  //   />);
  // });
});

describe('recompose state handler function startWheel()', () => {
  it('returns a proper state based on current wheelRotation', () => {
    const initialWheelRotation = 5;
    const stateHandler = stateHandlerStartWheel({ wheelRotation: initialWheelRotation });
    const newState = stateHandler();
    expect(newState.isSpinning).toBe(true);
    expect(typeof newState.wheelRotation).toBe('number');
    expect(newState.wheelRotation).toBeGreaterThan(initialWheelRotation);
  });
});
describe('recompose state handler function stopWheel()', () => {
  it('returns a state indicating that the spinning stopped, with a new number', () => {
    const initialState = {
      numbersList: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
      chosenNumbers: [7, 6, 5, 4, 9],
      wheelRotation: 1, // meaning rotation of 0°
    };
    const stateHandler = stateHandlerStopWheel(initialState);
    const newState = stateHandler();

    expect(newState).toEqual({
      isSpinning: false,
      chosenNumbers: [
        6, 5, 4, 9,
        initialState.numbersList[9],
      ],
    });
  });
});
