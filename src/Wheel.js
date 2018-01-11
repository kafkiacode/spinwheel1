import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers, withProps, setPropTypes } from 'recompose';
import { withContentRect } from 'react-measure';
import { getPathData, isClockwiseSwipe } from './helpers';

const styles = {
  containerDiv: {
    flexGrow: 1,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
  },
  base: {
    overflow: 'hidden',
    position: 'relative',
  },
  number: {
    height: '50%',
    width: '4em',
    position: 'absolute',
    top: 0,
    left: '50%',
    paddingTop: '.5em',
    marginLeft: '-2em',
    textAlign: 'center',
    transformOrigin: 'center bottom',
    boxSizing: 'border-box',
  },
  swipeable: {
    zIndex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
  },
  axis: {
    position: 'absolute',
    top: 0,
    left: 'calc(50% - 10px)',
    width: '20px',
    height: 0,
    background: 'transparent',
    borderLeft: '10px transparent solid',
    borderRight: '10px transparent solid',
    borderTop: '10px black solid',
  },
};

/**
 * colors scale borrowed from D3
 * @type {Array}
 */
const scale20b = [
  '#1f77b4',
  '#aec7e8',
  '#ff7f0e',
  '#ffbb78',
  '#2ca02c',
  '#98df8a',
  '#d62728',
  '#ff9896',
  '#9467bd',
  '#c5b0d5',
  '#8c564b',
  '#c49c94',
  '#e377c2',
  '#f7b6d2',
  '#7f7f7f',
  '#c7c7c7',
  '#bcbd22',
  '#dbdb8d',
  '#17becf',
  '#9edae5',
];

/**
 * A functional, not too beatutiful, stylable wheel
 */
export const Wheel = ({
  radius,
  style,
  rotation,
  numbersList,
  touchStart,
  attemptTouchEnd,
  measureRef,
}) => (<div
  style={styles.containerDiv}
  ref={measureRef}
>
  {radius && <div style={{
      ...styles.base,
      ...style,
      borderRadius: `${radius}px`,
      width: `${radius * 2}px`,
      height: `${radius * 2}px`,
    }}
  >
    <div style={{
      width: '100%',
      height: '100%',
      transformOrigin: '50% 50%',
      transform: `rotate(${rotation * 360}deg)`,
    }}
    >
      <svg
        width={radius * 2}
        height={radius * 2}
      >
        {numbersList.map((number, idx) => (<path
          key={number}
          style={{ fill: scale20b[idx % scale20b.length] }}
          d={getPathData(
            radius,
            (360 / numbersList.length) * idx,
            (360 / numbersList.length) * (idx + 1)
          )}
        />))}
      </svg>
      {numbersList.map((number, idx) => (<div
        className="numberLabel"
        key={number}
        style={{
          ...styles.number,
          transform: `rotate(${(idx + 0.5) * (360 / numbersList.length)}deg)`,
        }}
      >{number}</div>))}
    </div>
    { /* eslint-disable jsx-a11y/no-static-element-interactions */ }
    <div
      className="transparentSwipable"
      style={styles.swipeable}
      onTouchStart={(e) => {
        const rect = e.target.getBoundingClientRect();
        const touch = e.nativeEvent.changedTouches[0];
        touchStart({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        });
        e.preventDefault();
      }}
      onTouchEnd={(e) => {
        const rect = e.target.getBoundingClientRect();
        const touch = e.nativeEvent.changedTouches[0];
        attemptTouchEnd({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        });
        e.preventDefault();
      }}
      onMouseDown={e => touchStart({
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
      })}
      onMouseUp={e => attemptTouchEnd({
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
      })}
    />
    {/* eslint-enable jsx-a11y/no-static-element-interactions*/}
    <div style={styles.axis} />
  </div>}
</div>);

Wheel.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  /** Optional style hash */
  style: PropTypes.object,
  /** radius of the wheel, in pixels. Required only if it must be drawn hash */
  radius: PropTypes.number,
  /** rotation of the wheel, in arcs (1 = 360°) */
  rotation: PropTypes.number.isRequired,
  /** Array of numbers to draw in the wheel */
  numbersList: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  /** Function to call with internal coordinates on touch start (or mouse down) event */
  touchStart: PropTypes.func.isRequired,
  /** Function to call with internal coordinates on touch end (or mouse up) event */
  attemptTouchEnd: PropTypes.func.isRequired,
  /** Function to be applied as ref to the container div, to measure automatically the wheel size */
  measureRef: PropTypes.func.isRequired,
};

export const enhance = compose(
  setPropTypes({
    /** Specify the radius in pixels, or don't if you want the wheel to be the size of the container */
    radius: PropTypes.number,
    /** Rotation of the wheel, in arcs (1 = 360°) */
    rotation: PropTypes.number.isRequired,
    /** Array of numbers to draw in the wheel */
    numbersList: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    /** Function to call when a swipe has been made with mouse or touch events */
    onSwipe: PropTypes.func,
  }),
  withContentRect('bounds'),
  withProps(({ radius, contentRect: { bounds: { width, height } } }) => ({
    radius: radius || (width && height && Math.min(width, height) / 2),
  })),
  withState('touchPointCoords', 'setTouchPointCoords', null),
  withHandlers({
    touchStart: ({ setTouchPointCoords }) => ({ x, y }) => {
      setTouchPointCoords({ x, y });
    },
    attemptTouchEnd: ({ radius, onSwipe, touchPointCoords }) => ({ x, y }) => {
      if (onSwipe && touchPointCoords && isClockwiseSwipe(radius, touchPointCoords, { x, y })) {
        onSwipe();
      }
    },
  }),
);

export default enhance(Wheel);
