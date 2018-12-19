import {getKey, getPositionByKey} from "../utils";

/**
 * y: [0,1,2,3,4...],
 * x: [0,1,2,3,4...],
 * road: [{x: 0,y:0},{x: 1,y:1}...],
 * lights: [{position: {x: 0, y:0}, color: "green/red", },],
 */
export function getMap() {
  let map = {
    x: [],
    y: [],
    road: {},
    lights: {},
  };

  for (let x = 0, y = 19; x < 20; x++, y--) {
    map.x.push(x);
    map.y.push(y);
  }

  map.road = getRoad(map.x, map.y);
  map.lights = getLights();

  return map;
}

function getRoad(x, y) {
  let road = {};

  for (let value in y) {
    if (y.hasOwnProperty(value) === false) {
      continue;
    }
    road[getKey(9, value)] = {};
    road[getKey(10, value)] = {};
  }

  for (let value in x) {
    if (x.hasOwnProperty(value) === false) {
      continue;
    }
    road[getKey(value,10)] = {};
    road[getKey(value,9)] = {};
  }

  return road;
}

function getLights() {
  let lights = {};
  let topLine = [];
  let leftLine = [];

  for (let y = 19; y--; y >= 11) {
    topLine.push(getKey(9, y));
  }

  for (let x = 0; x++; x <= 8) {
    leftLine.push(getKey(x, 9));
  }

  lights[getKey(9, 8)] = {
    color: 'green',
    ourLinePositions: topLine,
    dependsOnPositions: leftLine,
  };

  lights[getKey(8, 9)] = {
    color: 'red',
    ourLinePositions: leftLine,
    dependsOnPositions: topLine,
  };

  return lights;
}