/**
 * y: [0,1,2,3,4...],
 * x: [0,1,2,3,4...],
 * road: [{x: 0,y:0},{x: 1,y:1}...],
 * lights: [{position: {x: 0, y:0}, color: "green/red", },],
 */
export function getMap(getPositionKey) {
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

  map.road = getRoad(map.x, map.y, getPositionKey);
  map.lights = getLights(getPositionKey);

  return map;
}

function getRoad(x, y, getPositionKey) {
  let road = {};

  for (let value in y) {
    road[getPositionKey(9, value)] = {};
    road[getPositionKey(10, value)] = {};
  }

  for (let value in x) {
    road[getPositionKey(value,10)] = {};
    road[getPositionKey(value,9)] = {};
  }

  return road;
}

function getLights(getPositionKey) {
  let lights = {};
  let topLine = [];
  let leftLine = [];

  for (let y = 19; y--; y >= 11) {
    topLine.push(getPositionKey(9, y));
  }

  for (let x = 0; x++; x <= 8) {
    leftLine.push(getPositionKey(x, 9));
  }

  lights[getPositionKey(9, 8)] = {
    color: 'green',
    ourLinePositions: topLine,
    dependsOnPositions: leftLine,
  };

  lights[getPositionKey(8, 9)] = {
    color: 'red',
    ourLinePositions: leftLine,
    dependsOnPositions: topLine,
  };

  return lights;
}