import React from 'react';
import PropTypes from 'prop-types';
import shuffle from 'lodash/fp/shuffle';
import range from 'lodash/fp/range';
import { compose, defaultProps, withStateHandlers } from 'recompose';
import { Motion, spring } from 'react-motion';
import Wheel from './Wheel';
import './App.css';

const wheelNumbersCount = 10;

/**
 * Main App Component. Its properties are generated through the
 * enhancer HOC
 */
export const App = ({
  isSpinning,
  wheelRotation,
  startWheel,
  stopWheel,
  numbersList,
  chosenNumbers,
}) => (
  <div className="App" style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
    <div className="wheelSpace" style={{ flexGrow: 1, display: 'flex', padding: '50px' }}>
      <Motion
        defaultStyle={{ rotation: 0 }}
        style={{ rotation: spring(wheelRotation, { stiffness: 50, damping: 60 }) }}
        onRest={stopWheel}
      >{({ rotation }) => (
        <Wheel
          rotation={rotation}
          numbersList={numbersList}
          onSwipe={isSpinning ? undefined : startWheel}
        />
      )}</Motion>
    </div>
    <div
      className="numbers"
      style={{
        height: '6em',
        display: 'flex',
        justifyContent: 'flexStart',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div style={{ fontWeight: 'bold' }}>Numbers</div>
      <div>{chosenNumbers.join(' - ')}</div>
    </div>
  </div>
);

App.propTypes = {
  /** The wheel is currently spinning */
  isSpinning: PropTypes.bool.isRequired,
  /** The current rotation (in arcs) of the wheel */
  wheelRotation: PropTypes.number.isRequired,
  /** Function to call to start spinning the wheel */
  startWheel: PropTypes.func.isRequired,
  /** Function to call when the spin ends */
  stopWheel: PropTypes.func.isRequired,
  /** Array of numbers to draw in the wheel */
  numbersList: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  /** Array of the last 5 numbers thrown by the wheel */
  chosenNumbers: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
};

export const stateHandlerStartWheel = ({ wheelRotation }) => () => {
  const newWheelRotation = wheelRotation + 1 + Math.floor(Math.random() * 2) + Math.random();
  // console.log(wheelRotation, newWheelRotation);
  return { isSpinning: true, wheelRotation: newWheelRotation };
};
export const stateHandlerStopWheel = ({ numbersList, chosenNumbers, wheelRotation }) => () => {
  const newNumber = numbersList[
    numbersList.length
      - 1
      - Math.floor((wheelRotation % 1) * numbersList.length)
  ];
  return {
    isSpinning: false,
    chosenNumbers: [...chosenNumbers.slice(-4), newNumber],
  };
};
export default compose(
  defaultProps({ radius: 75 }),
  withStateHandlers(
    {
      isSpinning: false,
      wheelRotation: 0, // unit: arcs (360°)
      chosenNumbers: [],
      numbersList: shuffle(range(1, wheelNumbersCount + 1)),
      // numbersList: shuffle(Array.from(Array(wheelNumbersCount)).map((_, i) => i + 1)),
    },
    {
      startWheel: stateHandlerStartWheel,
      stopWheel: stateHandlerStopWheel,
    }
  )
)(App);
