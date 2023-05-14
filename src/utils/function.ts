export function defineAny(...param) {
  return param.filter((e) => e !== undefined).length > 0;
}

export function defineAll(...param) {
  return param.filter((e) => e === undefined).length === 0;
}

export function getRandomItemInArray(array: any) {
  if (!Array.isArray(array)) return null;
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomPropertyFromObject(obj: any) {
  const values = Object.values(obj);
  return values[Math.floor(Math.random() * values.length)];
}
