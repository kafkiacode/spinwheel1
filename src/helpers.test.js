/* global it, expect, describe */
import { diffAngles, toCartesian, toAngle, getPathData, isClockwiseSwipe } from './helpers';

describe('function diffAngles()', () => {
  // eslint-disable-next-line
  // const sydneyNSWQueryResult = [{"category":"LVR","id":617,"location":"UNSW SYDNEY","postcode":2052,"state":"NSW"},{"category":"Post Office Boxes","id":618,"location":"NORTH SYDNEY","postcode":2055,"state":"NSW"},{"category":"Post Office Boxes","id":621,"location":"NORTH SYDNEY","postcode":2059,"state":"NSW"},{"category":"Delivery Area","id":626,"latitude":-33.838265,"location":"NORTH SYDNEY","longitude":151.206481,"postcode":2060,"state":"NSW"},{"category":"Delivery Area","id":627,"latitude":-32.8310013,"location":"NORTH SYDNEY SHOPPINGWORLD","longitude":150.1390075,"postcode":2060,"state":"NSW"},{"category":"Post Office Boxes","id":508,"location":"SYDNEY","postcode":2001,"state":"NSW"},{"category":"Delivery Area","id":505,"latitude":-33.867139,"location":"SYDNEY","longitude":151.207114,"postcode":2000,"state":"NSW"},{"category":"Delivery Area","id":537,"latitude":-33.933077,"location":"SYDNEY DOMESTIC AIRPORT","longitude":151.177549,"postcode":2020,"state":"NSW"},{"category":"Delivery Area","id":538,"latitude":-33.935723,"location":"SYDNEY INTERNATIONAL AIRPORT","longitude":151.166246,"postcode":2020,"state":"NSW"},{"category":"Post Office Boxes","id":816,"location":"SYDNEY MARKETS","postcode":2129,"state":"NSW"},{"category":"Delivery Area","id":813,"latitude":-33.847896,"location":"SYDNEY OLYMPIC PARK","longitude":151.066669,"postcode":2127,"state":"NSW"},{"category":"Post Office Boxes","id":427,"location":"SYDNEY SOUTH","postcode":1235,"state":"NSW"},{"category":"Delivery Area","id":506,"latitude":-33.8743125,"location":"SYDNEY SOUTH","longitude":151.205873,"postcode":2000,"state":"NSW"},{"category":"Delivery Area","id":512,"latitude":-33.8877655,"location":"THE UNIVERSITY OF SYDNEY","longitude":151.1883894,"postcode":2006,"state":"NSW"},{"category":"Post Office Boxes","id":449,"location":"UNSW SYDNEY","postcode":1466,"state":"NSW"}];

  it('should calculate the arc between to sorted angles when under 180°', () => {
    const resultArc1 = diffAngles(30, 50);
    expect(resultArc1).toBe(20);
    const resultArc2 = diffAngles(50, 30);
    expect(resultArc2).toBe(-20);
    const resultArc3 = diffAngles(-85, 85);
    expect(resultArc3).toBe(170);
    const resultArc4 = diffAngles(85, -85);
    expect(resultArc4).toBe(-170);
  });
  it('should calculate the arc between to sorted angles in separate direction when over 180°', () => {
    const resultArc1 = diffAngles(170, -170);
    expect(resultArc1).toBe(20);
    const resultArc2 = diffAngles(-170, 170);
    expect(resultArc2).toBe(-20);
  });
});

describe('function toCartesian()', () => {
  const radius = 100;
  it('should calculate correctly basic coordinates', () => {
    const north = toCartesian(radius, 0);
    expect(north.x).toBeCloseTo(100);
    expect(north.y).toBeCloseTo(0);
    const east = toCartesian(radius, 90);
    expect(east.x).toBeCloseTo(200);
    expect(east.y).toBeCloseTo(100);
    const south = toCartesian(radius, 180);
    expect(south.x).toBeCloseTo(100);
    expect(south.y).toBeCloseTo(200);
    const west = toCartesian(radius, 270);
    expect(west.x).toBeCloseTo(0);
    expect(west.y).toBeCloseTo(100);
    const negativeWest = toCartesian(radius, -90);
    expect(negativeWest.x).toBeCloseTo(0);
    expect(negativeWest.y).toBeCloseTo(100);
  });
});

describe('function toAngle()', () => {
  const radius = 100;
  it('should transform coordinates into an angle', () => {
    const north = toAngle(100, 0, radius);
    expect(north).toBeCloseTo(0);
    const east = toAngle(200, 100, radius);
    expect(east).toBeCloseTo(90);
    const south = toAngle(100, 200, radius);
    expect(south).toBeCloseTo(180);
    const west = toAngle(0, 100, radius);
    expect(west).toBeCloseTo(-90);
  });
});

describe('function getPathData()', () => {
  it('should return correct data for drawing a segment using SVG <path>', () => {
    const pathData = getPathData(100, 45, 90);
    expect(pathData).toBe('M200,100 A100,100 0 0 0 170.71067811865476 29.28932188134526 L100,100 L100,100');
  });
});

describe('function isClockwiseSwipe()', () => {
  it('should return true only swipes that cover less than 135° clockwise', () => {
    const radius = 100;
    const correctSwipe = isClockwiseSwipe(
      radius,
      toCartesian(radius, 0),
      toCartesian(radius, 130),
    );
    expect(correctSwipe).toBe(true);
    const incorrectSwipeTooWide = isClockwiseSwipe(
      radius,
      toCartesian(radius, 0),
      toCartesian(radius, 140),
    );
    expect(incorrectSwipeTooWide).toBe(false);
    const incorrectSwipeAntiClockwise = isClockwiseSwipe(
      radius,
      toCartesian(radius, 90),
      toCartesian(radius, 45),
    );
    expect(incorrectSwipeAntiClockwise).toBe(false);
    const correctSwipeOverTheHorizon = isClockwiseSwipe(
      radius,
      toCartesian(radius, 170),
      toCartesian(radius, -170),
    );
    expect(correctSwipeOverTheHorizon).toBe(true);
  });
});
