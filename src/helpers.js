/**
 * A set of helper functions just for the context of our wheel
 * All of these simplify by considering the circle
 * with its top-left box corner at positioned at 0, 0
 */

/**
 * Measure the difference in angles considering cases that cross the horizon
 */
/**
 * Measure the difference in angles considering cases that cross the horizon
 * @param  Number angle1 Start angle, in degrees
 * @param  Number angle2 end angle, in degrees
 * @return Number        Angle of the difference, in degrees
 */
export const diffAngles = (angle1, angle2) => {
  const diff = angle2 - angle1;
  /* eslint-disable no-mixed-operators */
  return diff
    + ((diff < -180) * 360)
    - ((diff > 180) * 360);
  /* eslint-enable no-mixed-operators */
};

/**
 * generic: transform an angle
 * into cartesian coordinates of the circle border'
 * at the specified angle
 * @param  Number radius          The radius of the circle
 * @param  Number angle           The angle provided
 * @return {x: Number, y: Number} Coordinates
 */
export const toCartesian = (radius, angle) => {
  // eslint-disable-next-line no-mixed-operators
  const radiansAngle = (angle - 90) * Math.PI / 180;
  return {
    x: radius + (radius * Math.cos(radiansAngle)),
    y: radius + (radius * Math.sin(radiansAngle)),
  };
};

/**
 * Converts coordinates x y into an angle
 * from the center of a circle,
 * considering a north faced arc and a circle
 * with its top-left corner at coords 0, 0
 * @param  Number x       x coordinate
 * @param  Number y       y coordinate
 * @param  Number radius  Radius of the circle
 * @return Number         angle in degrees
 */
export const toAngle = (x, y, radius) =>
  Math.atan2(x - radius, radius - y) * (180 / Math.PI);

/**
 * Gets the 'd' attribute for an SVG path that draws a segment
 * @param  Number radius       radius of the circle
 * @param  Number initialAngle start of the segment, in degrees
 * @param  Number finalAngle   start of the segment, in degrees
 * @return String              to be used in <path d={...}>
 */
export const getPathData = (radius, initialAngle, finalAngle) => {
  const start = toCartesian(radius, finalAngle);
  const end = toCartesian(radius, initialAngle);
  const largeArcFlag = finalAngle - initialAngle <= 180 ? '0' : '1';
  return `M${start.x},${start.y} A${radius},${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
    + ` L${radius},${radius} L${radius},${radius}`;
};

/**
 * How much an arc is considered a swipe regarding the wheel.
 * Set to 3/8 of arc
 * @type Number
 */
const maxArcForSwipe = 135;

/**
 * Compares two coordinates to decide if the angle is limited enough
 * to be considered a Swipe (considering a threshold),
 * and if it's made in the right direction (clockwise)
 * @param  Number radius          Radius of the circle
 *                                (positioned with its top-left corner at 0, 0)
 * @param  {x: Number, y: Number} prevCoords coordinates of the touch down event
 * @param  {x: Number, y: Number} newCoords  coordinates of the touch up event
 * @return Boolean                True if we consider this a clockwise swipe
 */
export const isClockwiseSwipe = (radius, prevCoords, newCoords) => {
  // console.log(radius, prevCoords, newCoords);
  const prevAngle = Math.atan2(prevCoords.x - radius, radius - prevCoords.y) * (180 / Math.PI);
  const newAngle = Math.atan2(newCoords.x - radius, radius - newCoords.y) * (180 / Math.PI);
  const diff = diffAngles(prevAngle, newAngle);
  return diff > 0 && diff < maxArcForSwipe;
};
