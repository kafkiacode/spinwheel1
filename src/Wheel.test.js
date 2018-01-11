/* global jest, it, expect, describe */
import React from 'react';
import { compose, withProps } from 'recompose';
import { shallow, mount } from 'enzyme';
import { default as EnhancedWheel, Wheel, enhance } from './Wheel';

const numbersList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const radius = 100;
const defaultProps = {
  radius,
  rotation: 0,
  numbersList,
  touchStart: () => null,
  attemptTouchEnd: () => null,
  measureRef: () => null,
};

describe('Internal wheel component', () => {
  it('renders shallowly without crashing', () => {
    const component = shallow(<Wheel {...defaultProps} />);
    expect(component.exists()).toEqual(true);
  });
  it('doesn\'t draw anything beyond the container div if no radius was specified', () => {
    const component = shallow(<Wheel {...{ ...defaultProps, radius: null }} />);
    expect(component.exists()).toEqual(true);
    expect(component.find('div > div').exists()).toBe(false);
  });
  it('draws and svg element of the size specified by radius', () => {
    const component = shallow(<Wheel {...{ ...defaultProps }} />);
    const svg = component.find('svg');
    expect(svg.exists()).toBe(true);
    expect(svg.prop('width')).toEqual(radius * 2);
    expect(svg.prop('height')).toEqual(radius * 2);
  });
  it('draws as many svg paths and number divs as numbers passed', () => {
    const component = shallow(<Wheel {...defaultProps} />);
    expect(component.find('div.numberLabel').length).toBe(numbersList.length);
    expect(component.find('path').length).toBe(numbersList.length);
  });
  it('listens to mouse events', () => {
    const mockTouchStart = jest.fn();
    const mockAttemptTouchEnd = jest.fn();
    const component = mount(<Wheel {...{
      ...defaultProps,
      touchStart: mockTouchStart,
      attemptTouchEnd: mockAttemptTouchEnd,
    }}
    />);
    const swipeable = component.find('.transparentSwipable');
    swipeable.simulate('mousedown');
    swipeable.simulate('mouseup');
    expect(mockTouchStart.mock.calls.length).toBe(1);
    expect(mockAttemptTouchEnd.mock.calls.length).toBe(1);
  });
  it('listens to touch events without triggering mouse events', () => {
    const mockTouchStart = jest.fn();
    const mockAttemptTouchEnd = jest.fn();
    const component = mount(<Wheel {...{
      ...defaultProps,
      touchStart: mockTouchStart,
      attemptTouchEnd: mockAttemptTouchEnd,
    }}
    />);
    const swipeable = component.find('.transparentSwipable');
    const touchEventData = { nativeEvent: {changedTouches: [{ clientX: 10, clientY: 10 }]}};
    swipeable.simulate('touchstart', touchEventData);
    swipeable.simulate('touchend', touchEventData);
    expect(mockTouchStart.mock.calls.length).toBe(1);
    expect(mockAttemptTouchEnd.mock.calls.length).toBe(1);
  });
});

const enhancedDefaultProps = {
  rotation: 0,
  numbersList,
  onSwipe: () => null,
};

describe('Enhanced wheel component', () => {
  it('renders shallowly without crashing', () => {
    const component = shallow(<EnhancedWheel {...enhancedDefaultProps} />);
    expect(component.exists()).toEqual(true);
  });
  it('calls onSwipe() prop when clicked', () => {
    const onSwipe = jest.fn();
    const component = mount(<EnhancedWheel {...{ ...enhancedDefaultProps, onSwipe, radius }} />);
    const swipeable = component.find('.transparentSwipable');
    swipeable.simulate('mousedown', { nativeEvent: { offsetX: 100, offsetY: 10 } });
    swipeable.simulate('mouseup', { nativeEvent: { offsetX: 190, offsetY: 100 } });
    expect(onSwipe.mock.calls.length).toBe(1);
  });
});
