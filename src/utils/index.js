export function getPositionByKey(key) {
  let xy = key.split('-')
  return {x: Number.parseInt(xy[0]), y: Number.parseInt(xy[1])}
}

export function getKey(x, y) {
  return x + '-' + y;
}